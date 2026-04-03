const HealthRecommendations = ({ prediction }) => {
  // Helper to get the correct field value
  const getFieldValue = (field1, field2) => {
    return prediction[field1] !== undefined && prediction[field1] !== null 
      ? prediction[field1] 
      : prediction[field2];
  };

  const fastingGlucose = getFieldValue('fastingGlucose', 'fastingBloodGlucose');
  const diastolicBP = getFieldValue('diastolicBP', 'diastolicBloodPressure');
  const probability = typeof prediction.probability === 'string' ? parseFloat(prediction.probability) : prediction.probability;
  const riskPercentage = probability ? (probability * 100).toFixed(1) : 0;

  // Determine risk status based on probability
  const getRiskStatus = () => {
    if (riskPercentage >= 80) {
      return { label: 'High Risk ⚠️', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-600' };
    } else if (riskPercentage >= 50) {
      return { label: 'Moderate Risk ⚡', color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-600' };
    } else {
      return { label: 'Great Health ✅', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-600' };
    }
  };

  const riskStatus = getRiskStatus();

  const getRecommendations = () => {
    const recommendations = {
      diet: [],
      exercise: [],
      lifestyle: [],
      medical: []
    };

    // Diet recommendations based on glucose level
    if (fastingGlucose && fastingGlucose > 126) {
      recommendations.diet.push('Reduce carbohydrate intake, especially simple sugars and refined grains');
      recommendations.diet.push('Increase fiber intake through vegetables and whole grains');
      recommendations.diet.push('Limit processed foods and sugary beverages');
      recommendations.diet.push('Monitor portion sizes and eat at regular intervals');
    } else if (fastingGlucose && fastingGlucose > 100) {
      recommendations.diet.push('Moderate carbohydrate intake');
      recommendations.diet.push('Include more whole grains and fiber-rich foods');
      recommendations.diet.push('Reduce added sugars in your diet');
    }

    // Diet recommendations based on BMI
    if (prediction.bmi > 30) {
      recommendations.diet.push('Focus on balanced, calorie-controlled meals');
      recommendations.diet.push('Include lean proteins and plenty of vegetables');
    } else if (prediction.bmi > 25) {
      recommendations.diet.push('Maintain a balanced diet with portion control');
      recommendations.diet.push('Include variety of nutritious foods');
    }

    // Exercise recommendations
    if ((fastingGlucose && fastingGlucose > 126) || prediction.bmi > 25) {
      recommendations.exercise.push('Aim for 150 minutes of moderate aerobic activity per week');
      recommendations.exercise.push('Include 2-3 days of resistance training');
      recommendations.exercise.push('Start slowly and gradually increase intensity');
    } else {
      recommendations.exercise.push('Maintain 30 minutes of moderate activity most days');
      recommendations.exercise.push('Include strength training 2-3 times per week');
    }

    // Lifestyle recommendations
    if (prediction.familyHistory) {
      recommendations.lifestyle.push('⚠️ Important: You have family history of diabetes - extra vigilance needed');
    }
    recommendations.lifestyle.push('Maintain consistent sleep schedule (7-9 hours per night)');
    recommendations.lifestyle.push('Manage stress through meditation, yoga, or other relaxation techniques');
    recommendations.lifestyle.push('Limit alcohol consumption');
    recommendations.lifestyle.push('Avoid smoking and secondhand smoke');
    recommendations.lifestyle.push('Monitor your health regularly');

    // Medical recommendations based on risk level
    if (riskPercentage >= 80) {
      recommendations.medical.push('Schedule appointment with healthcare provider immediately');
      recommendations.medical.push('Get comprehensive metabolic panel done');
      recommendations.medical.push('Consider HbA1c test to check average blood glucose');
      recommendations.medical.push('Discuss preventive medications with your doctor');
    } else if (riskPercentage >= 50) {
      recommendations.medical.push('Schedule regular check-ups with your healthcare provider');
      recommendations.medical.push('Get annual screening tests');
      recommendations.medical.push('Consider blood glucose monitoring');
    } else {
      recommendations.medical.push('Maintain regular health check-ups');
      recommendations.medical.push('Annual health screening');
    }

    return recommendations;
  };

  const recommendations = getRecommendations();
  const dailyCalories = prediction.bmi > 25 ? 1800 : 2000;

  // Identify abnormal values for Key Risk Factors
  const getAbnormalFactors = () => {
    const factors = [];
    
    if (fastingGlucose && fastingGlucose > 125) {
      factors.push(`High Fasting Glucose: ${fastingGlucose} mg/dL (Reference: <100 mg/dL)`);
    }
    if (prediction.bmi > 29.9) {
      factors.push(`High BMI: ${Number(prediction.bmi).toFixed(2)} kg/m² (Reference: 18.5-24.9)`);
    }
    if (diastolicBP && diastolicBP > 80) {
      factors.push(`Elevated Diastolic BP: ${diastolicBP} mmHg (Reference: <80 mmHg)`);
    }
    if (prediction.familyHistory) {
      factors.push(`Family History of Diabetes`);
    }
    if (prediction.age && prediction.age > 45) {
      factors.push(`Age: ${prediction.age} years (Risk increases with age)`);
    }

    return factors;
  };

  const abnormalFactors = getAbnormalFactors();

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Health Recommendation</h2>
        <p className="text-gray-600">Personalized insights based on your health assessment</p>
      </div>

      {/* Status Badge */}
      <div className={`p-6 rounded-lg border-l-4 ${riskStatus.bg} ${riskStatus.border}`}>
        <h3 className={`font-bold text-xl ${riskStatus.color}`}>
          {riskStatus.label}
        </h3>
        <p className="text-gray-700 mt-2">
          {riskPercentage >= 80 && 'Your assessment indicates a high risk of diabetes. Immediate lifestyle changes and medical consultation are highly recommended.'}
          {riskPercentage >= 50 && riskPercentage < 80 && 'You have a moderate risk of diabetes. Focus on lifestyle modifications and regular monitoring.'}
          {riskPercentage < 50 && 'Your risk is currently low. Continue with healthy habits and regular check-ups.'}
        </p>
        <p className="text-sm text-gray-600 mt-3">Risk Probability: <span className="font-bold">{riskPercentage}%</span></p>
      </div>

      {/* Health Summary */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-2xl">📋</span> Health Summary
        </h3>
        <div className="space-y-2 text-gray-700">
          <p>
            <strong>BMI Status:</strong> {prediction.bmi <= 18.4 ? 'Underweight' : prediction.bmi <= 24.9 ? 'Normal' : prediction.bmi <= 29.9 ? 'Overweight' : 'Obese'}
          </p>
          <p>
            <strong>Glucose Level:</strong> {fastingGlucose ? (fastingGlucose > 125 ? 'High' : fastingGlucose > 99 ? 'Prediabetic range' : 'Normal') : 'Not specified'}
          </p>
          <p>
            <strong>Blood Pressure:</strong> {diastolicBP ? (diastolicBP > 80 ? 'Elevated' : 'Normal') : 'Not specified'}
          </p>
        </div>
      </div>

      {/* Key Risk Factors */}
      {abnormalFactors.length > 0 && (
        <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">⚠️</span> Key Risk Factors
          </h3>
          <div className="space-y-2">
            {abnormalFactors.map((factor, idx) => (
              <p key={idx} className="text-gray-700 text-sm flex items-start gap-2">
                <span className="text-orange-600 font-bold mt-0.5">•</span>
                <span>{factor}</span>
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Daily Calorie Target */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-2">Daily Calorie Target</h3>
        <p className="text-3xl font-bold text-blue-600">{dailyCalories} calories/day</p>
        <p className="text-sm text-gray-600 mt-2">
          Adjust based on your activity level and consult with a nutritionist for personalized recommendations.
        </p>
      </div>

      {/* Diet Recommendations */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-2xl">🍎</span> Diet Recommendations
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {recommendations.diet.map((rec, idx) => (
            <div key={idx} className="bg-green-50 p-3 rounded-lg border-l-4 border-green-600">
              <p className="text-gray-700 text-sm">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Exercise Recommendations */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-2xl">💪</span> Exercise Plan
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {recommendations.exercise.map((rec, idx) => (
            <div key={idx} className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-600">
              <p className="text-gray-700 text-sm">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lifestyle Recommendations */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-2xl">🌟</span> Lifestyle Tips
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {recommendations.lifestyle.map((rec, idx) => (
            <div key={idx} className="bg-purple-50 p-3 rounded-lg border-l-4 border-purple-600">
              <p className="text-gray-700 text-sm">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Medical Recommendations */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-2xl">🏥</span> Medical Actions
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {recommendations.medical.map((rec, idx) => (
            <div key={idx} className={`p-3 rounded-lg border-l-4 ${
              riskPercentage >= 80 ? 'bg-red-50 border-red-600' :
              riskPercentage >= 50 ? 'bg-yellow-50 border-yellow-600' :
              'bg-green-50 border-green-600'
            }`}>
              <p className="text-gray-700 text-sm">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Plan Section */}
      <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-2xl">📅</span> Action Plan Summary
        </h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>Week 1:</strong> Start with dietary changes - reduce sugary foods and increase fiber intake</p>
          <p><strong>Week 2-3:</strong> Begin an exercise routine - start with 20-30 minutes of walking daily</p>
          <p><strong>Week 4+:</strong> Schedule doctor appointment, monitor progress, and adjust plan as needed</p>
        </div>
      </div>

      {/* Motivational Insight */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-2xl">💚</span> Motivational Insight
        </h3>
        <p className="text-gray-700 mb-3">
          {riskPercentage >= 80 && 'You\'re taking an important step towards better health by getting assessed. Small changes made today can lead to significant improvements. Remember, managing your health is a journey, not a destination.'}
          {riskPercentage >= 50 && riskPercentage < 80 && 'The fact that you\'re reviewing these recommendations shows you care about your health. With consistent effort and lifestyle modifications, you can reduce your risk significantly.'}
          {riskPercentage < 50 && 'Great job maintaining good health! Continue your healthy habits and regular check-ups to keep these positive results going.'}
        </p>
        <p className="text-sm text-gray-600 font-semibold">
          "Your body is unique. These recommendations are personalized guidance - work with your healthcare provider to adapt them to your needs."
        </p>
      </div>

      {/* Important Disclaimer */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
        <p className="text-xs text-gray-600">
          <strong>Disclaimer:</strong> These recommendations are based on the data you provided and are for informational purposes only. 
          Please consult with qualified healthcare professionals before making any significant changes to your diet or exercise routine. 
          This assessment is not a substitute for professional medical advice.
        </p>
      </div>
    </div>
  );
};

export default HealthRecommendations;
