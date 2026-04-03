import { Link } from 'react-router-dom';
import Header from '../components/Header';

const LandingPage = () => {
  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #fafafa 0%, #f8f9fa 100%)'}}>
      <Header showProfileMenu={true} />

      {/* Hero Section with Medical Images */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-6" style={{
              background: 'linear-gradient(135deg, #0077b6, #00b4d8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              AI-Powered Diabetes Risk Assessment
            </h1>
            <p className="text-base mb-8 max-w-2xl" style={{color: '#6c757d'}}>
              Take control of your health with our advanced AI system that predicts diabetes risk,
              provides personalized recommendations, and helps you maintain a healthy lifestyle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link 
                to="/register" 
                className="medical-primary px-6 py-3 rounded-xl text-sm font-semibold transition-all transform hover:scale-105"
              >
                Get Started
              </Link>
              <Link 
                to="/awareness" 
                className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-all transform hover:scale-105"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Medical Technology" 
                className="rounded-2xl shadow-2xl w-full h-auto"
                style={{borderRadius: '16px'}}
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-blue-400 to-teal-400 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full opacity-20 blur-xl"></div>
          </div>
        </div>
      </section>

      {/* Medical Statistics Section */}
      <section className="py-16" style={{background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="p-6 rounded-xl bg-white shadow-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">537M</div>
              <div className="text-gray-600">Adults living with diabetes worldwide</div>
            </div>
            <div className="p-6 rounded-xl bg-white shadow-lg">
              <div className="text-4xl font-bold text-teal-600 mb-2">95%</div>
              <div className="text-gray-600">Accuracy in risk prediction</div>
            </div>
            <div className="p-6 rounded-xl bg-white shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-gray-600">AI Health Assistant Available</div>
            </div>
            <div className="p-6 rounded-xl bg-white shadow-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Lives impacted globally</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features with Medical Images */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4" style={{color: '#03045e'}}>Comprehensive Healthcare Features</h2>
            <p className="text-gray-600">Advanced medical technology at your fingertips</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2" style={{background: 'linear-gradient(135deg, #fafafa, #f8f9fa)'}}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" 
                  alt="Risk Assessment" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{color: '#03045e'}}>Advanced Risk Assessment</h3>
              <p className="text-gray-600 leading-relaxed">
                State-of-the-art AI algorithms analyze your health metrics with 95% accuracy to predict diabetes risk factors
              </p>
            </div>
            
            <div className="group p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2" style={{background: 'linear-gradient(135deg, #fafafa, #f8f9fa)'}}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" 
                  alt="Health Dashboard" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{color: '#03045e'}}>Interactive Health Dashboard</h3>
              <p className="text-gray-600 leading-relaxed">
                Visualize your health journey with real-time analytics, personalized insights, and progress tracking
              </p>
            </div>
            
            <div className="group p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2" style={{background: 'linear-gradient(135deg, #fafafa, #f8f9fa)'}}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" 
                  alt="AI Assistant" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{color: '#03045e'}}>24/7 Medical AI Assistant</h3>
              <p className="text-gray-600 leading-relaxed">
                Get instant answers to diabetes-related questions and personalized health advice anytime, anywhere
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Medical Technology Showcase */}
      <section className="py-20" style={{background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img 
                src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Medical Technology" 
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold mb-6" style={{color: '#03045e'}}>Cutting-Edge Medical Technology</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our platform leverages the latest advancements in artificial intelligence and machine learning 
                to provide you with accurate, personalized health insights. We combine decades of medical research 
                with modern technology to deliver healthcare solutions you can trust.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#00b4d8'}}></div>
                  <span className="text-gray-700">FDA-compliant algorithms</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#52b788'}}></div>
                  <span className="text-gray-700">HIPAA-compliant data security</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#0077b6'}}></div>
                  <span className="text-gray-700">Continuous learning AI models</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified Footer */}
      <footer className="py-8" style={{background: 'linear-gradient(135deg, #03045e 0%, #0077b6 100%)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-300">&copy; 2026 HealthCare Analytics. All rights reserved. | Empowering healthier lives through technology</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;