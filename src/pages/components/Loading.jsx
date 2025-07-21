/* eslint-disable react/prop-types */

function Loading({ size = 40, center = false }) {
  return (
    <div className={`anime-loading ${center ? 'anime-loading-center' : ''}`}>
      <div 
        className="anime-loading-spinner"
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        <div className="loading-circle"></div>
        <div className="loading-circle"></div>
        <div className="loading-circle"></div>
      </div>
    </div>
  );
}

export default Loading;