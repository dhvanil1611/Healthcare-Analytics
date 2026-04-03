import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const RiskGaugeChart = ({ prediction }) => {
  const probability = typeof prediction.probability === 'string' ? parseFloat(prediction.probability) : prediction.probability;
  const riskValue = (probability * 100).toFixed(1);
  
  const data = {
    labels: ['Risk Level', 'Safe'],
    datasets: [
      {
        label: 'Diabetes Risk',
        data: [riskValue, 100 - riskValue],
        backgroundColor: [
          prediction.riskLevel === 'High' ? '#ef4444' :
          prediction.riskLevel === 'Moderate' ? '#f59e0b' :
          '#10b981',
          '#e5e7eb'
        ],
        borderColor: ['#fff', '#fff'],
        borderWidth: 2,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#fff',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            const value = context.parsed;
            return `Diabetes Risk: ${value.toFixed(1)}%`;
          }
        }
      },
    },
    cutout: '75%',
  };

  return (
    <div className="flex flex-col items-center">
      <div style={{ position: 'relative', width: '300px', height: '300px' }}>
        <Doughnut data={data} options={options} />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <div className="text-4xl font-bold" style={{
            color: prediction.riskLevel === 'High' ? '#ef4444' :
                   prediction.riskLevel === 'Moderate' ? '#f59e0b' :
                   '#10b981'
          }}>
            {riskValue}%
          </div>
          <div className="text-sm text-gray-600">{prediction.riskLevel}</div>
        </div>
      </div>
    </div>
  );
};

export default RiskGaugeChart;
