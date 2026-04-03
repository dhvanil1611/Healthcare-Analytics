import { useNavigate } from 'react-router-dom';

const DashboardButton = ({ className = "", onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 ${className}`}
    >
      Back to Dashboard
    </button>
  );
};

export default DashboardButton;
