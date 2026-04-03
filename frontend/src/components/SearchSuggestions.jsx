import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Star, Clock, Phone } from 'lucide-react';

const SearchSuggestions = ({ 
  searchTerm, 
  setSearchTerm, 
  onSearch, 
  hospitals, 
  placeholder = "Search hospital name..." 
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  // Filter hospitals based on search term
  useEffect(() => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      const filtered = hospitals.filter(hospital => 
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 8); // Limit to 8 suggestions

      setSuggestions(filtered);
      setShowSuggestions(true);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, hospitals]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          selectSuggestion(suggestions[selectedIndex]);
        } else {
          onSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const selectSuggestion = (hospital) => {
    setSearchTerm(hospital.name);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onSearch();
  };

  const highlightText = (text, highlight) => {
    if (!highlight) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === highlight.toLowerCase() ? 
        <span key={index} className="bg-blue-100 text-blue-800 font-semibold">{part}</span> : 
        part
    );
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-96 overflow-y-auto z-50">
          {suggestions.map((hospital, index) => (
            <div
              key={hospital.id}
              onClick={() => selectSuggestion(hospital)}
              className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                index === selectedIndex ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">
                      {highlightText(hospital.name, searchTerm)}
                    </h4>
                    <div className="flex items-center gap-1 text-sm text-yellow-600">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{hospital.averageRating}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{highlightText(hospital.area, searchTerm)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">•</span>
                      <span>{highlightText(hospital.specialization, searchTerm)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">•</span>
                      <span>Dr. {highlightText(hospital.doctorName, searchTerm)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{hospital.timings}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{hospital.contactNumber}</span>
                    </div>
                  </div>

                  {hospital.distance && (
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      <MapPin className="w-3 h-3" />
                      {hospital.distance.toFixed(2)} km away
                    </div>
                  )}
                </div>
                
                <div className="ml-4 flex flex-col items-center">
                  <img
                    src={hospital.imageUrl}
                    alt={hospital.name}
                    className="w-16 h-16 object-cover rounded-lg mb-2"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`, '_blank');
                    }}
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                  >
                    Directions
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <div className="p-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{suggestions.length} results found</span>
              <button
                onClick={() => setShowSuggestions(false)}
                className="text-blue-600 hover:text-blue-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;
