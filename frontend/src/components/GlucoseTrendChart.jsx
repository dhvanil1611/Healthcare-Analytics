import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GlucoseTrendChart = ({ predictions }) => {
  const sortedPredictions = [...predictions].reverse();
  const last10 = sortedPredictions.slice(0, 10);

  const data = {
    labels: last10.map((p, idx) => `Day ${idx + 1}`),
    datasets: [
      {
        label: 'Fasting Blood Glucose (mg/dL)',
        data: last10.map(p => p.fastingBloodGlucose),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'mg/dL'
        },
        ticks: {
          callback: function(value) {
            return value + ' mg/dL';
          }
        }
      }
    }
  };

  return <Line data={data} options={options} />;
};

export default GlucoseTrendChart;
