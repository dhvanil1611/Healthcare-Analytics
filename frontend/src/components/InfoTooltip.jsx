import { useState, useEffect, useRef } from 'react';

const InfoTooltip = ({ text, icon = '✓', position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef(null);

  const handleMouseEnter = () => setIsVisible(true);
  const handleMouseLeave = () => setIsVisible(false);
  
  const handleClick = (e) => {
    e.stopPropagation();
    setIsVisible(!isVisible);
  };

  // Handle clicking outside to close
  useEffect(() => {
    if (!isVisible) return;

    const handleClickOutside = (e) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target)) {
        setIsVisible(false);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isVisible]);

  return (
    <div
      className="relative inline-block"
      ref={tooltipRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Info Icon Button */}
      <button
        onClick={handleClick}
        className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors cursor-help text-xs font-bold"
        aria-label="More information"
        type="button"
        title="Click for more information"
      >
        i
      </button>

      {/* Tooltip Box */}
      {isVisible && (
        <div
          className={`absolute z-50 w-max px-3 py-2 text-sm text-gray-900 bg-yellow-100 border border-yellow-400 rounded shadow-md pointer-events-auto ${
            position === 'top' ? 'bottom-full mb-3 left-1/2 -translate-x-1/2' :
            position === 'bottom' ? 'top-full mt-3 left-1/2 -translate-x-1/2' :
            position === 'left' ? 'right-full mr-3 top-1/2 -translate-y-1/2' :
            'left-full ml-3 top-1/2 -translate-y-1/2'
          }`}
          role="tooltip"
        >
          <p className="whitespace-normal max-w-xs text-gray-800 font-medium">{text}</p>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            ${position === 'top' ? 'transform: translateY(4px);' :
              position === 'bottom' ? 'transform: translateY(-4px);' :
              position === 'left' ? 'transform: translateX(4px);' :
              'transform: translateX(-4px);'}
          }
          to {
            opacity: 1;
            transform: translate(0, 0);
          }
        }

        [role="tooltip"] {
          animation: slideIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default InfoTooltip;
