import React from 'react';
import { FaEdit, FaCheck, FaTimes, FaPlus } from 'react-icons/fa';

function IconTest() {
  return (
    <div style={{ padding: '20px', background: '#181818', color: 'white' }}>
      <h1>Icon Test</h1>
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div>
          <FaEdit size={24} />
          <p>Edit Icon</p>
        </div>
        <div>
          <FaCheck size={24} />
          <p>Check Icon</p>
        </div>
        <div>
          <FaTimes size={24} />
          <p>Times Icon</p>
        </div>
        <div>
          <FaPlus size={24} />
          <p>Plus Icon</p>
        </div>
      </div>
    </div>
  );
}

export default IconTest; 