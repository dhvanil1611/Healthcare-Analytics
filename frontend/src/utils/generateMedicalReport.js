import jsPDF from 'jspdf';

export const generateMedicalReport = (prediction, userName = 'Patient') => {
  const doc = new jsPDF();
  
  // Set font sizes and styles
  const titleSize = 20;
  const headerSize = 14;
  const normalSize = 12;
  const smallSize = 10;
  
  let yPosition = 20;
  
  // Helper function to add new lines
  const addLine = (lines = 1) => {
    yPosition += lines * 7;
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
  };
  
  // Header Section
  doc.setFontSize(titleSize);
  doc.setFont('helvetica', 'bold');
  doc.text('AI DIABETES RISK ASSESSMENT REPORT', 105, yPosition, { align: 'center' });
  addLine(2);
  
  // Medical Facility Header
  doc.setFontSize(headerSize);
  doc.text('AI-Powered Diabetes Healthcare System', 105, yPosition, { align: 'center' });
  addLine(1);
  doc.setFontSize(smallSize);
  doc.text('Comprehensive Health Analysis Report', 105, yPosition, { align: 'center' });
  addLine(2);
  
  // PATIENT INFORMATION SECTION
  doc.setFontSize(headerSize);
  doc.setFont('helvetica', 'bold');
  doc.text('PATIENT INFORMATION', 20, yPosition);
  addLine(1);
  
  // Draw line under section header
  doc.setLineWidth(0.5);
  doc.line(20, yPosition, 190, yPosition);
  addLine(1);
  
  doc.setFontSize(normalSize);
  doc.setFont('helvetica', 'normal');
  
  // Patient details in two columns
  const patientData = [
    ['Patient Name:', prediction.patientName || userName],
    ['Report Date:', new Date().toLocaleDateString()],
    ['Assessment Date:', new Date(prediction.createdAt).toLocaleDateString()],
    ['Patient ID:', `PAT-${Date.now().toString().slice(-6)}`],
    ['Age:', `${prediction.age} years`],
    ['Gender:', prediction.gender || 'Not Specified']
  ];
  
  // Add pregnancies if female
  if (prediction.gender === 'Female' && prediction.pregnancies !== null) {
    patientData.push(['Pregnancies:', `${prediction.pregnancies}`]);
  }
  
  patientData.forEach(([label, value], index) => {
    const x = index % 2 === 0 ? 20 : 110;
    const y = index % 2 === 0 ? yPosition : yPosition;
    
    if (index % 2 === 0) {
      doc.setFont('helvetica', 'bold');
      doc.text(label, x, y);
      doc.setFont('helvetica', 'normal');
      doc.text(value, x + 35, y);
    } else {
      doc.setFont('helvetica', 'bold');
      doc.text(label, x, y);
      doc.setFont('helvetica', 'normal');
      doc.text(value, x + 35, y);
      addLine(1);
    }
  });
  addLine(2);
  
  // ASSESSMENT RESULTS SECTION
  doc.setFontSize(headerSize);
  doc.setFont('helvetica', 'bold');
  doc.text('ASSESSMENT RESULTS', 20, yPosition);
  addLine(1);
  
  doc.setLineWidth(0.5);
  doc.line(20, yPosition, 190, yPosition);
  addLine(1);
  
  // Risk Level with color coding
  doc.setFontSize(normalSize);
  const riskColor = prediction.riskLevel === 'High' ? [220, 53, 69] : 
                    prediction.riskLevel === 'Moderate' ? [245, 158, 11] : 
                    [34, 197, 94];
  
  doc.setTextColor(...riskColor);
  doc.setFont('helvetica', 'bold');
  doc.text(`Risk Level: ${prediction.riskLevel}`, 20, yPosition);
  doc.setTextColor(0, 0, 0);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Risk Probability: ${((typeof prediction.probability === 'string' ? parseFloat(prediction.probability) : prediction.probability) * 100).toFixed(1)}%`, 120, yPosition);
  if (prediction.riskScore !== undefined) {
    addLine(1);
    doc.text(`Risk Score: ${prediction.riskScore}`, 20, yPosition);
  }
  addLine(2);
  
  // MEDICAL MEASUREMENTS SECTION
  doc.setFontSize(headerSize);
  doc.setFont('helvetica', 'bold');
  doc.text('MEDICAL MEASUREMENTS', 20, yPosition);
  addLine(1);
  
  doc.setLineWidth(0.5);
  doc.line(20, yPosition, 190, yPosition);
  addLine(1);
  
  // Medical test results in table format
  const measurements = [];
  
  // Add new fields
  measurements.push(['Fasting Blood Glucose', `${prediction.fastingGlucose || prediction.fastingBloodGlucose} mg/dL`, '70-100 mg/dL']);
  
  // Blood pressure (new format)
  if (prediction.systolicBP && prediction.diastolicBP) {
    measurements.push(['Blood Pressure', `${prediction.systolicBP}/${prediction.diastolicBP} mmHg`, '<120/80 mmHg']);
  } else {
    measurements.push(['Diastolic Blood Pressure', `${prediction.diastolicBP || prediction.diastolicBloodPressure} mmHg`, '<80 mmHg']);
  }
  
  measurements.push(['Body Mass Index (BMI)', `${Number(prediction.bmi).toFixed(2)} kg/m²`, '18.5-24.9 kg/m²']);
  
  // Add HbA1c if available
  if (prediction.hba1c) {
    measurements.push(['HbA1c', `${prediction.hba1c}%`, '<5.7%']);
  }
  
  // Legacy fields
  if (prediction.serumInsulin) {
    measurements.push(['Serum Insulin (2-hour)', `${prediction.serumInsulin} µU/mL`, '16-166 µU/mL']);
  }
  if (prediction.skinFoldThickness) {
    measurements.push(['Skinfold Thickness', `${prediction.skinFoldThickness} mm`, 'Varies by age/gender']);
  }
  
  measurements.push(['Family History', prediction.familyHistory ? 'Positive' : 'Negative', 'Risk factor']);
  
  // Table headers
  doc.setFont('helvetica', 'bold');
  doc.text('Parameter', 20, yPosition);
  doc.text('Result', 80, yPosition);
  doc.text('Reference Range', 130, yPosition);
  addLine(1);
  
  // Table data
  doc.setFont('helvetica', 'normal');
  measurements.forEach(([param, result, reference]) => {
    // Check if result is outside reference range
    let isAbnormal = false;
    if (param === 'Fasting Blood Glucose' && parseFloat(result) > 100) isAbnormal = true;
    if (param === 'Body Mass Index (BMI)' && parseFloat(result) > 24.9) isAbnormal = true;
    if (param === 'Blood Pressure' && (parseFloat(result.split('/')[0]) > 120 || parseFloat(result.split('/')[1]) > 80)) isAbnormal = true;
    if (param === 'Diastolic Blood Pressure' && parseFloat(result) >= 80) isAbnormal = true;
    if (param === 'HbA1c' && parseFloat(result) > 5.7) isAbnormal = true;
    
    if (isAbnormal) {
      doc.setTextColor(220, 53, 69);
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
    }
    
    doc.text(param, 20, yPosition);
    doc.text(result, 80, yPosition);
    doc.text(reference, 130, yPosition);
    addLine(1);
  });
  
  doc.setTextColor(0, 0, 0);
  addLine(2);
  
  // LIFESTYLE FACTORS SECTION
  doc.setFontSize(headerSize);
  doc.setFont('helvetica', 'bold');
  doc.text('LIFESTYLE FACTORS', 20, yPosition);
  addLine(1);
  
  doc.setLineWidth(0.5);
  doc.line(20, yPosition, 190, yPosition);
  addLine(1);
  
  doc.setFontSize(normalSize);
  doc.setFont('helvetica', 'normal');
  
  const lifestyleData = [
    ['Physical Activity:', prediction.physicalActivity || 'Not specified'],
    ['Smoking:', prediction.smoking !== undefined ? (prediction.smoking ? 'Yes' : 'No') : 'Not specified'],
    ['Alcohol Consumption:', prediction.alcohol !== undefined ? (prediction.alcohol ? 'Yes' : 'No') : 'Not specified']
  ];
  
  lifestyleData.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 20, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 80, yPosition);
    addLine(1);
  });
  addLine(2);
  
  // SYMPTOMS SECTION
  doc.setFontSize(headerSize);
  doc.setFont('helvetica', 'bold');
  doc.text('SYMPTOMS', 20, yPosition);
  addLine(1);
  
  doc.setLineWidth(0.5);
  doc.line(20, yPosition, 190, yPosition);
  addLine(1);
  
  doc.setFontSize(normalSize);
  doc.setFont('helvetica', 'normal');
  
  const symptomsData = [
    ['Excessive Thirst:', prediction.excessiveThirst !== undefined ? (prediction.excessiveThirst ? 'Yes' : 'No') : 'Not specified'],
    ['Frequent Urination:', prediction.frequentUrination !== undefined ? (prediction.frequentUrination ? 'Yes' : 'No') : 'Not specified'],
    ['Sudden Weight Loss:', prediction.suddenWeightLoss !== undefined ? (prediction.suddenWeightLoss ? 'Yes' : 'No') : 'Not specified']
  ];
  
  symptomsData.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 20, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 80, yPosition);
    addLine(1);
  });
  addLine(2);
  
  // RISK ASSESSMENT SUMMARY
  doc.setFontSize(headerSize);
  doc.setFont('helvetica', 'bold');
  doc.text('RISK ASSESSMENT SUMMARY', 20, yPosition);
  addLine(1);
  
  doc.setLineWidth(0.5);
  doc.line(20, yPosition, 190, yPosition);
  addLine(1);
  
  doc.setFontSize(normalSize);
  doc.setFont('helvetica', 'normal');
  
  const riskSummary = getRiskSummary(prediction.riskLevel);
  const lines = doc.splitTextToSize(riskSummary, 170);
  lines.forEach(line => {
    doc.text(line, 20, yPosition);
    addLine(1);
  });
  addLine(1);
  
  // MEDICAL RECOMMENDATIONS SECTION
  doc.setFontSize(headerSize);
  doc.setFont('helvetica', 'bold');
  doc.text('MEDICAL RECOMMENDATIONS', 20, yPosition);
  addLine(1);
  
  doc.setLineWidth(0.5);
  doc.line(20, yPosition, 190, yPosition);
  addLine(1);
  
  doc.setFontSize(normalSize);
  doc.setFont('helvetica', 'normal');
  
  const recommendations = getRecommendations(prediction);
  recommendations.forEach((rec, index) => {
    doc.text(`${index + 1}. ${rec}`, 20, yPosition);
    addLine(1);
  });
  addLine(2);
  
  // FOOTER SECTION
  doc.setFontSize(smallSize);
  doc.setFont('helvetica', 'italic');
  doc.text('This report was generated by an AI-powered diabetes risk assessment system.', 20, yPosition);
  addLine(1);
  doc.text('Please consult with a qualified healthcare professional for medical advice and treatment.', 20, yPosition);
  addLine(1);
  doc.text('This assessment is for informational purposes only and should not replace professional medical consultation.', 20, yPosition);
  addLine(2);
  
  // Signature lines
  doc.setFontSize(normalSize);
  doc.setFont('helvetica', 'normal');
  doc.text('Generated by: AI Diabetes Assessment System', 20, yPosition);
  doc.text('Page 1 of 1', 170, yPosition);
  
  // Save the PDF
  const fileName = `Diabetes_Assessment_Report_${prediction.patientName || userName}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
  
  return fileName;
};

function getRiskSummary(riskLevel) {
  switch (riskLevel) {
    case 'High':
      return 'The patient shows HIGH risk for developing diabetes. Immediate medical consultation is recommended. The clinical parameters indicate significant metabolic abnormalities that require prompt medical attention and lifestyle intervention.';
    case 'Moderate':
      return 'The patient shows MODERATE risk for developing diabetes. Regular monitoring and lifestyle modifications are recommended. Preventive measures should be implemented to reduce the progression risk.';
    case 'Low':
      return 'The patient shows LOW risk for developing diabetes. Current parameters are within acceptable ranges. Continue maintaining healthy lifestyle habits and regular health check-ups.';
    default:
      return 'Assessment completed. Please review the detailed results above.';
  }
}

function getRecommendations(prediction) {
  const baseRecommendations = [
    'Schedule regular follow-up appointments with your healthcare provider',
    'Maintain a healthy diet rich in vegetables, fruits, and whole grains',
    'Engage in regular physical activity (150 minutes per week recommended)',
    'Monitor blood sugar levels as directed by your healthcare provider'
  ];
  
  const riskSpecific = {
    'High': [
      'Immediate consultation with an endocrinologist or diabetes specialist',
      'Implement strict dietary modifications under medical supervision',
      'Consider medication therapy as prescribed by healthcare provider',
      'Daily blood glucose monitoring recommended',
      'Weight management program strongly recommended'
    ],
    'Moderate': [
      'Consult with healthcare provider within 4-6 weeks',
      'Implement dietary changes focusing on carbohydrate control',
      'Increase physical activity gradually',
      'Weekly blood glucose monitoring recommended',
      'Consider nutritionist consultation'
    ],
    'Low': [
      'Annual health check-ups recommended',
      'Continue current healthy lifestyle practices',
      'Periodic screening every 2-3 years',
      'Maintain healthy weight and physical activity levels'
    ]
  };
  
  return [...baseRecommendations, ...(riskSpecific[prediction.riskLevel] || riskSpecific['Low'])];
}
