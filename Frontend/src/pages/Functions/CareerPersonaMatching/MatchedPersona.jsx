import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, FileText, AlertTriangle } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import SidebarSub from '../../../component/template/SidebarSub';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function PersonaMatcherPage() {
  const [jobs, setJobs] = useState([
    { id: 1, title: 'Frontend Developer', skill: 'React, JavaScript, HTML/CSS', progress: 75 },
    { id: 2, title: 'Backend Developer', skill: 'Node.js, Express, MongoDB', progress: 60 },
    { id: 3, title: 'UX Designer', skill: 'Figma, User Research, Wireframing', progress: 85 },
    { id: 4, title: 'DevOps Engineer', skill: 'Docker, Kubernetes, CI/CD', progress: 10 },
  ]);
  
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [matchedPersonas, setMatchedPersonas] = useState([]);
  const [pdfPreviewErrors, setPdfPreviewErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  
  const [extractedTexts, setExtractedTexts] = useState({});
  const [showFullText, setShowFullText] = useState({});
  const [isValidating, setIsValidating] = useState({});
  const [pdfJsLoaded, setPdfJsLoaded] = useState(false);
  const [isExtracting, setIsExtracting] = useState({});
  
  // Initialize Google Generative AI
  const [aiModel, setAiModel] = useState(null);
  
  // Load PDF.js from CDN
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
    script.async = true;
    script.onload = () => {
      setPdfJsLoaded(true);
      // Configure the worker
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
    };
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  useEffect(() => {
    const initializeAI = async () => {
      try {
        const apiKey = "AIzaSyCQUQ9sYtjSjasfpps4bK00hUkqdMwSDV0";
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: "gemini-2.0-flash-exp-image-generation",
          systemInstruction: "You are the checker for CV or certificate documents. Check if the input data is a CV or certificate. If it's a CV or certificate, output 'true'. If it's not a CV or certificate, output 'false'. Only output true or false without any additional text."
        });
        
        setAiModel(model);
      } catch (error) {
        console.error('Error initializing AI model:', error);
        setAlertMessage({
          type: 'error',
          text: 'Failed to initialize document validator. Please try again later.'
        });
      }
    };
    
    initializeAI();
  }, []);
  
  const handleNavigate = () => {
    // Combine all extracted texts into one string
    const combinedText = Object.values(extractedTexts).join("\n\n");
    navigate("/Personas", {state: {msg: combinedText}});
  };
  
  const validatePdfContent = async (text, fileId) => {
    if (!aiModel) {
      console.error('AI model not initialized');
      return true; // Default to accepting if AI is not available
    }
    
    setIsValidating(prev => ({...prev, [fileId]: true}));
    
    try {
      const generationConfig = {
        temperature: 0.2,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 8192,
      };
      
      const chatSession = aiModel.startChat({
        generationConfig,
        history: [],
      });
      
      const result = await chatSession.sendMessage(
        `Please verify if the following text is from a CV or certificate document. Only respond with 'true' or 'false'. Here's the text:\n\n${text}`
      );
      
      const response = await result.response.text();
      const isValid = response.toLowerCase().includes('true');
      
      setIsValidating(prev => {
        const updated = {...prev};
        delete updated[fileId];
        return updated;
      });
      
      return isValid;
    } catch (error) {
      console.error('Error validating PDF content:', error);
      setIsValidating(prev => {
        const updated = {...prev};
        delete updated[fileId];
        return updated;
      });
      return true; // Default to accepting if validation fails
    }
  };
  
  // Enhanced PDF text extraction (from PDFTextExtractor)
  const extractText = async (file, fileId) => {
    if (!pdfJsLoaded) {
      setAlertMessage({
        type: 'warning',
        text: 'PDF.js library is still loading. Please try again in a moment.'
      });
      return;
    }

    setIsExtracting(prev => ({...prev, [fileId]: true}));
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
      
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Improved text extraction that maintains some formatting
        const textItems = textContent.items;
        let lastY = null;
        let text = '';
        
        for (const item of textItems) {
          if (lastY !== item.transform[5] && lastY !== null) {
            text += '\n'; // New line when y-position changes
          }
          text += item.str;
          if (item.hasEOL) text += '\n';
          lastY = item.transform[5];
        }
        
        fullText += `=== Page ${i} ===\n${text}\n\n`;
      }
      
      // Validate if the PDF is a CV or certificate
      const isValid = await validatePdfContent(fullText, fileId);
      
      if (isValid) {
        setExtractedTexts(prev => ({
          ...prev,
          [fileId]: fullText
        }));
      } else {
        // Remove the file if it's not a valid CV or certificate
        removeFile(fileId);
        setAlertMessage({
          type: 'warning',
          text: `"${file.name}" is not a valid CV or certificate. Please upload a valid document.`
        });
      }
    } catch (error) {
      console.error('Error extracting text:', error);
      setAlertMessage({
        type: 'error',
        text: `Failed to extract text from "${file.name}": ${error.message}`
      });
      setPdfPreviewErrors(prev => ({
        ...prev,
        [fileId]: true
      }));
    } finally {
      setIsExtracting(prev => {
        const updated = {...prev};
        delete updated[fileId];
        return updated;
      });
    }
  };
  
  useEffect(() => {
    if (uploadedFiles.length > 0) {
      handleMatchPersonas();
    }
  }, [uploadedFiles]);
  
  // Clear alert message after 5 seconds
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files).map((file) => {
      const fileId = Date.now() + Math.random().toString(36).substr(2, 9);
      
      // Extract text from PDF files
      if (file.type === 'application/pdf') {
        extractText(file, fileId);
      }
      
      return {
        file,
        id: fileId,
        preview: URL.createObjectURL(file),
        name: file.name,
        type: file.type,
      };
    });
    
    setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
    setIsUploading(true);
  };

  const removeFile = (id) => {
    const fileToRemove = uploadedFiles.find((fileObj) => fileObj.id === id);
    if (fileToRemove && fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    
    const updatedFiles = uploadedFiles.filter((fileObj) => fileObj.id !== id);
    setUploadedFiles(updatedFiles);

    if (updatedFiles.length === 0) {
      setIsUploading(false);
      setMatchedPersonas([]);
    }
    
    // Remove any errors associated with this file
    setPdfPreviewErrors(prev => {
      const updated = {...prev};
      delete updated[id];
      return updated;
    });
    
    // Remove extracted text for this file
    setExtractedTexts(prev => {
      const updated = {...prev};
      delete updated[id];
      return updated;
    });
    
    // Remove showFullText state for this file
    setShowFullText(prev => {
      const updated = {...prev};
      delete updated[id];
      return updated;
    });
    
    // Remove validating state for this file
    setIsValidating(prev => {
      const updated = {...prev};
      delete updated[id];
      return updated;
    });
    
    // Remove extracting state for this file
    setIsExtracting(prev => {
      const updated = {...prev};
      delete updated[id];
      return updated;
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleMatchPersonas = () => {
    const mockMatchedPersonas = uploadedFiles.map((file, index) => ({
      id: file.id,
      name: `Career Persona ${index + 1}`,
      fileName: file.name,
      confidence: Math.floor(Math.random() * 100),
    }));
    setMatchedPersonas(mockMatchedPersonas);
  };

  const handlePreviewError = (id) => {
    setPdfPreviewErrors(prev => ({
      ...prev,
      [id]: true
    }));
  };
  
  const toggleFullText = (fileId) => {
    setShowFullText(prev => ({
      ...prev,
      [fileId]: !prev[fileId]
    }));
  };

  const PDFPreview = ({ url, fileId, fileName }) => {
    return (
      <div className="pdf-preview-container h-full">
        {pdfPreviewErrors[fileId] ? (
          <div className="flex flex-col items-center justify-center h-full text-red-500">
            <AlertTriangle className="w-12 h-12 mb-4" />
            <p>Failed to load PDF preview</p>
          </div>
        ) : (
          <iframe
            src={url}
            width="100%"
            height="100%"
            title={`PDF Preview - ${fileName}`}
            onError={() => handlePreviewError(fileId)}
            className="border rounded-lg"
          />
        )}
      </div>
    );
  };

  const Alert = ({ type, text }) => {
    const bgColor = type === 'error' ? 'bg-red-100 border-red-500 text-red-700' : 
                   type === 'warning' ? 'bg-yellow-100 border-yellow-500 text-yellow-700' : 
                   'bg-blue-100 border-blue-500 text-blue-700';
    
    const Icon = type === 'error' ? AlertTriangle : 
                type === 'warning' ? AlertTriangle : 
                FileText;
    
    return (
      <div className={`${bgColor} border-l-4 p-4 mb-4 rounded shadow-sm`}>
        <div className="flex items-center">
          <Icon className="h-5 w-5 mr-2" />
          <p>{text}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarSub />

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Persona Matcher</h1>
            <p className="text-sm text-gray-500">My Persona's</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium mr-2">
                JS
              </div>
              <span className="text-sm font-medium text-gray-700">John Smith</span>
            </div>
          </div>
        </header>

        <main className="p-6 flex-1 overflow-y-auto bg-white">
          {alertMessage && (
            <Alert type={alertMessage.type} text={alertMessage.text} />
          )}
          
          <div className="bg-white">
            <div className="">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Matched Career Persona's</h2>
                <button
                  onClick={triggerFileInput}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  <Upload className="w-5 h-5" />
                  Upload Certificates
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Persona matching will be performed by finding matching persona's based on the certifications provided.
                <span className="font-bold ml-1">Only CV or certificate documents are accepted.</span>
              </p>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileUpload}
              />

              {uploadedFiles.length === 0 ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-300 transition w-[300px]"
                  onClick={triggerFileInput}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Upload CV or Certificates</p>
                  <p className="text-sm text-gray-500">Drag and drop or click to browse</p>
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {uploadedFiles.map((fileObj) => (
                      <div
                        key={fileObj.id}
                        className="relative border rounded-lg overflow-hidden h-64"
                      >
                        <div className="absolute top-0 left-0 right-0 bg-white/90 p-2 z-10 border-b flex justify-between items-center">
                          <span className="text-sm font-medium truncate">{fileObj.name}</span>
                          <div className="flex items-center">
                            {(isValidating[fileObj.id] || isExtracting[fileObj.id]) && (
                              <div className="mr-2 flex items-center">
                                <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full mr-1"></div>
                                <span className="text-xs text-blue-500">
                                  {isValidating[fileObj.id] ? "Validating" : "Extracting"}
                                </span>
                              </div>
                            )}
                            <button
                              onClick={() => removeFile(fileObj.id)}
                              className="bg-white rounded-full p-1 hover:bg-gray-100"
                            >
                              <X className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                        
                        {fileObj.type === 'application/pdf' ? (
                          <PDFPreview 
                            url={fileObj.preview} 
                            fileId={fileObj.id}
                            fileName={fileObj.name}
                          />
                        ) : (
                          <img
                            src={fileObj.preview}
                            alt={fileObj.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    ))}
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center cursor-pointer hover:border-blue-300 h-64"
                      onClick={triggerFileInput}
                    >
                      <Upload className="w-8 h-8 text-gray-400 mr-2" />
                      <span className="text-gray-600">Add More</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {Object.keys(extractedTexts).length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Extracted Text from PDFs</h3>
              
              {uploadedFiles.map(fileObj => (
                fileObj.type === 'application/pdf' && extractedTexts[fileObj.id] ? (
                  <div key={`text-${fileObj.id}`} className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <h4 className="text-md font-medium">{fileObj.name}</h4>
                      <button 
                        onClick={() => toggleFullText(fileObj.id)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {showFullText[fileObj.id] ? "Show Less" : "Show Full Text"}
                      </button>
                    </div>
                    <div className={`text-sm text-gray-700 border p-2 bg-white rounded font-mono ${!showFullText[fileObj.id] ? 'max-h-32 overflow-y-auto' : 'max-h-96 overflow-y-auto'}`}>
                      {showFullText[fileObj.id] 
                        ? extractedTexts[fileObj.id] 
                        : extractedTexts[fileObj.id].substring(0, 500) + (extractedTexts[fileObj.id].length > 500 ? "..." : "")
                      }
                    </div>
                  </div>
                ) : null
              ))}
            </div>
          )}
          
          <div className="fixed bottom-4 left-0 right-0 flex justify-center">
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition"
              onClick={handleNavigate}
              disabled={Object.keys(extractedTexts).length === 0}
            >
              Match persona
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}