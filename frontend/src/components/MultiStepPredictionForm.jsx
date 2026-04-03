import { useState } from 'react';

const MultiStepPredictionForm = ({ onSubmit, loading }) => {
  const [currentStep, setCurrentStep] = useState(1);
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

  const [errors, setErrors] = useState({});

  const steps = [
    { id: 1, title: 'Personal Details', description: 'Basic information about you' },
    { id: 2, title: 'Medical Measurements', description: 'Your health metrics' },
    { id: 3, title: 'Lifestyle & Symptoms', description: 'Daily habits and symptoms' },
  ];

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.patientName.trim()) newErrors.patientName = 'Name is required';
      if (!formData.age) newErrors.age = 'Age is required';
      else if (isNaN(formData.age) || formData.age < 1 || formData.age > 120)
        newErrors.age = 'Age must be between 1 and 120';
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (formData.gender === 'Female') {
        if (formData.pregnancies === '' || formData.pregnancies === null) {
          newErrors.pregnancies = 'Number of pregnancies is required for females';
        } else if (isNaN(formData.pregnancies) || formData.pregnancies < 0 || formData.pregnancies > 10) {
          newErrors.pregnancies = 'Pregnancies must be between 0 and 10';
        }
      }
    }

    if (step === 2) {
      if (!formData.systolicBP) newErrors.systolicBP = 'Systolic BP is required';
      else if (isNaN(formData.systolicBP) || formData.systolicBP < 60 || formData.systolicBP > 250)
        newErrors.systolicBP = 'Must be between 60 and 250 mmHg';
      
      if (!formData.diastolicBP) newErrors.diastolicBP = 'Diastolic BP is required';
      else if (isNaN(formData.diastolicBP) || formData.diastolicBP < 40 || formData.diastolicBP > 150)
        newErrors.diastolicBP = 'Must be between 40 and 150 mmHg';
      
      if (!formData.bmi) newErrors.bmi = 'BMI is required';
      else if (isNaN(formData.bmi) || formData.bmi < 10 || formData.bmi > 60)
        newErrors.bmi = 'BMI must be between 10 and 60';
      
      if (formData.hba1c && (isNaN(formData.hba1c) || formData.hba1c < 3 || formData.hba1c > 15))
        newErrors.hba1c = 'HbA1c must be between 3 and 15%';
    }

    if (step === 3) {
      if (!formData.physicalActivity) newErrors.physicalActivity = 'Physical activity level is required';
      if (formData.smoking === '') newErrors.smoking = 'Smoking status is required';
      if (formData.alcohol === '') newErrors.alcohol = 'Alcohol consumption is required';
      if (formData.excessiveThirst === '') newErrors.excessiveThirst = 'This field is required';
      if (formData.frequentUrination === '') newErrors.frequentUrination = 'This field is required';
      if (formData.suddenWeightLoss === '') newErrors.suddenWeightLoss = 'This field is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const submissionData = {
      ...formData,
      age: parseInt(formData.age),
      pregnancies: formData.gender === 'Female' ? parseInt(formData.pregnancies) || 0 : null,
      systolicBP: parseInt(formData.systolicBP),
      diastolicBP: parseInt(formData.diastolicBP),
      bmi: parseFloat(formData.bmi),
      hba1c: formData.hba1c ? parseFloat(formData.hba1c) : null,
      smoking: formData.smoking === 'true',
      alcohol: formData.alcohol === 'true',
      excessiveThirst: formData.excessiveThirst === 'true',
      frequentUrination: formData.frequentUrination === 'true',
      suddenWeightLoss: formData.suddenWeightLoss === 'true',
    };
    
    console.log('Frontend submission data:', submissionData);
    
    onSubmit(submissionData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 formData={formData} errors={errors} handleChange={handleChange} />;
      case 2:
        return <Step2 formData={formData} errors={errors} handleChange={handleChange} />;
      case 3:
        return <Step3 formData={formData} errors={errors} handleChange={handleChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  currentStep >= step.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step.id}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-full h-1 mx-4 transition-colors ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`text-center ${
                currentStep >= step.id ? 'text-blue-600 font-semibold' : 'text-gray-500'
              }`}
            >
              <div>{step.title}</div>
              <div className="text-xs mt-1">{step.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6 transition-all duration-300">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-4">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 1}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            currentStep === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          ← Back
        </button>
        
        <button
          type="button"
          onClick={handleNext}
          disabled={loading}
          className={`px-6 py-3 rounded-lg font-semibold text-white transition ml-auto ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
          }`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="inline-block animate-spin">⚙️</span>
              {currentStep === 3 ? 'Processing...' : 'Loading...'}
            </span>
          ) : (
            currentStep === 3 ? 'Submit Assessment' : 'Next →'
          )}
        </button>
      </div>
    </div>
  );
};

// Step 1: Personal Details
const Step1 = ({ formData, errors, handleChange }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Details</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Patient Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Patient Full Name <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          name="patientName"
          value={formData.patientName}
          onChange={handleChange}
          placeholder="Enter your full name"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.patientName ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.patientName && (
          <p className="text-red-600 text-sm mt-1">{errors.patientName}</p>
        )}
      </div>

      {/* Age */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Age <span className="text-red-600">*</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="1-120"
            min="1"
            max="120"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.age ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <span className="text-gray-600 font-medium">years</span>
        </div>
        {errors.age && <p className="text-red-600 text-sm mt-1">{errors.age}</p>}
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Gender <span className="text-red-600">*</span>
        </label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.gender ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.gender && <p className="text-red-600 text-sm mt-1">{errors.gender}</p>}
      </div>

      {/* Pregnancies (conditional) */}
      {formData.gender === 'Female' && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Pregnancies <span className="text-red-600">*</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              name="pregnancies"
              value={formData.pregnancies}
              onChange={handleChange}
              placeholder="0-10"
              min="0"
              max="10"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.pregnancies ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <span className="text-gray-600 font-medium">count</span>
          </div>
          {errors.pregnancies && <p className="text-red-600 text-sm mt-1">{errors.pregnancies}</p>}
          <p className="text-xs text-gray-500 mt-1">Number of pregnancies (0-10)</p>
        </div>
      )}
    </div>
  </div>
);

// Step 2: Medical Measurements
const Step2 = ({ formData, errors, handleChange }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Medical Measurements</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Blood Pressure */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Blood Pressure <span className="text-red-600">*</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            name="systolicBP"
            value={formData.systolicBP}
            onChange={handleChange}
            placeholder="120"
            className={`w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.systolicBP ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <span className="text-gray-600">/</span>
          <input
            type="number"
            name="diastolicBP"
            value={formData.diastolicBP}
            onChange={handleChange}
            placeholder="80"
            className={`w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.diastolicBP ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <span className="text-gray-600 font-medium">mmHg</span>
        </div>
        {errors.systolicBP && (
          <p className="text-red-600 text-sm mt-1">{errors.systolicBP}</p>
        )}
        {errors.diastolicBP && (
          <p className="text-red-600 text-sm mt-1">{errors.diastolicBP}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">Example: 120 / 80 mmHg</p>
      </div>

      {/* BMI */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          BMI (Body Mass Index) <span className="text-red-600">*</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            name="bmi"
            value={formData.bmi}
            onChange={handleChange}
            placeholder="18.5-24.9"
            step="0.1"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.bmi ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <span className="text-gray-600 font-medium">kg/m²</span>
        </div>
        {errors.bmi && <p className="text-red-600 text-sm mt-1">{errors.bmi}</p>}
        <p className="text-xs text-gray-500 mt-1">Reference: 18.5-24.9 (Normal)</p>
      </div>

      {/* HbA1c */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          HbA1c
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            name="hba1c"
            value={formData.hba1c}
            onChange={handleChange}
            placeholder="4.5-5.7"
            step="0.1"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.hba1c ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <span className="text-gray-600 font-medium">%</span>
        </div>
        {errors.hba1c && <p className="text-red-600 text-sm mt-1">{errors.hba1c}</p>}
        <p className="text-xs text-gray-500 mt-1">Optional field. Reference: &lt;5.7% (Normal)</p>
      </div>
    </div>

    {/* Family History */}
    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="familyHistory"
          checked={formData.familyHistory}
          onChange={handleChange}
          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-gray-700 font-medium">Family History of Diabetes</span>
      </label>
      <p className="text-sm text-gray-600 mt-2 ml-8">
        Has any family member been diagnosed with diabetes?
      </p>
    </div>
  </div>
);

// Step 3: Lifestyle & Symptoms
const Step3 = ({ formData, errors, handleChange }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Lifestyle & Symptoms</h2>
    
    {/* Physical Activity */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Physical Activity <span className="text-red-600">*</span>
      </label>
      <select
        name="physicalActivity"
        value={formData.physicalActivity}
        onChange={handleChange}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors.physicalActivity ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <option value="">Select activity level</option>
        <option value="No Activity">No Activity</option>
        <option value="Little Activity">Little Activity</option>
        <option value="Moderate Activity">Moderate Activity</option>
        <option value="High Activity">High Activity</option>
      </select>
      {errors.physicalActivity && (
        <p className="text-red-600 text-sm mt-1">{errors.physicalActivity}</p>
      )}
    </div>

    {/* Lifestyle Factors */}
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Lifestyle Factors</h3>
      
      {/* Smoking */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Smoking <span className="text-red-600">*</span>
        </label>
        <div className="flex gap-4">
          {['true', 'false'].map((value) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="smoking"
                value={value}
                checked={formData.smoking === value}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700">{value === 'true' ? 'Yes' : 'No'}</span>
            </label>
          ))}
        </div>
        {errors.smoking && <p className="text-red-600 text-sm mt-1">{errors.smoking}</p>}
      </div>

      {/* Alcohol */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alcohol Consumption <span className="text-red-600">*</span>
        </label>
        <div className="flex gap-4">
          {['true', 'false'].map((value) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="alcohol"
                value={value}
                checked={formData.alcohol === value}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700">{value === 'true' ? 'Yes' : 'No'}</span>
            </label>
          ))}
        </div>
        {errors.alcohol && <p className="text-red-600 text-sm mt-1">{errors.alcohol}</p>}
      </div>
    </div>

    {/* Symptoms */}
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Symptoms</h3>
      
      {/* Excessive Thirst */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Excessive Thirst <span className="text-red-600">*</span>
        </label>
        <div className="flex gap-4">
          {['true', 'false'].map((value) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="excessiveThirst"
                value={value}
                checked={formData.excessiveThirst === value}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700">{value === 'true' ? 'Yes' : 'No'}</span>
            </label>
          ))}
        </div>
        {errors.excessiveThirst && <p className="text-red-600 text-sm mt-1">{errors.excessiveThirst}</p>}
      </div>

      {/* Frequent Urination */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Frequent Urination <span className="text-red-600">*</span>
        </label>
        <div className="flex gap-4">
          {['true', 'false'].map((value) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="frequentUrination"
                value={value}
                checked={formData.frequentUrination === value}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700">{value === 'true' ? 'Yes' : 'No'}</span>
            </label>
          ))}
        </div>
        {errors.frequentUrination && <p className="text-red-600 text-sm mt-1">{errors.frequentUrination}</p>}
      </div>

      {/* Sudden Weight Loss */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sudden Weight Loss <span className="text-red-600">*</span>
        </label>
        <div className="flex gap-4">
          {['true', 'false'].map((value) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="suddenWeightLoss"
                value={value}
                checked={formData.suddenWeightLoss === value}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700">{value === 'true' ? 'Yes' : 'No'}</span>
            </label>
          ))}
        </div>
        {errors.suddenWeightLoss && <p className="text-red-600 text-sm mt-1">{errors.suddenWeightLoss}</p>}
      </div>
    </div>
  </div>
);

export default MultiStepPredictionForm;
