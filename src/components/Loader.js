import React from 'react';

const Loader = () => {
  return (
    <div className='loader-container'>
      <div className='loader'>
        <div className='bar'></div>
        <div className='bar'></div>
        <div className='bar'></div>
        <div className='bar'></div>
      </div>
      <p className='loading-text'>Loading</p>
    </div>
  );
};

export default Loader;
