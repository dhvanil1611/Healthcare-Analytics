import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Phone, Star, Clock, X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

const EnhancedMap = ({ 
  hospitals, 
  userLocation, 
  selectedHospital, 
  onHospitalSelect, 
  className = "" 
}) => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [infoWindow, setInfoWindow] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 23.0225, lng: 72.5714 }); // Ahmedabad center
  const [mapZoom, setMapZoom] = useState(12);
  const mapRef = useRef(null);
  const googleMapsRef = useRef(null);

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      if (!window.google || !mapRef.current) return;

      const mapOptions = {
        center: mapCenter,
        zoom: mapZoom,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: false, // We'll use custom zoom controls
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      };

      const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
      setMap(newMap);
      setInfoWindow(new window.google.maps.InfoWindow());

      // Add custom zoom controls
      addCustomZoomControls(newMap);
    };

    // Load Google Maps API
    const loadGoogleMaps = () => {
      if (window.google) {
        initMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Update map when hospitals or user location changes
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    const newMarkers = [];

    // Add user location marker
    if (userLocation) {
      const userMarker = new window.google.maps.Marker({
        position: userLocation,
        map: map,
        title: 'Your Location',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#4F46E5',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        },
        zIndex: 1000
      });

      newMarkers.push(userMarker);
    }

    // Add hospital markers
    hospitals.forEach((hospital, index) => {
      const marker = new window.google.maps.Marker({
        position: { lat: hospital.latitude, lng: hospital.longitude },
        map: map,
        title: hospital.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#EF4444" stroke="#ffffff" stroke-width="2"/>
              <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">🏥</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 16)
        },
        zIndex: selectedHospital?.id === hospital.id ? 999 : 100
      });

      // Create info window content
      const infoContent = document.createElement('div');
      infoContent.className = 'p-3 max-w-xs';
      infoContent.innerHTML = `
        <div class="flex items-center gap-3 mb-2">
          <img src="${hospital.imageUrl}" alt="${hospital.name}" class="w-12 h-12 rounded-lg object-cover">
          <div>
            <h3 class="font-semibold text-gray-900">${hospital.name}</h3>
            <div class="flex items-center gap-1 text-sm text-yellow-600">
              <span>⭐</span>
              <span>${hospital.averageRating}</span>
              <span class="text-gray-500">(${hospital.totalReviews})</span>
            </div>
          </div>
        </div>
        <div class="space-y-1 text-sm text-gray-600 mb-3">
          <div class="flex items-center gap-2">
            <span class="text-gray-400">📍</span>
            <span>${hospital.area}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-gray-400">👨‍⚕️</span>
            <span>Dr. ${hospital.doctorName}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-gray-400">🕐</span>
            <span>${hospital.timings}</span>
          </div>
          ${hospital.distance ? `<div class="flex items-center gap-2">
            <span class="text-gray-400">📏</span>
            <span>${hospital.distance.toFixed(2)} km away</span>
          </div>` : ''}
        </div>
        <div class="flex gap-2">
          <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}', '_blank')" 
                  class="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition">
            🗺️ Directions
          </button>
          <button onclick="window.open('tel:${hospital.contactNumber}', '_self')" 
                  class="flex-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition">
            📞 Call
          </button>
        </div>
      `;

      marker.addListener('click', () => {
        if (infoWindow) {
          infoWindow.setContent(infoContent);
          infoWindow.open(map, marker);
          setSelectedMarker(marker);
          onHospitalSelect(hospital);
        }
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);

    // Fit map to show all markers
    if (newMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      newMarkers.forEach(marker => bounds.extend(marker.getPosition()));
      map.fitBounds(bounds);
    }
  }, [map, hospitals, userLocation, selectedHospital]);

  // Add custom zoom controls
  const addCustomZoomControls = (mapInstance) => {
    const zoomControlDiv = document.createElement('div');
    zoomControlDiv.className = 'bg-white rounded-lg shadow-lg p-1 flex flex-col gap-1';
    zoomControlDiv.style.cssText = 'position: absolute; right: 10px; top: 10px; z-index: 1000;';

    const zoomInButton = document.createElement('button');
    zoomInButton.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10 5v5m0 0v5m0-5h5m-5 0H5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
    zoomInButton.className = 'p-1 hover:bg-gray-100 rounded transition';
    zoomInButton.onclick = () => mapInstance.setZoom(mapInstance.getZoom() + 1);

    const zoomOutButton = document.createElement('button');
    zoomOutButton.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M5 10h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
    zoomOutButton.className = 'p-1 hover:bg-gray-100 rounded transition';
    zoomOutButton.onclick = () => mapInstance.setZoom(mapInstance.getZoom() - 1);

    const fullscreenButton = document.createElement('button');
    fullscreenButton.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M3 3h7v2H5v5H3V3zm0 14v-7h2v5h5v2H3zm14 0h-7v-2h5v-5h2v7zm0-14h-2v5h-5V3h7v2z"/></svg>';
    fullscreenButton.className = 'p-1 hover:bg-gray-100 rounded transition';
    fullscreenButton.onclick = () => {
      const mapDiv = mapInstance.getDiv();
      if (mapDiv.requestFullscreen) {
        mapDiv.requestFullscreen();
      }
    };

    zoomControlDiv.appendChild(zoomInButton);
    zoomControlDiv.appendChild(zoomOutButton);
    zoomControlDiv.appendChild(fullscreenButton);

    mapInstance.controls[window.google.maps.ControlPosition.RIGHT_TOP].push(zoomControlDiv);
  };

  // Fallback static map if Google Maps fails to load
  const renderStaticMap = () => {
    const markersParam = hospitals.slice(0, 10).map(hospital => 
      `${hospital.latitude},${hospital.longitude}`
    ).join('|');

    const userMarker = userLocation ? `${userLocation.lat},${userLocation.lng}` : '';
    const allMarkers = userMarker ? `${userMarker}|${markersParam}` : markersParam;

    return (
      <div className="relative w-full h-full">
        <iframe
          title="Hospital Locations Map"
          src={`https://maps.googleapis.com/maps/api/staticmap?size=800x400&maptype=roadmap&markers=color:red%7C${allMarkers}&center=${mapCenter.lat},${mapCenter.lng}&zoom=${mapZoom}&key=YOUR_API_KEY`}
          className="w-full h-full rounded-lg"
          loading="lazy"
        />
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
          <h3 className="font-semibold text-gray-900 mb-2">Interactive Map</h3>
          <p className="text-sm text-gray-600 mb-2">
            {hospitals.length} hospitals found in your area
          </p>
          {userLocation && (
            <p className="text-sm text-blue-600">
              📍 Your location is marked on the map
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div ref={mapRef} className="w-full h-full rounded-lg overflow-hidden">
        {!window.google && renderStaticMap()}
      </div>
      
      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 z-10">
        <h4 className="font-semibold text-gray-900 mb-2">Legend</h4>
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white"></div>
            <span className="text-gray-600">Your Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white"></div>
            <span className="text-gray-600">Hospital</span>
          </div>
        </div>
      </div>

      {/* Hospital List Sidebar */}
      {selectedHospital && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm z-10">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-gray-900">Selected Hospital</h3>
            <button
              onClick={() => onHospitalSelect(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-3 mb-3">
            <img
              src={selectedHospital.imageUrl}
              alt={selectedHospital.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h4 className="font-semibold text-gray-900">{selectedHospital.name}</h4>
              <div className="flex items-center gap-1 text-sm text-yellow-600">
                <Star className="w-4 h-4 fill-current" />
                <span>{selectedHospital.averageRating}</span>
                <span className="text-gray-500">({selectedHospital.totalReviews})</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{selectedHospital.area}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{selectedHospital.timings}</span>
            </div>
            {selectedHospital.distance && (
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-gray-400" />
                <span>{selectedHospital.distance.toFixed(2)} km away</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedHospital.latitude},${selectedHospital.longitude}`, '_blank')}
              className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition flex items-center justify-center gap-1"
            >
              <Navigation className="w-4 h-4" />
              Directions
            </button>
            <button
              onClick={() => window.open(`tel:${selectedHospital.contactNumber}`, '_self')}
              className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition flex items-center justify-center gap-1"
            >
              <Phone className="w-4 h-4" />
              Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedMap;
