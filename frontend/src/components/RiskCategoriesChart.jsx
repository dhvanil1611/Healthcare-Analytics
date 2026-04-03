import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const RiskCategoriesChart = ({ predictions }) => {
  const highRisk = predictions.filter(p => p.riskLevel === 'High').length;
  const moderateRisk = predictions.filter(p => p.riskLevel === 'Moderate').length;
  const lowRisk = predictions.filter(p => p.riskLevel === 'Low').length;

  const data = {
    labels: ['High Risk', 'Moderate Risk', 'Low Risk'],
    datasets: [
      {
        label: 'Risk Distribution',
        data: [highRisk, moderateRisk, lowRisk],
        backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
        borderColor: '#ffffff',
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
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    }
  };

  return <Pie data={data} options={options} />;
};

export default RiskCategoriesChart;
