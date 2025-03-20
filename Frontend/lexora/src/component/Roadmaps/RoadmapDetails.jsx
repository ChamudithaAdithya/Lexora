import React, { useState } from 'react';

const SearchRoadmap = () => {
  const [searchInput, setSearchInput] = useState('');
  const [showRoadmap, setShowRoadmap] = useState(false);

  const generateRoadmap = () => {
    if (searchInput.trim() !== '') {
      setShowRoadmap(true);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column',justifyContent: 'center', alignItems: 'center', height: '60vh', textAlign: 'center'}}>
      <h1 style={{fontSize: '28px',fontWeight: 'bold', marginBottom: '20px'}}>GENERATE ROADMAP</h1>
      
      <div style={{display: 'flex',flexDirection: 'row',alignItems: 'center', marginBottom: '30px'}}>
        <input 
          type="text" 
          placeholder="I want to become a Frontend Developer"
          style={{ 
            width: '400px',
            padding: '10px 15px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px 0 0 4px',
            outline: 'none'
          }} 
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button 
          style={{
            backgroundColor: '#0066ff', // Blue color as requested
            color: 'white',
            border: 'none',
            borderRadius: '0 4px 4px 0',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            height: '100%'
          }}
          onClick={generateRoadmap}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0052cc'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#0066ff'}
        >
          Generate
        </button>
      </div>
      
      {showRoadmap && (
        <div style={{ width: '100%' }}>
          <ReactRoadmap />
        </div>
      )}
    </div>
  );
};

export default SearchRoadmap;