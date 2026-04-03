import { Link } from 'react-router-dom';
import { useState } from 'react';
import Header from '../components/Header';

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState('mission');

  const features = [
    { icon: '🔐', title: 'Secure Authentication', desc: 'JWT-based authentication with bcrypt encryption for user data protection' },
    { icon: '🤖', title: 'AI-Powered Predictions', desc: 'Machine learning models for accurate diabetes risk assessment' },
    { icon: '📊', title: 'Health Dashboard', desc: 'Interactive visualizations with real-time health metrics tracking' },
    { icon: '📋', title: 'Risk Assessment Form', desc: 'Clinical-standard questionnaire based on medical guidelines' },
    { icon: '💬', title: 'AI Chatbot Support', desc: '24/7 intelligent chatbot for health-related queries and guidance' },
    { icon: '📱', title: 'Fully Responsive', desc: 'Seamless experience across all devices - mobile, tablet, desktop' },
    { icon: '📁', title: 'Report Management', desc: 'Secure upload, storage, and management of medical documents' },
    { icon: '📅', title: 'Appointment Booking', desc: 'Easy scheduling system to book appointments with healthcare providers' },
  ];

  const techStack = [
    { category: 'Frontend', icon: '⚛️', technologies: ['React.js', 'Tailwind CSS', 'Chart.js', 'Vite'] },
    { category: 'Backend', icon: '🔧', technologies: ['Node.js', 'Express.js', 'PostgreSQL', 'TypeORM'] },
    { category: 'AI/ML', icon: '🧠', technologies: ['Python ML Services', 'scikit-learn', 'TensorFlow Ready'] },
    { category: 'Security', icon: '🔒', technologies: ['JWT Authentication', 'bcrypt Encryption', 'HTTPS SSL'] },
  ];

  const objectives = [
    'Develop and deploy an AI-based predictive model for diabetes risk assessment',
    'Create an intuitive, user-friendly web application with modern UI/UX design',
    'Implement robust security protocols for sensitive healthcare data protection',
    'Provide personalized, actionable health recommendations based on user profile',
    'Build interactive dashboards with advanced data visualizations and analytics',
    'Enable seamless integration with healthcare provider systems',
    'Support educational health awareness and preventive care initiatives',
  ];

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen">
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

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          50% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.5s ease-out;
        }

        .feature-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .feature-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 20px 40px rgba(59, 130, 246, 0.15);
          border-color: rgb(59, 130, 246);
        }

        .tech-card {
          transition: all 0.3s ease;
          position: relative;
        }

        .tech-card:hover {
          transform: scale(1.05);
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(6, 182, 212, 0.05));
        }

        .tab-button {
          position: relative;
          transition: all 0.3s ease;
        }

        .tab-button.active {
          color: rgb(59, 130, 246);
        }

        .tab-button.active::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, rgb(59, 130, 246), rgb(6, 182, 212));
          border-radius: 3px;
        }

        .section-divider {
          background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent);
          height: 2px;
        }

        .objective-item {
          transition: all 0.3s ease;
          border-left: 4px solid transparent;
        }

        .objective-item:hover {
          border-left-color: rgb(59, 130, 246);
          background-color: rgba(59, 130, 246, 0.05);
          transform: translateX(8px);
        }

        .glow-text {
          background: linear-gradient(120deg, rgb(59, 130, 246), rgb(6, 182, 212), rgb(59, 130, 246));
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <Header showProfileMenu={true} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6" style={{color: 'black'}}>About HealthCare Analytics</h1>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto opacity-95 leading-relaxed">
            An intelligent, AI-powered diabetes risk assessment and personal healthcare management system designed to empower individuals with actionable health insights.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 sm:gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold">100%</div>
              <p className="text-sm opacity-90">Secure Data</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">8+</div>
              <p className="text-sm opacity-90">Core Features</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">AI</div>
              <p className="text-sm opacity-90">Powered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Mission Section */}
        <div className="mb-20 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-3xl">🎯</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Our Mission</h2>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-8 border-l-4 border-blue-500">
            <p className="text-lg text-gray-800 leading-relaxed mb-4">
              We believe that <span className="font-bold text-blue-600">early detection and prevention are key to combating diabetes</span>. HealthCare Analytics is designed to democratize access to accurate health risk assessments and personalized healthcare recommendations.
            </p>
            <p className="text-lg text-gray-800 leading-relaxed">
              As a final-year B.Tech Computer Engineering project, this platform combines cutting-edge AI technology with healthcare expertise to create a comprehensive solution that empowers users to take control of their health journey.
            </p>
          </div>
        </div>

        <div className="section-divider my-12"></div>

        {/* Objectives Section */}
        <div className="mb-20 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-8">
            <div className="text-3xl">📋</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Project Objectives</h2>
          </div>
          <p className="text-gray-700 mb-10 text-lg">
            We've structured our development around seven core objectives to ensure we deliver maximum value:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {objectives.map((objective, idx) => (
              <div key={idx} className="objective-item bg-white rounded-lg p-5 shadow-sm hover:shadow-md">
                <div className="flex gap-3">
                  <span className="text-blue-500 text-xl font-bold flex-shrink-0">{idx + 1}.</span>
                  <p className="text-gray-700">{objective}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-divider my-12"></div>

        {/* Features Section */}
        <div className="mb-20 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-8">
            <div className="text-3xl">⭐</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Key Features</h2>
          </div>
          <p className="text-gray-700 mb-10 text-lg">
            HealthCare Analytics is packed with powerful features designed for your health management needs:
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="feature-card bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:border-blue-500 cursor-pointer"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="section-divider my-12"></div>

        {/* Technology Stack Section */}
        <div className="mb-20 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-8">
            <div className="text-3xl">🛠️</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Technology Stack</h2>
          </div>
          <p className="text-gray-700 mb-10 text-lg">
            Built with enterprise-grade technologies for scalability, security, and performance:
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((stack, idx) => (
              <div
                key={idx}
                className="tech-card bg-white rounded-xl shadow-md p-6 border border-blue-200 hover:border-blue-500"
              >
                <div className="text-4xl mb-3">{stack.icon}</div>
                <h3 className="font-bold text-gray-900 mb-4 text-lg">{stack.category}</h3>
                <ul className="space-y-2">
                  {stack.technologies.map((tech, techIdx) => (
                    <li key={techIdx} className="flex items-center gap-2 text-gray-700">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      <span className="text-sm">{tech}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-20 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-8">
            <div className="text-3xl">🔄</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: 1, title: 'Create Account', desc: 'Sign up securely with email or social login' },
              { step: 2, title: 'Complete Assessment', desc: 'Answer clinical-standard questionnaire' },
              { step: 4, title: 'Get Results', desc: 'Receive detailed risk analysis & insights' },
              { step: 3, title: 'AI Analysis', desc: 'Our ML model processes your data' },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 text-center hover:shadow-lg transition">
                  <div className="inline-block w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
                {item.step < 4 && (
                  <div className="hidden md:block absolute -right-2 top-1/2 transform -translate-y-1/2 text-2xl text-blue-400">→</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-12 mb-20 border-2 border-blue-200 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-8">
            <div className="text-3xl">✨</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Why Choose HealthCare Analytics?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold text-blue-600 mb-3">🎯 Accuracy</h3>
              <p className="text-gray-700">AI models trained on comprehensive medical datasets provide highly accurate risk predictions</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-600 mb-3">🔐 Privacy</h3>
              <p className="text-gray-700">Your health data is encrypted and stored securely with compliance to healthcare standards</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-600 mb-3">📱 Accessibility</h3>
              <p className="text-gray-700">Fully responsive design allows you to access your health data whenever and wherever you need</p>
            </div>
          </div>
        </div>

      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Begin Your Health Journey?</h2>
          <p className="text-lg opacity-95 mb-10">
            Join thousands of users who are taking control of their health with HealthCare Analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-block bg-white text-blue-600 px-10 py-4 rounded-lg text-lg font-bold hover:shadow-xl hover:scale-105 transition transform"
            >
              Get Started Free
            </Link>
            <Link
              to="/awareness"
              className="inline-block bg-blue-700 text-white px-10 py-4 rounded-lg text-lg font-bold hover:bg-blue-800 hover:shadow-xl transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;