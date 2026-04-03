import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronRight, ChevronLeft, User, Activity, Heart, AlertCircle, CheckCircle2, Loader2, Sparkles, Shield, TrendingUp } from 'lucide-react';
import DashboardButton from '../components/DashboardButton';
import InfoTooltip from '../components/InfoTooltip';

const EnhancedAssessmentPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    // Step 1: Personal Details
    patientName: '',
    age: '',
    gender: '',
    pregnancies: '',
    
    // Step 2: Medical Measurements
    systolicBP: '',
    diastolicBP: '',
    bmi: '',
    fastingGlucose: '',
    hba1c: '',
    familyHistory: false,
    
    // Step 3: Lifestyle & Symptoms
    physicalActivity: '',
    smoking: '',
    alcohol: '',
    excessiveThirst: '',
    frequentUrination: '',
    suddenWeightLoss: '',
  });

  const steps = [
    { 
      id: 1, 
      title: 'Personal Information', 
      description: 'Tell us about yourself',
      icon: User,
      color: 'blue'
    },
    { 
      id: 2, 
      title: 'Health Metrics', 
      description: 'Your medical measurements',
      icon: Heart,
      color: 'red'
    },
    { 
      id: 3, 
      title: 'Lifestyle & Symptoms', 
      description: 'Daily habits and health indicators',
      icon: Activity,
      color: 'green'
    },
  ];

  useEffect(() => {
    setProgress((currentStep / steps.length) * 100);
  }, [currentStep]);

  if (!token) {
    navigate('/login');
    return null;
  }

  const validateStep = (step) => {
    const errors = {};

    if (step === 1) {
      if (!formData.patientName?.trim()) {
        errors.patientName = 'Full name is required';
      } else if (formData.patientName.length < 2) {
        errors.patientName = 'Name must be at least 2 characters';
      }

      if (!formData.age) {
        errors.age = 'Age is required';
      } else if (isNaN(formData.age) || formData.age < 1 || formData.age > 120) {
        errors.age = 'Age must be between 1 and 120 years';
      }

      if (!formData.gender) {
        errors.gender = 'Please select your gender';
      }

      if (formData.gender === 'Female') {
        if (formData.pregnancies === '' || formData.pregnancies === null) {
          errors.pregnancies = 'Number of pregnancies is required for females';
        } else if (isNaN(formData.pregnancies) || formData.pregnancies < 0 || formData.pregnancies > 15) {
          errors.pregnancies = 'Number of pregnancies must be between 0 and 15';
        }
      }
    }

    if (step === 2) {
      if (!formData.systolicBP) {
        errors.systolicBP = 'Systolic blood pressure is required';
      } else if (isNaN(formData.systolicBP) || formData.systolicBP < 60 || formData.systolicBP > 250) {
        errors.systolicBP = 'Systolic BP must be between 60 and 250 mmHg';
      }

      if (!formData.diastolicBP) {
        errors.diastolicBP = 'Diastolic blood pressure is required';
      } else if (isNaN(formData.diastolicBP) || formData.diastolicBP < 40 || formData.diastolicBP > 150) {
        errors.diastolicBP = 'Diastolic BP must be between 40 and 150 mmHg';
      }

      if (!formData.bmi) {
        errors.bmi = 'BMI is required';
      } else if (isNaN(formData.bmi) || formData.bmi < 10 || formData.bmi > 60) {
        errors.bmi = 'BMI must be between 10 and 60 kg/m²';
      }

      if (!formData.fastingGlucose) {
        errors.fastingGlucose = 'Fasting blood glucose is required';
      } else if (isNaN(formData.fastingGlucose) || formData.fastingGlucose < 50 || formData.fastingGlucose > 400) {
        errors.fastingGlucose = 'Fasting blood glucose must be between 50 and 400 mg/dL';
      }

      if (formData.hba1c && (isNaN(formData.hba1c) || formData.hba1c < 3 || formData.hba1c > 15)) {
        errors.hba1c = 'HbA1c must be between 3 and 15%';
      }
    }

    if (step === 3) {
      if (!formData.physicalActivity) {
        errors.physicalActivity = 'Please select your physical activity level';
      }
      if (formData.smoking === '') {
        errors.smoking = 'Please select smoking status';
      }
      if (formData.alcohol === '') {
        errors.alcohol = 'Please select alcohol consumption status';
      }
      if (formData.excessiveThirst === '') {
        errors.excessiveThirst = 'Please select an option';
      }
      if (formData.frequentUrination === '') {
        errors.frequentUrination = 'Please select an option';
      }
      if (formData.suddenWeightLoss === '') {
        errors.suddenWeightLoss = 'Please select an option';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    console.log(`Field changed: ${name} = ${newValue} (${type})`);
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    const submissionData = {
      ...formData,
      age: parseInt(formData.age),
      pregnancies: formData.gender === 'Female' ? parseInt(formData.pregnancies) || 0 : null,
      systolicBP: parseInt(formData.systolicBP),
      diastolicBP: parseInt(formData.diastolicBP),
      bmi: parseFloat(formData.bmi),
      fastingGlucose: parseFloat(formData.fastingGlucose),
      hba1c: formData.hba1c ? parseFloat(formData.hba1c) : null,
      smoking: formData.smoking === 'true',
      alcohol: formData.alcohol === 'true',
      excessiveThirst: formData.excessiveThirst === 'true',
      frequentUrination: formData.frequentUrination === 'true',
      suddenWeightLoss: formData.suddenWeightLoss === 'true',
    };

    console.log('Submitting assessment data:', submissionData);
    console.log('Fasting glucose value:', submissionData.fastingGlucose, 'Type:', typeof submissionData.fastingGlucose);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/predictions/assess',
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Response received:', response.data);
      localStorage.setItem('lastPrediction', JSON.stringify(response.data));
      setSuccess('Assessment completed successfully! Redirecting to results...');
      
      setTimeout(() => {
        navigate('/prediction-result', { state: { prediction: response.data } });
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to process assessment. Please try again.';
      setError(errorMessage);
      console.error('Assessment error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    const step = steps.find(s => s.id === currentStep);
    const Icon = step.icon;

    switch (currentStep) {
      case 1:
        return <PersonalInfoStep formData={formData} errors={validationErrors} handleChange={handleChange} />;
      case 2:
        return <MedicalMeasurementsStep formData={formData} errors={validationErrors} handleChange={handleChange} />;
      case 3:
        return <LifestyleSymptomsStep formData={formData} errors={validationErrors} handleChange={handleChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Diabetes Risk Assessment</h1>
                <p className="text-sm text-gray-600">Advanced AI-powered health evaluation</p>
              </div>
            </div>
            <DashboardButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep >= step.id;
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? `bg-${step.color}-600 text-white shadow-lg scale-110`
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className={`mt-2 text-center text-sm font-medium ${
                      isActive ? `text-${step.color}-600` : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                    <div className={`text-xs text-center ${
                      isActive ? 'text-gray-700' : 'text-gray-400'
                    }`}>
                      {step.description}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-4 transition-all duration-300 ${
                      currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-sm text-gray-600 mt-2">
            Step {currentStep} of {steps.length} • {Math.round(progress)}% Complete
          </p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-red-800">{error}</div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-green-800">{success}</div>
          </div>
        )}

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            {renderStep()}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:shadow-md'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>
          
          <button
            onClick={currentStep === steps.length ? handleSubmit : handleNext}
            disabled={isSubmitting}
            className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transform hover:scale-105'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{currentStep === steps.length ? 'Complete Assessment' : 'Next Step'}</span>
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center space-x-3 mb-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Secure & Private</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Your health data is encrypted and protected with industry-standard security measures.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center space-x-3 mb-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <h3 className="font-semibold text-gray-900">Advanced Analytics</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Our AI models analyze multiple health factors for accurate risk assessment.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center space-x-3 mb-3">
              <Activity className="w-8 h-8 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Personalized Insights</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Get tailored recommendations based on your unique health profile.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

// Step 1: Personal Information
const PersonalInfoStep = ({ formData, errors, handleChange }) => (
  <div className="space-y-8">
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
        <User className="w-8 h-8 text-blue-600" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Personal Information</h2>
      <p className="text-gray-600">Let's start with some basic information about you</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Patient Name */}
      <div className="space-y-2">
        <label className="block text-base font-semibold text-gray-700">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="patientName"
          value={formData.patientName}
          onChange={handleChange}
          placeholder="Enter your full name"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
            errors.patientName ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
        />
        {errors.patientName && (
          <p className="text-red-600 text-sm flex items-center mt-1">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.patientName}
          </p>
        )}
      </div>

      {/* Age */}
      <div className="space-y-2">
        <label className="block text-base font-semibold text-gray-700">
          Age <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="25"
            min="1"
            max="120"
            className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              errors.age ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          <span className="text-gray-600 font-medium">years</span>
        </div>
        {errors.age && (
          <p className="text-red-600 text-sm flex items-center mt-1">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.age}
          </p>
        )}
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <label className="block text-base font-semibold text-gray-700">
          Gender <span className="text-red-500">*</span>
        </label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
            errors.gender ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
        >
          <option value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.gender && (
          <p className="text-red-600 text-sm flex items-center mt-1">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.gender}
          </p>
        )}
      </div>

      {/* Pregnancies (conditional) */}
      {formData.gender === 'Female' && (
        <div className="space-y-2">
          <label className="block text-base font-semibold text-gray-700">
            Number of Pregnancies <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              name="pregnancies"
              value={formData.pregnancies}
              onChange={handleChange}
              placeholder="0"
              min="0"
              max="15"
              className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.pregnancies ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
            <span className="text-gray-600 font-medium">pregnancies</span>
          </div>
          {errors.pregnancies && (
            <p className="text-red-600 text-sm flex items-center mt-1">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.pregnancies}
            </p>
          )}
          <p className="text-xs text-gray-500">Number of pregnancies (0-15)</p>
        </div>
      )}
    </div>
  </div>
);

// Step 2: Medical Measurements
const MedicalMeasurementsStep = ({ formData, errors, handleChange }) => (
  <div className="space-y-8">
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
        <Heart className="w-8 h-8 text-red-600" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Health Metrics</h2>
      <p className="text-gray-600">Please provide your latest medical measurements</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Blood Pressure */}
      <div className="space-y-2">
        <label className="block text-base font-semibold text-gray-700 flex items-center">
          Blood Pressure <span className="text-red-500">*</span>
          <InfoTooltip 
            text="Measure using a BP machine (home device or clinic). Example: 120/80 mmHg" 
            icon="🩺"
            position="top"
          />
        </label>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="number"
            name="systolicBP"
            value={formData.systolicBP}
            onChange={handleChange}
            placeholder="120"
            className={`w-24 sm:w-32 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              errors.systolicBP ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          <span className="text-gray-600 font-medium">/</span>
          <input
            type="number"
            name="diastolicBP"
            value={formData.diastolicBP}
            onChange={handleChange}
            placeholder="80"
            className={`w-24 sm:w-32 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              errors.diastolicBP ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          <span className="text-gray-600 font-medium whitespace-nowrap">mmHg</span>
        </div>
        {(errors.systolicBP || errors.diastolicBP) && (
          <p className="text-red-600 text-sm flex items-center mt-1">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.systolicBP || errors.diastolicBP}
          </p>
        )}
        <p className="text-xs text-gray-500">Example: 120/80 mmHg</p>
      </div>

      {/* BMI */}
      <div className="space-y-2">
        <label className="block text-base font-semibold text-gray-700 flex items-center">
          BMI (Body Mass Index) <span className="text-red-500">*</span>
          <InfoTooltip 
            text="Automatically calculated from your height and weight" 
            icon="⚖️"
            position="top"
          />
        </label>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="number"
            name="bmi"
            value={formData.bmi}
            onChange={handleChange}
            placeholder="22.5"
            step="0.1"
            className={`w-32 sm:w-40 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              errors.bmi ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          <span className="text-gray-600 font-medium whitespace-nowrap">kg/m²</span>
        </div>
        {errors.bmi && (
          <p className="text-red-600 text-sm flex items-center mt-1">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.bmi}
          </p>
        )}
        <p className="text-xs text-gray-500">Example: 22.5 kg/m²</p>
      </div>

      {/* Fasting Blood Glucose */}
      <div className="space-y-2">
        <label className="block text-base font-semibold text-gray-700 flex items-center">
          Fasting Blood Glucose <span className="text-red-500">*</span>
          <InfoTooltip 
            text="Measure using a glucometer or lab test after 8–12 hours fasting" 
            icon="🩸"
            position="top"
          />
        </label>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="number"
            name="fastingGlucose"
            value={formData.fastingGlucose}
            onChange={handleChange}
            placeholder="90"
            className={`w-32 sm:w-40 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              errors.fastingGlucose ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          <span className="text-gray-600 font-medium whitespace-nowrap">mg/dL</span>
        </div>
        {errors.fastingGlucose && (
          <p className="text-red-600 text-sm flex items-center mt-1">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.fastingGlucose}
          </p>
        )}
        <p className="text-xs text-gray-500">Example: 90 mg/dL</p>
      </div>

      {/* HbA1c */}
      <div className="space-y-2">
        <label className="block text-base font-semibold text-gray-700 flex items-center">
          HbA1c <span className="text-gray-400">(Optional)</span>
          <InfoTooltip 
            text="Found in lab reports. Shows average blood sugar over 2–3 months" 
            icon="🧪"
            position="top"
          />
        </label>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="number"
            name="hba1c"
            value={formData.hba1c}
            onChange={handleChange}
            placeholder="5.2"
            step="0.1"
            className={`w-32 sm:w-40 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              errors.hba1c ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          <span className="text-gray-600 font-medium whitespace-nowrap">%</span>
        </div>
        {errors.hba1c && (
          <p className="text-red-600 text-sm flex items-center mt-1">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.hba1c}
          </p>
        )}
        <p className="text-xs text-gray-500">Example: 5.2%</p>
      </div>
    </div>

    {/* Family History */}
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <label className="flex items-center space-x-3 cursor-pointer">
        <input
          type="checkbox"
          name="familyHistory"
          checked={formData.familyHistory}
          onChange={handleChange}
          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
        />
        <div>
          <span className="text-gray-700 font-medium">Family History of Diabetes</span>
          <p className="text-sm text-gray-600 mt-1">Has any immediate family member been diagnosed with diabetes?</p>
        </div>
      </label>
    </div>
  </div>
);

// Step 3: Lifestyle & Symptoms
const LifestyleSymptomsStep = ({ formData, errors, handleChange }) => (
  <div className="space-y-8">
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
        <Activity className="w-8 h-8 text-green-600" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Lifestyle & Symptoms</h2>
      <p className="text-gray-600">Tell us about your daily habits and any symptoms you're experiencing</p>
    </div>

    {/* Physical Activity */}
    <div className="space-y-2">
      <label className="block text-base font-semibold text-gray-700">
        Physical Activity Level <span className="text-red-500">*</span>
      </label>
      <select
        name="physicalActivity"
        value={formData.physicalActivity}
        onChange={handleChange}
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
          errors.physicalActivity ? 'border-red-500 bg-red-50' : 'border-gray-300'
        }`}
      >
        <option value="">Select activity level</option>
        <option value="No Activity">No regular physical activity</option>
        <option value="Little Activity">Light activity (1-2 times per week)</option>
        <option value="Moderate Activity">Moderate activity (3-4 times per week)</option>
        <option value="High Activity">High activity (5+ times per week)</option>
      </select>
      {errors.physicalActivity && (
        <p className="text-red-600 text-sm flex items-center mt-1">
          <AlertCircle className="w-4 h-4 mr-1" />
          {errors.physicalActivity}
        </p>
      )}
    </div>

    {/* Lifestyle Factors */}
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Lifestyle Factors</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Smoking */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Do you smoke? <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {['true', 'false'].map((value) => (
              <label key={value} className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="smoking"
                  value={value}
                  checked={formData.smoking === value}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-700">{value === 'true' ? 'Yes, I smoke' : 'No, I don\'t smoke'}</span>
              </label>
            ))}
          </div>
          {errors.smoking && (
            <p className="text-red-600 text-sm flex items-center mt-1">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.smoking}
            </p>
          )}
        </div>

        {/* Alcohol */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Do you consume alcohol? <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {['true', 'false'].map((value) => (
              <label key={value} className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="alcohol"
                  value={value}
                  checked={formData.alcohol === value}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-700">{value === 'true' ? 'Yes, I drink alcohol' : 'No, I don\'t drink alcohol'}</span>
              </label>
            ))}
          </div>
          {errors.alcohol && (
            <p className="text-red-600 text-sm flex items-center mt-1">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.alcohol}
            </p>
          )}
        </div>
      </div>
    </div>

    {/* Symptoms */}
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Diabetes Symptoms</h3>
      
      <div className="space-y-4">
        {/* Excessive Thirst */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Excessive Thirst <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {['true', 'false'].map((value) => (
              <label key={value} className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="excessiveThirst"
                  value={value}
                  checked={formData.excessiveThirst === value}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-700">{value === 'true' ? 'Yes, I experience excessive thirst' : 'No, this is not an issue'}</span>
              </label>
            ))}
          </div>
          {errors.excessiveThirst && (
            <p className="text-red-600 text-sm flex items-center mt-1">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.excessiveThirst}
            </p>
          )}
        </div>

        {/* Frequent Urination */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Frequent Urination <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {['true', 'false'].map((value) => (
              <label key={value} className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="frequentUrination"
                  value={value}
                  checked={formData.frequentUrination === value}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-700">{value === 'true' ? 'Yes, I urinate frequently' : 'No, this is not an issue'}</span>
              </label>
            ))}
          </div>
          {errors.frequentUrination && (
            <p className="text-red-600 text-sm flex items-center mt-1">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.frequentUrination}
            </p>
          )}
        </div>

        {/* Sudden Weight Loss */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Sudden Weight Loss <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {['true', 'false'].map((value) => (
              <label key={value} className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="suddenWeightLoss"
                  value={value}
                  checked={formData.suddenWeightLoss === value}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-700">{value === 'true' ? 'Yes, I\'ve experienced sudden weight loss' : 'No, this has not occurred'}</span>
              </label>
            ))}
          </div>
          {errors.suddenWeightLoss && (
            <p className="text-red-600 text-sm flex items-center mt-1">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.suddenWeightLoss}
            </p>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default EnhancedAssessmentPage;
