import React from 'react';
import image from '../../assets/images/unauthorized.jpg'; // Must be inside src/

export default function UnauthorizedAccess() {
  return (
    <div className="w-screen h-screen bg-cover bg-center relative" style={{ backgroundImage: `url(${image})` }}>
      <div className="absolute inset-0 bg-opacity-60 flex items-center justify-center">
        <h1 className="text-white text-5xl md:text-7xl font-bold text-center">Detected Unauthorized Access</h1>
      </div>
    </div>
  );
}
