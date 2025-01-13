import React from 'react';

const Logo = () => {
  return (
    <header className="flex flex-col items-center justify-center p-4 w-full">
      <h1 className="flex items-center justify-center text-2xl font-medium text-black">
        P
        <span className="inline-flex items-center justify-center relative -top-0.5 mx-0.5">
          <svg 
            width="12" 
            height="16" 
            viewBox="0 0 12 16" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="mx-1"
          >
            <path 
              d="M6 0C2.692 0 0 2.692 0 6C0 10.5 6 16 6 16C6 16 12 10.5 12 6C12 2.692 9.308 0 6 0ZM6 8.6C4.564 8.6 3.4 7.436 3.4 6C3.4 4.564 4.564 3.4 6 3.4C7.436 3.4 8.6 4.564 8.6 6C8.6 7.436 7.436 8.6 6 8.6Z" 
              fill="#FF6431"
            />
          </svg>
        </span>
        inPots
      </h1>
      <p className="text-sm text-black mt-1">
        Write reviews, organize your photos, or explore a new location!
      </p>
    </header>
  );
};

export default Logo;