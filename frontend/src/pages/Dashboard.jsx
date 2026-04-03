import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    Promise.all([
      axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get('http://localhost:5000/api/predictions/history', {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => ({ data: [] }))
    ])
    .then(([userRes, predRes]) => {
      setUser(userRes.data);
      setPredictions(predRes.data || []);
    })
    .catch(() => navigate('/login'))
    .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const latestPrediction = predictions.length > 0 ? predictions[0] : null;
  const highRiskCount = predictions.filter(p => p.riskLevel === 'High').length;
  const averageRisk = predictions.length > 0 
    ? (() => {
        const validProbabilities = predictions
          .map(p => {
            // Convert probability to number if it's a string
            const prob = typeof p.probability === 'string' ? parseFloat(p.probability) : p.probability;
            return prob;
          })
          .filter(p => p !== null && p !== undefined && !isNaN(p) && p >= 0 && p <= 1);
        
        if (validProbabilities.length === 0) return '0.0';
        
        const avgProbability = validProbabilities.reduce((sum, p) => sum + p, 0) / validProbabilities.length;
        return (avgProbability * 100).toFixed(1);
      })()
    : '0.0';

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-blue-600">Healthcare Dashboard</h1>
              <p className="text-sm text-gray-600">AI-Powered Diabetes Risk Assessment</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-600">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div
            onClick={() => navigate('/assessment')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg cursor-pointer transform hover:scale-105 transition"
          >
            <div className="text-4xl mb-3">📋</div>
            <h3 className="font-semibold text-gray-900 mb-2">New Assessment</h3>
            <p className="text-sm text-gray-600">Take a diabetes risk assessment</p>
          </div>

          <div
            onClick={() => navigate('/analytics')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg cursor-pointer transform hover:scale-105 transition"
          >
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
            <p className="text-sm text-gray-600">View your health trends</p>
          </div>

          <div
            onClick={() => navigate('/nearby-hospitals')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg cursor-pointer transform hover:scale-105 transition"
          >
            <div className="text-4xl mb-3">🏥</div>
            <h3 className="font-semibold text-gray-900 mb-2">Find Nearby Hospitals</h3>
            <p className="text-sm text-gray-600">Locate hospitals in your area</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Assessments</h3>
            <p className="text-3xl font-bold text-blue-600">{predictions.length}</p>
            <p className="text-xs text-gray-600 mt-2">Risk assessments completed</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-600">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Average Risk</h3>
            <p className="text-3xl font-bold text-yellow-600">{averageRisk}%</p>
            <p className="text-xs text-gray-600 mt-2">Based on all assessments</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-600">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">High Risk</h3>
            <p className="text-3xl font-bold text-red-600">{highRiskCount}</p>
            <p className="text-xs text-gray-600 mt-2">Assessments with high risk</p>
          </div>
        </div>

        {/* Latest Assessment */}
        {latestPrediction && (
          <div className="bg-white rounded-lg shadow p-8 mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Latest Assessment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Risk Status */}
              <div>
                <div className={`p-6 rounded-lg mb-6 ${
                  latestPrediction.riskLevel === 'High' ? 'bg-red-50 border-l-4 border-red-600' :
                  latestPrediction.riskLevel === 'Moderate' ? 'bg-yellow-50 border-l-4 border-yellow-600' :
                  'bg-green-50 border-l-4 border-green-600'
                }`}>
                  <p className={`text-sm font-semibold mb-2 ${
                    latestPrediction.riskLevel === 'High' ? 'text-red-700' :
                    latestPrediction.riskLevel === 'Moderate' ? 'text-yellow-700' :
                    'text-green-700'
                  }`}>
                    Risk Level
                  </p>
                  <p className={`text-3xl font-bold ${
                    latestPrediction.riskLevel === 'High' ? 'text-red-600' :
                    latestPrediction.riskLevel === 'Moderate' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {latestPrediction.riskLevel}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Probability</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {(() => {
                      const prob = typeof latestPrediction.probability === 'string' ? parseFloat(latestPrediction.probability) : latestPrediction.probability;
                      return prob ? `${(prob * 100).toFixed(1)}%` : 'N/A';
                    })()}
                  </p>
                </div>
              </div>

              {/* Key Metrics */}
              <div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">Glucose (mg/dL)</p>
                    <p className="text-lg font-bold text-gray-900">
                      {latestPrediction.fastingGlucose !== null && latestPrediction.fastingGlucose !== undefined 
                        ? `${latestPrediction.fastingGlucose} mg/dL` 
                        : 'Not available'
                      }
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">BMI (kg/m²)</p>
                    <p className="text-lg font-bold text-gray-900">{Number(latestPrediction.bmi).toFixed(2)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">BP Diastolic (mmHg)</p>
                    <p className="text-lg font-bold text-gray-900">
                      {latestPrediction.diastolicBP !== null && latestPrediction.diastolicBP !== undefined 
                        ? `${latestPrediction.diastolicBP} mmHg` 
                        : 'Not available'
                      }
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">Age (years)</p>
                    <p className="text-lg font-bold text-gray-900">{latestPrediction.age}</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/prediction-result', { state: { prediction: latestPrediction } })}
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              View Full Results & Recommendations
            </button>
          </div>
        )}

        {/* Assessment History */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-semibold text-gray-900">Assessment History</h2>
          </div>

          {predictions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-6">Date</th>
                    <th className="text-left py-3 px-6">Glucose</th>
                    <th className="text-left py-3 px-6">BMI</th>
                    <th className="text-left py-3 px-6">BP Diastolic</th>
                    <th className="text-left py-3 px-6">Risk Level</th>
                    <th className="text-left py-3 px-6">Probability</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((pred, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-6">{new Date(pred.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-6">
                        {pred.fastingGlucose !== null && pred.fastingGlucose !== undefined 
                          ? `${pred.fastingGlucose} mg/dL` 
                          : 'Not available'
                        }
                      </td>
                      <td className="py-3 px-6">{Number(pred.bmi).toFixed(2)} kg/m²</td>
                      <td className="py-3 px-6">
                        {pred.diastolicBP !== null && pred.diastolicBP !== undefined 
                          ? `${pred.diastolicBP} mmHg` 
                          : 'Not available'
                        }
                      </td>
                      <td className="py-3 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          pred.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                          pred.riskLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {pred.riskLevel}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        {(() => {
                          const prob = typeof pred.probability === 'string' ? parseFloat(pred.probability) : pred.probability;
                          return prob ? `${(prob * 100).toFixed(1)}%` : 'N/A';
                        })()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-600 mb-4">No assessments yet</p>
              <button
                onClick={() => navigate('/assessment')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Start Your First Assessment
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;