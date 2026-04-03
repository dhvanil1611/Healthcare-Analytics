import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import RiskGaugeChart from '../components/RiskGaugeChart';
import BloodPressureChart from '../components/BloodPressureChart';
import BMIProgressChart from '../components/BMIProgressChart';
import RiskCategoriesChart from '../components/RiskCategoriesChart';
import DashboardButton from '../components/DashboardButton';

const HealthAnalyticsPage = () => {
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState([]);
  const [healthMetrics, setHealthMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  if (!token) {
    navigate('/login');
    return null;
  }

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [predictionsRes, metricsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/predictions/history', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('http://localhost:5000/api/health/metrics', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setPredictions(predictionsRes.data || []);
      setHealthMetrics(metricsRes.data || []);
    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getLatestPrediction = () => {
    return predictions.length > 0 ? predictions[0] : null;
  };

  const getHealthScore = () => {
    if (!predictions.length) return 0;
    
    const validProbabilities = predictions
      .slice(0, 5)
      .map(p => {
        const prob = typeof p.probability === 'string' ? parseFloat(p.probability) : p.probability;
        return prob;
      })
      .filter(p => p !== null && p !== undefined && !isNaN(p) && p >= 0 && p <= 1);
    
    if (validProbabilities.length === 0) return 100;
    
    const avgRisk = validProbabilities.reduce((sum, p) => sum + p, 0) / validProbabilities.length;
    const healthScore = Math.max(0, 100 - (avgRisk * 100));
    
    return isNaN(healthScore) ? 0 : healthScore;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-600">Health Analytics</h1>
            <DashboardButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading your analytics...</p>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-800">
                {error}
              </div>
            )}

            {/* Health Score Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Overall Health Score</h3>
                <div className="flex items-center justify-between">
                  <div className="text-4xl font-bold text-blue-600">{Math.round(getHealthScore())}</div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">out of 100</div>
                    <div className="text-xs text-green-600 font-semibold">Good</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Assessments Completed</h3>
                <div className="text-4xl font-bold text-green-600">{predictions.length}</div>
                <p className="text-xs text-gray-600 mt-2">Total diabetes risk assessments</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Latest Assessment</h3>
                {getLatestPrediction() ? (
                  <div>
                    <div className={`text-2xl font-bold ${
                      getLatestPrediction().riskLevel === 'High' ? 'text-red-600' :
                      getLatestPrediction().riskLevel === 'Moderate' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {getLatestPrediction().riskLevel} Risk
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      {new Date(getLatestPrediction().createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-600">No assessments yet</p>
                )}
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Risk Gauge */}
              {getLatestPrediction() && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Risk Level</h3>
                  <RiskGaugeChart prediction={getLatestPrediction()} />
                </div>
              )}

              {/* Risk Categories */}
              {predictions.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
                  <RiskCategoriesChart predictions={predictions} />
                </div>
              )}
            </div>

            {/* Trend Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {predictions.length > 1 && (
                <>
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Blood Pressure</h3>
                    <BloodPressureChart predictions={predictions} />
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">BMI Progress</h3>
                    <BMIProgressChart predictions={predictions} />
                  </div>
                </>
              )}
            </div>

            {/* Prediction History */}
            <div className="bg-white rounded-lg shadow p-6 mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment History</h3>
              {predictions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left py-2 px-4">Date</th>
                        <th className="text-left py-2 px-4">Glucose (mg/dL)</th>
                        <th className="text-left py-2 px-4">BMI (kg/m²)</th>
                        <th className="text-left py-2 px-4">Risk Level</th>
                        <th className="text-left py-2 px-4">Probability</th>
                      </tr>
                    </thead>
                    <tbody>
                      {predictions.map((pred, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-4">{new Date(pred.createdAt).toLocaleDateString()}</td>
                          <td className="py-2 px-4">{pred.fastingBloodGlucose}</td>
                          <td className="py-2 px-4">{Number(pred.bmi).toFixed(2)}</td>
                          <td className="py-2 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              pred.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                              pred.riskLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {pred.riskLevel}
                            </span>
                          </td>
                          <td className="py-2 px-4">{pred.probability ? `${(pred.probability * 100).toFixed(1)}%` : 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">No assessment history yet. Start by taking an assessment.</p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default HealthAnalyticsPage;
