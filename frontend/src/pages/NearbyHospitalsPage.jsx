import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardButton from '../components/DashboardButton';

const NearbyHospitalsPage = () => {
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, reviewText: '' });
  const [sortBy, setSortBy] = useState('newest');
  const navigate = useNavigate();

  const fetchReviews = async (hospitalId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/reviews/hospital/${hospitalId}/sorted?sort=${sortBy}`
      );
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleViewReviews = (hospital) => {
    setSelectedHospital(hospital);
    fetchReviews(hospital.id);
    setShowReviews(true);
  };

  const handleSubmitReview = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!user) return;

      await axios.post(
        'http://localhost:5000/api/reviews',
        {
          userId: user.id,
          hospitalId: selectedHospital.id,
          rating: newReview.rating,
          reviewText: newReview.reviewText
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewReview({ rating: 5, reviewText: '' });
      fetchReviews(selectedHospital.id);
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review');
    }
  };

  const getRiskBannerMessage = () => {
    if (!user) return null;
    // This would connect to user's latest prediction risk level
    return (
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8 rounded">
        <p className="text-blue-800 font-semibold">
          🏥 AI Recommendation: These hospitals are recommended near your location for diabetes care.
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading hospitals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-blue-600">Find Nearby Diabetes Hospitals</h1>
              <p className="text-sm text-gray-600">Locate best hospitals for diabetes care in Ahmedabad</p>
            </div>
            <DashboardButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Recommendation Banner */}
        {getRiskBannerMessage()}

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Search & Filter Hospitals</h2>
          <button
            onClick={handleUseMyLocation}
            className="w-full md:w-auto bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2"
          >
            📍 Use My Location
          </button>
        </div>

        {/* Google Maps Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Hospital Locations</h2>
          <iframe
            title="Ahmedabad Diabetes Hospitals Map"
            src="https://www.google.com/maps?q=diabetes+hospitals+Ahmedabad&output=embed"
            width="100%"
            height="400"
            style={{ borderRadius: '10px', border: 'none' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Hospital Cards Grid */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            {filteredHospitals.length} Hospitals Found
          </h2>
          {filteredHospitals.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
              {filteredHospitals.map((hospital) => (
                <div
                  key={hospital.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl p-6 transform hover:scale-105 transition duration-300 border-l-4 border-blue-600"
                >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Hospital Image */}
                  <div className="md:col-span-1">
                    <img
                      src={hospital.imageUrl}
                      alt={hospital.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>

                  {/* Hospital Details */}
                  <div className="md:col-span-2">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{hospital.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      <span className="font-semibold">Area:</span> {hospital.area}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      <span className="font-semibold">Address:</span> {hospital.address}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      <span className="font-semibold">Doctor:</span> {hospital.doctorName}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      <span className="font-semibold">Specialization:</span> {hospital.specialization}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      <span className="font-semibold">Timings:</span> {hospital.timings}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      <span className="font-semibold">Contact:</span> {hospital.contactNumber}
                    </p>
                    {hospital.distance && (
                      <p className="text-sm text-gray-600 mb-3">
                        <span className="font-semibold">Distance:</span> {hospital.distance.toFixed(2)} km
                      </p>
                    )}
                  </div>

                  {/* Rating and Actions */}
                  <div className="md:col-span-1 flex flex-col justify-between">
                    {/* Rating */}
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg mb-4">
                      <p className="text-center text-sm text-gray-700 font-semibold mb-2">Rating</p>
                      <p className="text-center text-3xl font-bold text-yellow-600">
                        ⭐ {hospital.averageRating}
                      </p>
                      <p className="text-center text-xs text-gray-600 mt-2">
                        ({hospital.totalReviews} reviews)
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <button
                        onClick={() => window.open(`https://www.google.com/maps/search/${hospital.name}+${hospital.area}`, '_blank')}
                        className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                      >
                        🗺️ View Map
                      </button>
                      <button
                        onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`, '_blank')}
                        className="w-full bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition text-sm font-semibold"
                      >
                        🧭 Get Directions
                      </button>
                      <a
                        href={`tel:${hospital.contactNumber}`}
                        className="w-full bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold text-center"
                      >
                        📞 Call Hospital
                      </a>
                      <button
                        onClick={() => handleViewReviews(hospital)}
                        className="w-full bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition text-sm font-semibold"
                      >
                        ⭐ View Reviews
                      </button>
                      <button
                        onClick={() => navigate('/assessment')}
                        className="w-full bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-semibold"
                      >
                        📅 Book Appointment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      </main>

      {/* Reviews Modal */}
      {showReviews && selectedHospital && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-800 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">{selectedHospital.name} - Reviews</h2>
              <button
                onClick={() => setShowReviews(false)}
                className="text-white text-2xl hover:bg-blue-700 px-3 py-1 rounded"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {/* Write Review Section */}
              <div className="bg-blue-50 p-6 rounded-lg mb-8 border-l-4 border-blue-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Write Your Review</h3>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rating (1-5 stars)
                  </label>
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4, 5].map((r) => (
                      <option key={r} value={r}>
                        {'⭐'.repeat(r)} {r} Stars
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={newReview.reviewText}
                    onChange={(e) => setNewReview({ ...newReview, reviewText: e.target.value })}
                    placeholder="Share your experience with this hospital..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none h-24"
                  ></textarea>
                </div>
                <button
                  onClick={handleSubmitReview}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Submit Review
                </button>
              </div>

              {/* Sort Reviews */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sort Reviews:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    fetchReviews(selectedHospital.id);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="highest">Highest Rating</option>
                </select>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{review.user?.name || 'Anonymous'}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-500">{'⭐'.repeat(review.rating)}</span>
                            <span className="text-sm text-gray-600">{review.rating} / 5</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{review.reviewText}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-600 py-8">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NearbyHospitalsPage;
