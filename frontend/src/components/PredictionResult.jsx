import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PredictionResult = ({ prediction }) => {
  const chartData = {
    labels: ['Risk Probability', 'Safe Probability'],
    datasets: [{
      data: [
        (typeof prediction.probability === 'string' ? parseFloat(prediction.probability) : prediction.probability) * 100, 
        (1 - (typeof prediction.probability === 'string' ? parseFloat(prediction.probability) : prediction.probability)) * 100
      ],
      backgroundColor: [
        prediction.riskLevel === 'High' ? '#ef4444' : prediction.riskLevel === 'Moderate' ? '#f59e0b' : '#10b981',
        '#e5e7eb'
      ],
      borderWidth: 0,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    cutout: '70%',
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Assessment Result</h3>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className={`text-2xl font-bold ${
            prediction.riskLevel === 'High' ? 'text-red-600' :
            prediction.riskLevel === 'Moderate' ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {prediction.riskLevel} Risk
          </div>
          <div className="text-gray-600">Probability: {((typeof prediction.probability === 'string' ? parseFloat(prediction.probability) : prediction.probability) * 100).toFixed(1)}%</div>
        </div>
        <div className="w-24 h-24">
          <Doughnut data={chartData} options={chartOptions} />
        </div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Health Advice</h4>
        <p className="text-gray-700">{prediction.advice}</p>
      </div>
    </div>
  );
};

export default PredictionResult;