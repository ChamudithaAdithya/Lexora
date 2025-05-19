import React, { useState, useRef, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import SidebarSub from '../../../component/template/SidebarSub';

export default function PersonaMatcherPage() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [matchedPersonas, setMatchedPersonas] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Automatically match personas when files are uploaded
    if (uploadedFiles.length > 0) {
      handleMatchPersonas();
    }
  }, [uploadedFiles]);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map((file) => ({
      file,
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      preview: URL.createObjectURL(file),
      name: file.name
    }));
    setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    setIsUploading(true);
  };

  const removeFile = (id) => {
    const fileToRemove = uploadedFiles.find((fileObj) => fileObj.id === id);
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    const updatedFiles = uploadedFiles.filter((fileObj) => fileObj.id !== id);
    setUploadedFiles(updatedFiles);
    
    if (updatedFiles.length === 0) {
      setIsUploading(false);
      setMatchedPersonas([]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleMatchPersonas = () => {
    // Ensure matching occurs when files are uploaded
    const mockMatchedPersonas = uploadedFiles.map((file, index) => ({
      id: file.id,
      name: `Career Persona ${index + 1}`,
      fileName: file.name,
      confidence: Math.floor(Math.random() * 100)
    }));

    setMatchedPersonas(mockMatchedPersonas);
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
               className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-300 transition w-[300px] "
               onClick={triggerFileInput}
             >
               <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
               <p className="text-gray-600 mb-2">Upload Certificates</p>
               <p className="text-sm text-gray-500">Drag and drop or click to browse</p>
             </div>
             
              ) : (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {uploadedFiles.map((fileObj) => (
                      <div key={fileObj.id} className="relative border rounded-lg overflow-hidden">
                        <img
                          src={fileObj.preview}
                          alt="Preview"
                          className="w-full h-56 object-cover"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(fileObj.id);
                          }}
                          className="absolute top-2 right-2 bg-white/80 rounded-full p-1 hover:bg-white"
                        >
                          <X className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                    ))}
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center cursor-pointer hover:border-blue-300"
                      onClick={triggerFileInput}
                    >
                      <Upload className="w-8 h-8 text-gray-400 mr-2" />
                      <span className="text-gray-600">Add More</span>
                    </div>
                  </div>

                  {/* Matched Personas Section - Always Displayed When Files Exist */}
                  {/* <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Matched Personas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {matchedPersonas.map((persona) => (
                        <div 
                          key={persona.id} 
                          className="bg-white border rounded-lg p-4 shadow-sm"
                        >
                          <h4 className="font-medium text-gray-700 mb-2">{persona.name}</h4>
                          <p className="text-sm text-gray-500 mb-2">
                            File: {persona.fileName}
                          </p>
                          <p className="text-sm text-gray-500">
                            Confidence: {persona.confidence}%
                          </p>
                        </div>
                      ))}
                    </div>
                  </div> */}
                </div>
              )}
            </div>
          </div>

          {/* Save Button at Bottom Center */}
          <div className="fixed bottom-4 left-0 right-0 flex justify-center">
            <button 
              className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition"
              onClick={() => alert('Saved!')}
            >
              Save
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
