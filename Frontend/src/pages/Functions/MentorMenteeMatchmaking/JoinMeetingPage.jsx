import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import userProfileHandleService from '../../../services/userProfileHandleService';

export default function JoinMeetingPage() {
  const [step, setStep] = useState('connect');
  const [form, setForm] = useState({ id: '', email: '' });
  const [meeting, setMeeting] = useState(null);
  const [error, setError] = useState('');
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Ready to connect');
  const [peerLibLoaded, setPeerLibLoaded] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'mentor' or 'mentee'
  const localRef = useRef();
  const remoteRef = useRef();
  const peerRef = useRef();
  const [profileDetails, setProfileDetails] = useState();

  // id
  const { meetingId } = useParams();

  useEffect(() => {
    const fetchMeeting = async () => {
      if (meetingId) {
        try {
          const response = await axios.get(`http://localhost:8080/api/v2/matchmaking/meeting/meetingId/${meetingId}`);
          setMeeting(response.data);
        } catch (error) {
          console.error('Failed to fetch meeting:', error);
          setError('Failed to fetch meeting details. Please try again.');
        }
      }
    };
    fetchMeeting();

    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.user_id && user.token) {
      userProfileHandleService
        .findUserProfileById(user.user_id)
        .then((response) => {
          setProfileDetails(response.data);
        })
        .catch((error) => {
          console.error('Failed to fetch user profile:', error);
          setError('Failed to fetch user profile. Please try again.');
        });
    } else {
      setError('User authentication required. Please log in.');
    }
  }, [meetingId]);

  // Determine user role when both meeting and profile details are available
  useEffect(() => {
    if (meeting && profileDetails && profileDetails.email) {
      if (profileDetails.email === meeting.mentor) {
        setUserRole('mentor');
        setForm((prev) => ({ ...prev, email: profileDetails.email }));
      } else if (profileDetails.email === meeting.mentee) {
        setUserRole('mentee');
        setForm((prev) => ({ ...prev, email: profileDetails.email }));
      } else {
        setError(
          'You are not authorized to join this meeting. Your email does not match the mentor or mentee for this session.'
        );
      }
    }
  }, [meeting, profileDetails]);

  // Load PeerJS library
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/peerjs/1.4.7/peerjs.min.js';
    script.onload = () => setPeerLibLoaded(true);
    script.onerror = () => setError('Failed to load PeerJS library');
    document.head.appendChild(script);

    return () => {
      try {
        document.head.removeChild(script);
      } catch (e) {
        // Ignore cleanup errors
      }
    };
  }, []);

  const getUserMediaCompat = () => {
    return new Promise((resolve, reject) => {
      const constraints = { video: true, audio: true };

      // Use modern getUserMedia API
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(constraints).then(resolve).catch(reject);
      }
      // Fallback to legacy getUserMedia
      else if (typeof navigator.getUserMedia === 'function') {
        navigator.getUserMedia(constraints, resolve, reject);
      } else {
        reject(new Error('getUserMedia is not supported in this browser'));
      }
    });
  };

  useEffect(() => {
    if (step !== 'connect' || !meeting || !peerLibLoaded || !userRole || !profileDetails) return;

    let peer;
    let mediaStream;

    const initializeConnection = async () => {
      try {
        // Get user media first
        try {
          mediaStream = await getUserMediaCompat();
          console.log('Media stream acquired successfully');
          setLocalStream(mediaStream);
          if (localRef.current) {
            localRef.current.srcObject = mediaStream;
          }
        } catch (mediaError) {
          console.error('Media access error:', mediaError);
          let errorMessage = 'Could not access camera/microphone. ';

          if (mediaError.name === 'NotAllowedError' || mediaError.name === 'PermissionDeniedError') {
            errorMessage += 'Please allow camera and microphone permissions and try again.';
          } else if (mediaError.message) {
            errorMessage += mediaError.message;
          }
          setError(errorMessage);
          return;
        }

        // Create peer IDs based on meeting and role
        const mentorPeerId = `meeting_${meeting.id}_mentor`;
        const menteePeerId = `meeting_${meeting.id}_mentee`;

        const ismentor = userRole === 'mentor';
        const myPeerId = ismentor ? mentorPeerId : menteePeerId;
        const targetPeerId = ismentor ? menteePeerId : mentorPeerId;

        setConnectionStatus('Connecting to peer network...');

        peer = new window.Peer(myPeerId, {
          debug: 2,
          config: {
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }],
          },
        });

        peerRef.current = peer;

        peer.on('open', (id) => {
          console.log('Peer connected with ID:', id);
          setConnectionStatus(ismentor ? 'Waiting for mentee to join...' : 'Waiting for mentor to join...');

          if (ismentor) {
            // Mentor waits for mentee to call
            peer.on('call', (call) => {
              console.log('Receiving call from mentee');
              call.answer(mediaStream);
              call.on('stream', (remoteStream) => {
                console.log('Received remote stream from mentee');
                setRemoteStream(remoteStream);
                setConnectionStatus('Connected!');
              });
              call.on('error', (err) => {
                console.error('Call error:', err);
                setError('Call failed: ' + err.message);
              });
            });
          } else {
            // Mentee calls mentor after a short delay
            setTimeout(() => {
              console.log('Calling mentor...');
              const call = peer.call(targetPeerId, mediaStream);
              if (call) {
                call.on('stream', (remoteStream) => {
                  console.log('Received remote stream from mentor');
                  setRemoteStream(remoteStream);
                  setConnectionStatus('Connected!');
                });

                call.on('error', (err) => {
                  console.error('Call error:', err);
                  setError('Failed to connect to mentor. Make sure they joined first.');
                });
              } else {
                setError('Failed to initiate call. Please try again.');
              }
            }, 3000); // Wait 3 seconds
          }
        });

        peer.on('error', (err) => {
          console.error('Peer error:', err);
        });

        peer.on('disconnected', () => {
          setConnectionStatus('Reconnecting...');
          if (!peer.destroyed) {
            peer.reconnect();
          }
        });

        peer.on('close', () => {
          setConnectionStatus('Connection closed');
        });
      } catch (err) {
        console.error('Connection error:', err);
        setError('Failed to initialize connection: ' + err.message);
      }
    };

    initializeConnection();

    // Cleanup function
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
      if (peer && !peer.destroyed) {
        peer.destroy();
      }
    };
  }, [step, meeting, userRole, profileDetails, peerLibLoaded]);

  useEffect(() => {
    if (remoteStream && remoteRef.current) {
      remoteRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Don't render the main UI until we have all required data
  if (!meeting || !profileDetails || !userRole) {
    return (
      <div className="h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        {error ? (
          <div className="bg-red-500 text-white p-3 rounded mb-4 max-w-2xl text-center">
            <div className="font-semibold">Error</div>
            <div className="text-sm mt-1">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading meeting details...</p>
          </div>
        )}
      </div>
    );
  }

  // Main UI for the video call
  return (
    <div className="h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      {error && (
        <div className="bg-red-500 text-white p-3 rounded mb-4 max-w-2xl text-center">
          <div className="font-semibold">Connection Error</div>
          <div className="text-sm mt-1">{error}</div>
        </div>
      )}

      <div className="mb-4 text-white text-center">
        <h3 className="text-lg font-semibold">{meeting?.title || 'Video Meeting'}</h3>
        <p className="text-gray-400">Status: {connectionStatus}</p>
        <p className="text-sm text-gray-500">
          Role: {userRole} {userRole === 'mentor' ? '(Host)' : '(Guest)'}
          {connectionStatus === 'Connected!' && <div className="mt-2 text-green-400 text-sm">✅ Connected!</div>}
        </p>
      </div>

      <div
        className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg"
        style={{ width: '1000px', height: '600px', maxWidth: '90vw', maxHeight: '60vh' }}
      >
        {/* Remote video (main view) */}
        <video
          ref={remoteRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
          style={{ backgroundColor: '#374151' }}
        />

        {/* Show message when no remote stream */}
        {!remoteStream && (
          <div className="absolute inset-0 flex items-center justify-center text-white text-center p-4">
            <div>
              <div className="text-lg mb-2">
                {userRole === 'mentor' ? 'Waiting for mentee to join...' : 'Connecting to mentor...'}
              </div>
              <div className="text-sm text-gray-300">{connectionStatus}</div>
            </div>
          </div>
        )}

        {/* Local video (picture-in-picture) */}
        <div
          className="absolute bottom-4 right-4 bg-gray-700 rounded-lg overflow-hidden shadow-lg border-2 border-gray-600"
          style={{ width: '200px', height: '150px' }}
        >
          <video ref={localRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            You ({userRole})
          </div>
        </div>
      </div>

      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => {
            setStep('form');
            setRemoteStream(null);
            setLocalStream(null);
            setConnectionStatus('Ready to connect');
          }}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Leave Meeting
        </button>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Reconnect
        </button>
      </div>
    </div>
  );
}
