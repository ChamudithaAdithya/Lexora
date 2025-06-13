// JoinMeetingPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Peer from 'peerjs';

export default function MeetingNew() {
  const [search] = useSearchParams();
  const [error, setError] = useState('');
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const localRef = useRef();
  const remoteRef = useRef();
  const peerRef = useRef();

  useEffect(() => {
    const id = search.get('id');
    const email = search.get('email');
    const meet = JSON.parse(localStorage.getItem('meetings') || '[]').find((m) => m.id === id);
    if (!meet) return setError('Meeting not found');

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((s) => {
        setStream(s);
        localRef.current.srcObject = s;

        const peer = new Peer(email + '_' + Date.now());
        peerRef.current = peer;

        peer.on('open', () => {
          if (meet.creator === email) {
            peer.on('call', (call) => {
              call.answer(s);
              call.on('stream', (rs) => setRemoteStream(rs));
            });
          } else {
            const call = peer.call(meet.creator + '_' + new Date(meet.date + 'T' + meet.start).getTime(), s);
            call.on('stream', (rs) => setRemoteStream(rs));
          }
        });
      })
      .catch(() => setError('Camera/Mic access denied'));
  }, [search]);

  useEffect(() => {
    if (remoteStream && remoteRef.current) remoteRef.current.srcObject = remoteStream;
  }, [remoteStream]);

  return (
    <div className="h-screen bg-gray-900 flex flex-col items-center justify-center">
      {error && <div className="bg-red-500 text-white p-2 rounded">{error}</div>}
      <div className="relative w-80 h-56 bg-gray-800 mb-4">
        <video ref={remoteRef} autoPlay playsInline className="w-full h-full object-cover" />
        <div className="absolute bottom-2 right-2 w-24 h-16 bg-gray-700">
          <video ref={localRef} autoPlay muted playsInline className="w-full h-full object-cover rounded" />
        </div>
      </div>
    </div>
  );
}
