import { useState } from 'react';

const PredictionForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    fastingBloodGlucose: '',
    diastolicBloodPressure: '',
    bmi: '',
    serumInsulin: '',
    skinFoldThickness: '',
    age: '',
    familyHistory: false,
  });

  const [errors, setErrors] = useState({});

  const validateInput = () => {
    const newErrors = {};

    if (!formData.fastingBloodGlucose) newErrors.fastingBloodGlucose = 'Required';
    else if (isNaN(formData.fastingBloodGlucose) || formData.fastingBloodGlucose < 0)
      newErrors.fastingBloodGlucose = 'Must be a valid positive number';

    if (!formData.diastolicBloodPressure) newErrors.diastolicBloodPressure = 'Required';
    else if (isNaN(formData.diastolicBloodPressure) || formData.diastolicBloodPressure < 0)
      newErrors.diastolicBloodPressure = 'Must be a valid positive number';

    if (!formData.bmi) newErrors.bmi = 'Required';
    else if (isNaN(formData.bmi) || formData.bmi < 10 || formData.bmi > 60)
      newErrors.bmi = 'Must be between 10 and 60';

    if (!formData.serumInsulin) newErrors.serumInsulin = 'Required';
    else if (isNaN(formData.serumInsulin) || formData.serumInsulin < 0)
      newErrors.serumInsulin = 'Must be a valid positive number';

    if (!formData.skinFoldThickness) newErrors.skinFoldThickness = 'Required';
    else if (isNaN(formData.skinFoldThickness) || formData.skinFoldThickness < 0)
      newErrors.skinFoldThickness = 'Must be a valid positive number';

    if (!formData.age) newErrors.age = 'Required';
    else if (isNaN(formData.age) || formData.age < 18 || formData.age > 120)
      newErrors.age = 'Age must be between 18 and 120';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateInput()) {
      onSubmit({
        ...formData,
        fastingBloodGlucose: parseInt(formData.fastingBloodGlucose),
        diastolicBloodPressure: parseInt(formData.diastolicBloodPressure),
        bmi: parseFloat(formData.bmi),
        serumInsulin: parseFloat(formData.serumInsulin),
        skinFoldThickness: parseInt(formData.skinFoldThickness),
        age: parseInt(formData.age),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fasting Blood Glucose */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Fasting Blood Glucose <span className="text-red-600">*</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              name="fastingBloodGlucose"
              value={formData.fastingBloodGlucose}
              onChange={handleChange}
              placeholder="70-100"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.fastingBloodGlucose ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <span className="text-gray-600 font-medium">mg/dL</span>
          </div>
          {errors.fastingBloodGlucose && (
            <p className="text-red-600 text-sm mt-1">{errors.fastingBloodGlucose}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">Reference: 70-100 mg/dL (fasting)</p>
        </div>

        {/* Diastolic Blood Pressure */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Diastolic Blood Pressure <span className="text-red-600">*</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              name="diastolicBloodPressure"
              value={formData.diastolicBloodPressure}
              onChange={handleChange}
              placeholder="60-80"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.diastolicBloodPressure ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <span className="text-gray-600 font-medium">mmHg</span>
          </div>
          {errors.diastolicBloodPressure && (
            <p className="text-red-600 text-sm mt-1">{errors.diastolicBloodPressure}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">Reference: &lt;80 mmHg</p>
        </div>

        {/* BMI */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Body Mass Index (BMI) <span className="text-red-600">*</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.1"
              name="bmi"
              value={formData.bmi}
              onChange={handleChange}
              placeholder="18.5-24.9"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.bmi ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <span className="text-gray-600 font-medium">kg/m²</span>
          </div>
          {errors.bmi && <p className="text-red-600 text-sm mt-1">{errors.bmi}</p>}
          <p className="text-xs text-gray-500 mt-1">Reference: 18.5-24.9 (Normal)</p>
        </div>

        {/* Serum Insulin */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Serum Insulin (2-hour) <span className="text-red-600">*</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.1"
              name="serumInsulin"
              value={formData.serumInsulin}
              onChange={handleChange}
              placeholder="16-166"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.serumInsulin ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <span className="text-gray-600 font-medium">µU/mL</span>
          </div>
          {errors.serumInsulin && (
            <p className="text-red-600 text-sm mt-1">{errors.serumInsulin}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">Reference: 16-166 µU/mL</p>
        </div>

        {/* Skinfold Thickness */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Skinfold Thickness <span className="text-red-600">*</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              name="skinFoldThickness"
              value={formData.skinFoldThickness}
              onChange={handleChange}
              placeholder="0-100"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.skinFoldThickness ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <span className="text-gray-600 font-medium">mm</span>
          </div>
          {errors.skinFoldThickness && (
            <p className="text-red-600 text-sm mt-1">{errors.skinFoldThickness}</p>
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
              placeholder="18-120"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.age ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <span className="text-gray-600 font-medium">years</span>
          </div>
          {errors.age && <p className="text-red-600 text-sm mt-1">{errors.age}</p>}
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
          Check this box if any family member has diabetes (parent, sibling, or close relative)
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block animate-spin">⚙️</span>
            Processing Assessment...
          </span>
        ) : (
          'Get Assessment Results'
        )}
      </button>
    </form>
  );
};

export default PredictionForm;
