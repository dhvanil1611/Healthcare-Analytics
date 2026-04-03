import { Link } from 'react-router-dom';
import { useState } from 'react';
import Header from '../components/Header';

const AwarenessPage = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const riskFactors = [
    { icon: '👨‍👩‍👧‍👦', title: 'Family History', description: 'Having relatives with diabetes increases your risk significantly' },
    { icon: '⚖️', title: 'Overweight/Obesity', description: 'Excess weight increases insulin resistance and diabetes risk' },
    { icon: '🏃', title: 'Physical Inactivity', description: 'Sedentary lifestyle reduces body\'s ability to process glucose' },
    { icon: '📅', title: 'Age 45+', description: 'Risk increases with age; screening crucial after 45' },
    { icon: '💓', title: 'High Blood Pressure', description: 'Hypertension and diabetes are often linked conditions' },
    { icon: '🧪', title: 'Abnormal Cholesterol', description: 'Lipid imbalances are associated with diabetes development' },
  ];

  const preventionTips = [
    'Achieve and maintain a healthy weight through balanced nutrition',
    'Exercise at least 150 minutes of moderate activity weekly',
    'Eat fiber-rich foods: vegetables, fruits, whole grains',
    'Limit sugary drinks and processed foods',
    'Get 7-9 hours of quality sleep daily',
    'Manage stress through meditation or yoga',
    'Schedule regular health check-ups (annually)',
    'Monitor blood pressure and cholesterol levels',
  ];

  const managementStrategies = [
    'Check blood sugar levels as recommended by doctor',
    'Take all prescribed medications consistently',
    'Follow personalized meal plans and dietary guidelines',
    'Maintain regular exercise routine (at least 150 min/week)',
    'Keep detailed records of blood sugar readings',
    'Attend regular check-ups and specialist appointments',
    'Educate yourself about diabetes and complications',
    'Build support network with healthcare providers and family',
  ];

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <Header showProfileMenu={true} />

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }

        .animate-slide-in {
          animation: slideIn 0.5s ease-out;
        }

        .cursor-pointer-gradient:hover {
          cursor: pointer;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.1));
        }

        .risk-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .risk-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.2);
          border-color: rgb(59, 130, 246);
        }

        .highlight-text {
          background: linear-gradient(120deg, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2));
          padding: 0.2em 0.4em;
          border-radius: 4px;
          font-weight: 500;
        }

        .section-divider {
          background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent);
          height: 2px;
        }

        .cta-button {
          position: relative;
          overflow: hidden;
        }

        .cta-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }

        .cta-button:hover::before {
          left: 100%;
        }

        .tip-item {
          transition: all 0.3s ease;
          border-left: 4px solid transparent;
        }

        .tip-item:hover {
          border-left-color: rgb(59, 130, 246);
          background-color: rgba(59, 130, 246, 0.05);
          transform: translateX(4px);
        }
      `}</style>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{color: 'black'}}>Diabetes Awareness & Prevention</h1>
          <p className="text-xl text-blue-100">Understanding risk factors and taking proactive steps to prevent diabetes</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Risk Factors Section */}
        <section className="mb-16 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Known Risk Factors</h2>
          <div className="section-divider mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {riskFactors.map((factor, index) => (
              <div
                key={index}
                className="risk-card p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="text-5xl mb-4">{factor.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{factor.title}</h3>
                <p className="text-gray-600">{factor.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Prevention Tips Section */}
        <section className="mb-16 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Prevention Tips</h2>
          <div className="section-divider mb-8"></div>
          
          <div className="bg-blue-50 rounded-lg p-8">
            <ul className="space-y-4">
              {preventionTips.map((tip, index) => (
                <li
                  key={index}
                  className="tip-item p-3 bg-white rounded"
                >
                  <div className="flex items-start">
                    <span className="text-blue-600 font-bold mr-3">✓</span>
                    <span className="text-gray-700">{tip}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Management Strategies Section */}
        <section className="mb-16 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Management Strategies</h2>
          <div className="section-divider mb-8"></div>
          
          <div className="bg-cyan-50 rounded-lg p-8">
            <ul className="space-y-4">
              {managementStrategies.map((strategy, index) => (
                <li
                  key={index}
                  className="tip-item p-3 bg-white rounded"
                >
                  <div className="flex items-start">
                    <span className="text-cyan-600 font-bold mr-3">★</span>
                    <span className="text-gray-700">{strategy}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mb-12 text-center animate-fade-in-up">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Ready to Take Action?</h2>
            <p className="text-lg mb-6">Take our diabetes risk assessment and get personalized recommendations.</p>
            <Link
              to="/assessment"
              className="cta-button inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Risk Assessment
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AwarenessPage;