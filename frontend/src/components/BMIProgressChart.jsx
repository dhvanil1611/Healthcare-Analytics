import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BMIProgressChart = ({ predictions }) => {
  const sortedPredictions = [...predictions].reverse();
  const last10 = sortedPredictions.slice(0, 10);

  const data = {
    labels: last10.map((p, idx) => `Day ${idx + 1}`),
    datasets: [
      {
        label: 'BMI (kg/m²)',
        data: last10.map(p => p.bmi),
        backgroundColor: predictions.map(p => {
          if (p.bmi < 18.5) return '#10b981';
          if (p.bmi < 25) return '#3b82f6';
          if (p.bmi < 30) return '#f59e0b';
          return '#ef4444';
        }).reverse().slice(0, 10),
        borderColor: '#1f2937',
        borderWidth: 1,
        borderRadius: 8,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    indexAxis: 'x',
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'BMI (kg/m²)'
        },
        ticks: {
          callback: function(value) {
            return value + ' kg/m²';
          }
        }
      }
    }
  };

  return <Bar data={data} options={options} />;
};

export default BMIProgressChart;
