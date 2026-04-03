import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HealthRecommendations from '../components/HealthRecommendations';
import { generatePDFReport } from '../utils/generatePDFReport';

// Temporarily remove imports that might cause issues
// import RiskGaugeChart from '../components/RiskGaugeChart';
// import DashboardButton from '../components/DashboardButton';
// import { generateMedicalReport } from '../utils/generateMedicalReport';

const PredictionResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    try {
      const state = location.state?.prediction || JSON.parse(localStorage.getItem('lastPrediction'));
      if (state) {
        console.log('Prediction data received:', state);
        setPrediction(state);
      } else {
        // Don't redirect automatically, show a message instead
        setPrediction(null);
      }
    } catch (error) {
      console.error('Error loading prediction data:', error);
      setPrediction(null);
    }
  }, [location.state, navigate]);

  if (!prediction) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Assessment Results Found</h2>
            <p className="text-gray-600 mb-6">
              You need to complete an assessment first to view your results. The assessment helps us analyze your health metrics and provide personalized diabetes risk evaluation.
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => navigate('/assessment')}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
            >
              Start New Assessment
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full text-blue-600 hover:text-blue-700 font-medium"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getRiskColor = (level) => {
    switch (level) {
      case 'High':
        return 'text-red-600';
      case 'Moderate':
        return 'text-yellow-600';
      case 'Low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getRiskBgColor = (level) => {
    switch (level) {
      case 'High':
        return 'bg-red-50 border-red-200';
      case 'Moderate':
        return 'bg-yellow-50 border-yellow-200';
      case 'Low':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getDisplayValue = (prediction, ...fields) => {
    for (const field of fields) {
      if (prediction[field] !== undefined && prediction[field] !== null && prediction[field] !== '') {
        return prediction[field];
      }
    }
    return 'Not available';
  };

  const formatFastingGlucose = (prediction) => {
    const value = getDisplayValue(prediction, 'fastingGlucose', 'fastingBloodGlucose');
    return value === 'Not available' ? value : `${value} mg/dL`;
  };

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    try {
      const success = await generatePDFReport(prediction);
      if (success) {
        // Optional: Show a success message
        console.log('PDF generated successfully');
      }
    } catch (error) {
      console.error('Error downloading report:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-600">Assessment Results</h1>
            <div className="space-x-3">
              <button
                onClick={() => navigate('/assessment')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                New Assessment
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Risk Alert Banner */}
        <div className={`border-2 rounded-lg p-6 mb-8 ${getRiskBgColor(prediction.riskLevel)}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-2xl font-bold ${getRiskColor(prediction.riskLevel)} mb-2`}>
                Risk Level: {prediction.riskLevel}
              </h2>
              <p className="text-gray-700">Your diabetes risk assessment has been completed.</p>
            </div>
            <div className="text-right">
              <div className={`text-5xl font-bold ${getRiskColor(prediction.riskLevel)}`}>
                {((typeof prediction.probability === 'string' ? parseFloat(prediction.probability) : prediction.probability) * 100).toFixed(1)}%
              </div>
              <p className="text-gray-600 text-sm mt-2">Probability</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="flex border-b">
            {['overview', 'details', 'recommendations'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 px-6 font-semibold text-center ${
                  activeTab === tab
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Risk Gauge Placeholder */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Gauge</h3>
                  <div className="bg-gray-50 p-8 rounded-lg text-center">
                    <div className={`text-6xl font-bold ${getRiskColor(prediction.riskLevel)}`}>
                      {((typeof prediction.probability === 'string' ? parseFloat(prediction.probability) : prediction.probability) * 100).toFixed(1)}%
                    </div>
                    <p className="text-gray-600 mt-2">Risk Probability</p>
                  </div>
                </div>

                {/* Key Metrics */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Metrics</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Fasting Blood Glucose</p>
                      <p className="text-2xl font-bold text-gray-900">{formatFastingGlucose(prediction)}</p>
                      <p className="text-xs text-gray-500 mt-1">Reference: 70-100 mg/dL (fasting)</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Body Mass Index (BMI)</p>
                      <p className="text-2xl font-bold text-gray-900">{Number(prediction.bmi).toFixed(2)} kg/m²</p>
                      <p className="text-xs text-gray-500 mt-1">Reference: 18.5-24.9 (Normal)</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Blood Pressure (Diastolic)</p>
                      <p className="text-2xl font-bold text-gray-900">{getDisplayValue(prediction, 'diastolicBP', 'diastolicBloodPressure')} mmHg</p>
                      <p className="text-xs text-gray-500 mt-1">Reference: &lt;80 mmHg</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'Fasting Blood Glucose', value: formatFastingGlucose(prediction) },
                    { label: 'Diastolic Blood Pressure', value: `${getDisplayValue(prediction, 'diastolicBP', 'diastolicBloodPressure')} mmHg` },
                    { label: 'BMI', value: `${Number(prediction.bmi).toFixed(2)} kg/m²` },
                    { label: 'Age', value: `${prediction.age} years` },
                    { label: 'Gender', value: prediction.gender || 'Not specified' },
                    { label: 'Family History', value: prediction.familyHistory ? 'Yes' : 'No' },
                    { label: 'Assessment Date', value: new Date(prediction.createdAt).toLocaleDateString() },
                  ].map((item, idx) => (
                    <div key={idx} className="border-l-4 border-blue-600 pl-4">
                      <p className="text-sm text-gray-600">{item.label}</p>
                      <p className="text-lg font-semibold text-gray-900">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div>
                <HealthRecommendations prediction={prediction} />
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/assessment')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-semibold transition-colors"
          >
            Start New Assessment
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
          >
            View Dashboard
          </button>
          <button
            onClick={handleDownloadReport}
            disabled={isDownloading}
            className={`bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors ${
              isDownloading 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-green-700'
            }`}
          >
            {isDownloading ? 'Generating PDF...' : 'Download Report'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default PredictionResultPage;
