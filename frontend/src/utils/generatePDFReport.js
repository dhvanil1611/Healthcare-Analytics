import html2pdf from 'html2pdf.js';

export const generatePDFReport = async (prediction) => {
  if (!prediction) {
    console.error('No prediction data available');
    return;
  }

  // Helper function to get display values
  const getDisplayValue = (prediction, ...fields) => {
    for (const field of fields) {
      if (prediction[field] !== undefined && prediction[field] !== null && prediction[field] !== '') {
        return prediction[field];
      }
    }
    return 'Not available';
  };

  // Get risk status
  const probability = typeof prediction.probability === 'string' ? parseFloat(prediction.probability) : prediction.probability;
  const riskPercentage = probability ? (probability * 100).toFixed(1) : 0;
  
  const getRiskStatus = () => {
    if (riskPercentage >= 80) {
      return { label: 'High Risk ⚠️', description: 'Your risk level is HIGH' };
    } else if (riskPercentage >= 50) {
      return { label: 'Moderate Risk ⚡', description: 'Your risk level is MODERATE' };
    } else {
      return { label: 'Great Health ✅', description: 'Your health is in GREAT condition' };
    }
  };

  const riskStatus = getRiskStatus();

  // Get recommendations
  const fastingGlucose = getDisplayValue(prediction, 'fastingGlucose', 'fastingBloodGlucose');
  const diastolicBP = getDisplayValue(prediction, 'diastolicBP', 'diastolicBloodPressure');

  const getRecommendations = () => {
    const recommendations = {
      diet: [],
      exercise: [],
      lifestyle: [],
      medical: []
    };

    if (fastingGlucose && fastingGlucose !== 'Not available' && fastingGlucose > 126) {
      recommendations.diet.push('Reduce carbohydrate intake, especially simple sugars');
      recommendations.diet.push('Increase fiber intake through vegetables and whole grains');
      recommendations.diet.push('Limit processed foods and sugary beverages');
      recommendations.diet.push('Monitor portion sizes and eat at regular intervals');
    } else if (fastingGlucose && fastingGlucose !== 'Not available' && fastingGlucose > 100) {
      recommendations.diet.push('Moderate carbohydrate intake');
      recommendations.diet.push('Include more whole grains and fiber-rich foods');
      recommendations.diet.push('Reduce added sugars in your diet');
    }

    if (prediction.bmi > 30) {
      recommendations.diet.push('Focus on balanced, calorie-controlled meals');
      recommendations.diet.push('Include lean proteins and plenty of vegetables');
    } else if (prediction.bmi > 25) {
      recommendations.diet.push('Maintain a balanced diet with portion control');
      recommendations.diet.push('Include variety of nutritious foods');
    }

    if ((fastingGlucose && fastingGlucose !== 'Not available' && fastingGlucose > 126) || prediction.bmi > 25) {
      recommendations.exercise.push('Aim for 150 minutes of moderate aerobic activity per week');
      recommendations.exercise.push('Include 2-3 days of resistance training');
      recommendations.exercise.push('Start slowly and gradually increase intensity');
    } else {
      recommendations.exercise.push('Maintain 30 minutes of moderate activity most days');
      recommendations.exercise.push('Include strength training 2-3 times per week');
    }

    if (prediction.familyHistory) {
      recommendations.lifestyle.push('⚠️ Important: You have family history of diabetes - extra vigilance needed');
    }
    recommendations.lifestyle.push('Maintain consistent sleep schedule (7-9 hours per night)');
    recommendations.lifestyle.push('Manage stress through meditation, yoga, or other relaxation techniques');
    recommendations.lifestyle.push('Limit alcohol consumption');
    recommendations.lifestyle.push('Avoid smoking and secondhand smoke');
    recommendations.lifestyle.push('Monitor your health regularly');

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

  // Get abnormal factors
  const getAbnormalFactors = () => {
    const factors = [];
    if (fastingGlucose && fastingGlucose !== 'Not available' && fastingGlucose > 125) {
      factors.push(`High Fasting Blood Glucose: ${fastingGlucose} mg/dL (normal: <100)`);
    }
    if (prediction.bmi > 25) {
      factors.push(`Elevated BMI: ${Number(prediction.bmi).toFixed(2)} kg/m² (normal: 18.5-24.9)`);
    }
    if (diastolicBP && diastolicBP !== 'Not available' && diastolicBP > 80) {
      factors.push(`High Blood Pressure: ${diastolicBP} mmHg (normal: <80)`);
    }
    if (prediction.familyHistory) {
      factors.push('Family History of Diabetes');
    }
    return factors;
  };

  const abnormalFactors = getAbnormalFactors();

  // Create HTML for PDF
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 40px;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #2563eb; padding-bottom: 20px;">
        <h1 style="color: #2563eb; margin: 0; font-size: 28px;">HealthCare Assessment</h1>
        <h2 style="color: #666; margin: 10px 0 0 0; font-size: 20px;">Health Assessment Report</h2>
        <p style="color: #999; margin: 10px 0 0 0; font-size: 12px;">Generated on ${new Date().toLocaleString()}</p>
      </div>

      <!-- Risk Status Overview -->
      <div style="background-color: #f0f9ff; border-left: 4px solid #2563eb; padding: 20px; margin-bottom: 30px; page-break-inside: avoid;">
        <h3 style="color: #2563eb; margin-top: 0;">Risk Assessment Overview</h3>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Status:</strong> ${riskStatus.label}</p>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Risk Probability:</strong> ${riskPercentage}%</p>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Assessment Date:</strong> ${new Date(prediction.createdAt).toLocaleDateString()}</p>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 48px; font-weight: bold; color: ${riskPercentage >= 80 ? '#dc2626' : riskPercentage >= 50 ? '#ca8a04' : '#16a34a'};">
              ${riskPercentage}%
            </div>
            <p style="margin: 5px 0; font-size: 12px; color: #666;">Risk Level</p>
          </div>
        </div>
      </div>

      <!-- Section 1: Health Metrics -->
      <div style="page-break-inside: avoid; margin-bottom: 30px;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-bottom: 20px;">1. Health Metrics</h2>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px;">
            <p style="margin: 0 0 5px 0; color: #666; font-size: 13px;"><strong>Fasting Blood Glucose</strong></p>
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #333;">${fastingGlucose} ${fastingGlucose !== 'Not available' ? 'mg/dL' : ''}</p>
            <p style="margin: 5px 0 0 0; color: #999; font-size: 11px;">Reference: 70-100 mg/dL (fasting)</p>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px;">
            <p style="margin: 0 0 5px 0; color: #666; font-size: 13px;"><strong>Body Mass Index (BMI)</strong></p>
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #333;">${Number(prediction.bmi).toFixed(2)} kg/m²</p>
            <p style="margin: 5px 0 0 0; color: #999; font-size: 11px;">Reference: 18.5-24.9 (Normal)</p>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px;">
            <p style="margin: 0 0 5px 0; color: #666; font-size: 13px;"><strong>Blood Pressure (Diastolic)</strong></p>
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #333;">${diastolicBP} ${diastolicBP !== 'Not available' ? 'mmHg' : ''}</p>
            <p style="margin: 5px 0 0 0; color: #999; font-size: 11px;">Reference: &lt;80 mmHg</p>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px;">
            <p style="margin: 0 0 5px 0; color: #666; font-size: 13px;"><strong>Age</strong></p>
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #333;">${prediction.age} years</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px;">
            <p style="margin: 0 0 5px 0; color: #666; font-size: 13px;"><strong>Gender</strong></p>
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #333;">${prediction.gender || 'Not specified'}</p>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px;">
            <p style="margin: 0 0 5px 0; color: #666; font-size: 13px;"><strong>Family History</strong></p>
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #333;">${prediction.familyHistory ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>

      <!-- Section 2: Key Risk Factors -->
      ${abnormalFactors.length > 0 ? `
      <div style="page-break-inside: avoid; margin-bottom: 30px;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-bottom: 20px;">2. Key Risk Factors</h2>
        <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; border-radius: 5px;">
          <ul style="margin: 0; padding-left: 20px;">
            ${abnormalFactors.map(factor => `<li style="margin: 8px 0; color: #333;">${factor}</li>`).join('')}
          </ul>
        </div>
      </div>
      ` : ''}

      <!-- Section 3: Recommendations & Action Plan -->
      <div style="page-break-inside: avoid; margin-bottom: 30px;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-bottom: 20px;">3. Personalized Recommendations</h2>
        
        ${recommendations.diet.length > 0 ? `
        <div style="margin-bottom: 20px;">
          <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 15px;">Diet Suggestions</h3>
          <ul style="margin: 0; padding-left: 20px;">
            ${recommendations.diet.map(rec => `<li style="margin: 8px 0; color: #333; font-size: 14px;">${rec}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
        
        ${recommendations.exercise.length > 0 ? `
        <div style="margin-bottom: 20px;">
          <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 15px;">Exercise Plan</h3>
          <ul style="margin: 0; padding-left: 20px;">
            ${recommendations.exercise.map(rec => `<li style="margin: 8px 0; color: #333; font-size: 14px;">${rec}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
        
        ${recommendations.lifestyle.length > 0 ? `
        <div style="margin-bottom: 20px;">
          <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 15px;">Lifestyle Changes</h3>
          <ul style="margin: 0; padding-left: 20px;">
            ${recommendations.lifestyle.map(rec => `<li style="margin: 8px 0; color: #333; font-size: 14px;">${rec}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
      </div>

      <!-- Section 4: Medical Advice -->
      <div style="page-break-inside: avoid; margin-bottom: 30px;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-bottom: 20px;">4. Medical Advice</h2>
        <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 5px;">
          <ul style="margin: 0; padding-left: 20px;">
            ${recommendations.medical.map(rec => `<li style="margin: 8px 0; color: #333; font-size: 14px;">${rec}</li>`).join('')}
          </ul>
        </div>
      </div>

      <!-- Summary -->
      <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 20px; border-radius: 5px; page-break-inside: avoid;">
        <h3 style="color: #16a34a; margin-top: 0;">Summary & Next Steps</h3>
        <p style="margin: 10px 0; font-size: 14px;">
          ${riskPercentage >= 80 
            ? 'Your assessment indicates a HIGH risk for diabetes. We strongly recommend consulting with a healthcare provider as soon as possible for a comprehensive evaluation and personalized treatment plan.'
            : riskPercentage >= 50
            ? 'Your assessment indicates a MODERATE risk for diabetes. Please consider scheduling an appointment with your healthcare provider to discuss prevention strategies and regular monitoring.'
            : 'Your assessment indicates a LOW risk for diabetes. Continue maintaining a healthy lifestyle with regular exercise, balanced diet, and periodic health check-ups.'
          }
        </p>
      </div>

      <!-- Footer -->
      <div style="border-top: 2px solid #e5e7eb; margin-top: 40px; padding-top: 20px; text-align: center; color: #999; font-size: 12px; page-break-inside: avoid;">
        <p style="margin: 0;">This is an AI-generated health report based on your assessment data.</p>
        <p style="margin: 5px 0 0 0;">Please consult with a qualified healthcare provider for medical advice.</p>
        <p style="margin: 5px 0 0 0;">© ${new Date().getFullYear()} HealthCare Assessment System</p>
      </div>
    </div>
  `;

  // PDF Options
  const options = {
    margin: 10,
    filename: `Health_Assessment_Report_${new Date().toISOString().split('T')[0]}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  // Generate PDF
  try {
    await html2pdf().set(options).from(htmlContent).save();
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};
