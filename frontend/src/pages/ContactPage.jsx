import { Link } from 'react-router-dom';
import { useState } from 'react';
import Header from '../components/Header';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const contactMethods = [
    { icon: '📧', title: 'Email', value: 'support@healthcareai.com', desc: 'Send us an email anytime' },
    { icon: '📞', title: 'Phone', value: '+1 (555) 123-4567', desc: 'Call us during business hours' },
    { icon: '🏢', title: 'Address', value: '123 Health Street, Medical City, MC 12345', desc: 'Visit our office' },
    { icon: '💬', title: 'Live Chat', value: 'Available 24/7', desc: 'Chat with our support team' },
  ];

  const faqItems = [
    { q: 'How accurate is the diabetes risk assessment?', a: 'Our AI model is trained on extensive medical data and achieves 92% accuracy. However, always consult with healthcare professionals for medical decisions.' },
    { q: 'Is my personal health data secure?', a: 'Yes, we use enterprise-grade encryption (AES-256) and JWT authentication to protect all your data.' },
    { q: 'Can I book an appointment through the platform?', a: 'Yes, our appointment booking system allows you to schedule consultations with registered healthcare providers.' },
    { q: 'What is the cost of using this platform?', a: 'We offer both free and premium tiers. Basic risk assessment is free; premium features include detailed reports and telehealth consultations.' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

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

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }

        .animate-slide-in {
          animation: slideIn 0.5s ease-out;
        }

        .animate-scale-in {
          animation: scaleIn 0.5s ease-out;
        }

        .contact-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .contact-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(59, 130, 246, 0.15);
          border-color: rgb(59, 130, 246);
        }

        .form-input {
          transition: all 0.3s ease;
          border: 2px solid rgba(59, 130, 246, 0.2);
        }

        .form-input:focus {
          outline: none;
          border-color: rgb(59, 130, 246);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .submit-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.6s;
        }

        .submit-btn:hover::before {
          left: 100%;
        }

        .faq-item {
          transition: all 0.3s ease;
        }

        .faq-item:hover {
          background-color: rgba(59, 130, 246, 0.05);
        }

        .section-divider {
          background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent);
          height: 2px;
        }

        .success-message {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{color: 'black'}}>Get in Touch</h1>
          <p className="text-xl text-blue-100">We're here to help! Have questions or need support? Contact us today.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Contact Methods */}
        <section className="mb-16 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Contact Methods</h2>
          <div className="section-divider mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="contact-card p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg text-center"
              >
                <div className="text-4xl mb-4">{method.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-blue-600 font-semibold mb-2">{method.value}</p>
                <p className="text-gray-600 text-sm">{method.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section className="mb-16 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Send us a Message</h2>
          <div className="section-divider mb-8"></div>
          
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
            {submitted && (
              <div className="success-message mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                ✓ Thank you! Your message has been sent successfully. We'll get back to you soon.
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="form-input w-full px-4 py-3 rounded-lg bg-gray-50 focus:bg-white"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="form-input w-full px-4 py-3 rounded-lg bg-gray-50 focus:bg-white"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="form-input w-full px-4 py-3 rounded-lg bg-gray-50 focus:bg-white"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Message</label>
                <textarea
                  rows="6"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="form-input w-full px-4 py-3 rounded-lg bg-gray-50 focus:bg-white resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button
                type="submit"
                className="submit-btn w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-lg"
              >
                Send Message →
              </button>
            </form>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
          <div className="section-divider mb-8"></div>
          
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="faq-item p-6 bg-white rounded-lg border border-gray-200 shadow-sm"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-start">
                  <span className="text-blue-600 mr-3">Q:</span>
                  {item.q}
                </h3>
                <p className="text-gray-700 flex items-start ml-6">
                  <span className="text-cyan-600 font-bold mr-3">A:</span>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center animate-fade-in-up">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Take Control of Your Health?</h2>
            <p className="text-lg text-blue-100 mb-8">Start your diabetes risk assessment today and get personalized recommendations.</p>
            <Link
              to="/assessment"
              className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Begin Assessment
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;