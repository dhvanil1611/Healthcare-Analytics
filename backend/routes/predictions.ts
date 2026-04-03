import express from 'express';
import { AppDataSource } from '../src/data-source';
import { Prediction } from '../src/entities/Prediction';
import auth from '../middleware/auth';

const router = express.Router();

// Enhanced risk calculation with machine learning-inspired scoring
const calculateRisk = (data: any) => {
  const {
    systolicBP,
    diastolicBP,
    bmi,
    hba1c,
    fastingGlucose,
    age,
    gender,
    pregnancies,
    familyHistory,
    physicalActivity,
    smoking,
    alcohol,
    excessiveThirst,
    frequentUrination,
    suddenWeightLoss,
    // Legacy fields for backward compatibility
    diastolicBloodPressure,
    serumInsulin
  } = data;
  
  let riskScore = 0;
  let riskLevel = 'Low';
  let probability = 0;
  const riskFactors = [];

  // Use new fields if available, fallback to legacy fields
  const diastolic = diastolicBP || diastolicBloodPressure;

  // Enhanced fasting glucose scoring (important factor)
  if (fastingGlucose) {
    if (fastingGlucose >= 126) {
      riskScore += 5;
      riskFactors.push('High fasting glucose (≥126 mg/dL)');
    } else if (fastingGlucose >= 100) {
      riskScore += 3;
      riskFactors.push('Elevated fasting glucose (100-125 mg/dL)');
    } else if (fastingGlucose >= 90) {
      riskScore += 1;
      riskFactors.push('Borderline fasting glucose (90-99 mg/dL)');
    }
  }

  // Enhanced HbA1c scoring (most important factor)
  if (hba1c) {
    if (hba1c > 6.5) {
      riskScore += 5;
      riskFactors.push('High HbA1c (>6.5%)');
    } else if (hba1c > 5.7) {
      riskScore += 3;
      riskFactors.push('Elevated HbA1c (5.7-6.5%)');
    } else if (hba1c > 5.4) {
      riskScore += 1;
      riskFactors.push('Borderline HbA1c (5.4-5.7%)');
    }
  }

  // Enhanced BMI scoring with gender-specific considerations
  if (bmi) {
    if (gender === 'Female') {
      if (bmi > 32) {
        riskScore += 4;
        riskFactors.push('High BMI (>32) for female');
      } else if (bmi > 28) {
        riskScore += 2;
        riskFactors.push('Elevated BMI (28-32) for female');
      } else if (bmi > 24) {
        riskScore += 1;
        riskFactors.push('Borderline BMI (24-28) for female');
      }
    } else {
      if (bmi > 30) {
        riskScore += 4;
        riskFactors.push('High BMI (>30) for male');
      } else if (bmi > 25) {
        riskScore += 2;
        riskFactors.push('Elevated BMI (25-30) for male');
      } else if (bmi > 23) {
        riskScore += 1;
        riskFactors.push('Borderline BMI (23-25) for male');
      }
    }
  }

  // Enhanced blood pressure scoring
  if (systolicBP && diastolic) {
    const hypertensionStage = systolicBP > 140 || diastolic > 90 ? 2 : 
                             systolicBP > 130 || diastolic > 80 ? 1 : 0;
    
    if (hypertensionStage === 2) {
      riskScore += 3;
      riskFactors.push('Hypertension Stage 2');
    } else if (hypertensionStage === 1) {
      riskScore += 2;
      riskFactors.push('Hypertension Stage 1');
    } else if (systolicBP > 120 || diastolic > 80) {
      riskScore += 1;
      riskFactors.push('Elevated blood pressure');
    }
  } else if (diastolic) {
    if (diastolic > 90) {
      riskScore += 2;
      riskFactors.push('High diastolic pressure');
    } else if (diastolic > 80) {
      riskScore += 1;
      riskFactors.push('Elevated diastolic pressure');
    }
  }

  // Enhanced age scoring with age brackets
  if (age) {
    if (age > 75) {
      riskScore += 4;
      riskFactors.push('Age > 75 years');
    } else if (age > 65) {
      riskScore += 3;
      riskFactors.push('Age 65-75 years');
    } else if (age > 55) {
      riskScore += 2;
      riskFactors.push('Age 55-65 years');
    } else if (age > 45) {
      riskScore += 1;
      riskFactors.push('Age 45-55 years');
    }
  }

  // Family history with relationship weight
  if (familyHistory) {
    riskScore += 3;
    riskFactors.push('Family history of diabetes');
  }

  // Enhanced physical activity scoring
  if (physicalActivity) {
    if (physicalActivity === 'No Activity') {
      riskScore += 3;
      riskFactors.push('Sedentary lifestyle');
    } else if (physicalActivity === 'Little Activity') {
      riskScore += 2;
      riskFactors.push('Low physical activity');
    } else if (physicalActivity === 'Moderate Activity') {
      riskScore += 1;
      riskFactors.push('Moderate physical activity');
    }
    // High activity reduces risk (no points added)
  }

  // Enhanced lifestyle factors
  if (smoking) {
    riskScore += 2;
    riskFactors.push('Smoking');
  }
  if (alcohol) {
    riskScore += 1;
    riskFactors.push('Alcohol consumption');
  }

  // Enhanced symptom scoring with weighted importance
  if (suddenWeightLoss) {
    riskScore += 3;
    riskFactors.push('Sudden weight loss');
  }
  if (excessiveThirst) {
    riskScore += 2;
    riskFactors.push('Excessive thirst');
  }
  if (frequentUrination) {
    riskScore += 2;
    riskFactors.push('Frequent urination');
  }

  // Gender-specific risk factors
  if (gender === 'Female' && pregnancies) {
    if (pregnancies > 4) {
      riskScore += 2;
      riskFactors.push('High number of pregnancies (>4)');
    } else if (pregnancies > 2) {
      riskScore += 1;
      riskFactors.push('Multiple pregnancies (3-4)');
    }
  }

  // Legacy serum insulin scoring (if available)
  if (serumInsulin) {
    if (serumInsulin > 200) {
      riskScore += 3;
      riskFactors.push('High serum insulin (>200)');
    } else if (serumInsulin > 166) {
      riskScore += 2;
      riskFactors.push('Elevated serum insulin (166-200)');
    } else if (serumInsulin > 100) {
      riskScore += 1;
      riskFactors.push('Borderline serum insulin (100-166)');
    }
  }

  // Enhanced risk level determination with more granular probability calculation
  const maxScore = 25; // Maximum possible risk score
  const normalizedScore = riskScore / maxScore;
  
  if (riskScore >= 15) {
    riskLevel = 'Very High';
    probability = Math.min(0.95, 0.75 + normalizedScore * 0.2);
  } else if (riskScore >= 10) {
    riskLevel = 'High';
    probability = Math.min(0.75, 0.5 + normalizedScore * 0.25);
  } else if (riskScore >= 6) {
    riskLevel = 'Moderate';
    probability = Math.min(0.5, 0.25 + normalizedScore * 0.25);
  } else if (riskScore >= 3) {
    riskLevel = 'Low-Moderate';
    probability = Math.min(0.25, normalizedScore * 0.25);
  } else {
    riskLevel = 'Low';
    probability = Math.min(0.1, normalizedScore * 0.1);
  }

  return { 
    riskLevel, 
    probability: Math.round(probability * 100) / 100, // Round to 2 decimal places
    riskScore,
    riskFactors,
    recommendations: generateRecommendations(riskLevel, riskFactors)
  };
};

// Generate personalized recommendations based on risk factors
const generateRecommendations = (riskLevel: string, riskFactors: string[]) => {
  const recommendations = [];
  
  // Basic recommendations for everyone
  recommendations.push('Maintain a healthy diet rich in vegetables and whole grains');
  recommendations.push('Stay hydrated with water and limit sugary beverages');
  
  // Risk-specific recommendations
  if (riskFactors.includes('High BMI') || riskFactors.includes('Elevated BMI')) {
    recommendations.push('Work with a healthcare provider to achieve a healthy weight');
    recommendations.push('Consider consulting a registered dietitian for personalized nutrition advice');
  }
  
  if (riskFactors.includes('Sedentary lifestyle') || riskFactors.includes('Low physical activity')) {
    recommendations.push('Aim for at least 150 minutes of moderate exercise per week');
    recommendations.push('Start with 10-15 minute walks and gradually increase duration');
  }
  
  if (riskFactors.includes('High HbA1c') || riskFactors.includes('Elevated HbA1c')) {
    recommendations.push('Monitor blood sugar levels regularly as advised by your doctor');
    recommendations.push('Consider diabetes education classes for better management');
  }
  
  if (riskFactors.includes('Hypertension')) {
    recommendations.push('Monitor blood pressure regularly and follow treatment plan');
    recommendations.push('Reduce sodium intake and increase potassium-rich foods');
  }
  
  if (riskFactors.includes('Smoking')) {
    recommendations.push('Seek smoking cessation support and resources');
    recommendations.push('Consider nicotine replacement therapy under medical guidance');
  }
  
  if (riskFactors.includes('Family history of diabetes')) {
    recommendations.push('Inform your healthcare provider about family history');
    recommendations.push('Consider more frequent diabetes screenings');
  }
  
  if (riskFactors.includes('Excessive thirst') || riskFactors.includes('Frequent urination') || riskFactors.includes('Sudden weight loss')) {
    recommendations.push('Schedule an immediate medical consultation for symptom evaluation');
    recommendations.push('Keep a symptom diary to track patterns and severity');
  }
  
  // Risk level specific recommendations
  if (riskLevel === 'Very High' || riskLevel === 'High') {
    recommendations.push('Schedule an immediate comprehensive medical evaluation');
    recommendations.push('Consider consulting with an endocrinologist or diabetes specialist');
    recommendations.push('Implement daily blood glucose monitoring as recommended');
  } else if (riskLevel === 'Moderate') {
    recommendations.push('Schedule a medical check-up within the next 3 months');
    recommendations.push('Implement lifestyle changes gradually with professional guidance');
  }
  
  return recommendations;
};

// Get predictions for user
router.get('/history', auth, async (req: any, res) => {
  try {
    const predictionRepo = AppDataSource.getRepository(Prediction);
    const predictions = await predictionRepo.find({
      where: { userId: req.user.id },
      order: { createdAt: 'DESC' },
    });
    res.json(predictions);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Get prediction by ID
router.get('/:id', auth, async (req: any, res) => {
  try {
    const predictionRepo = AppDataSource.getRepository(Prediction);
    const prediction = await predictionRepo.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!prediction) return res.status(404).json({ message: 'Prediction not found' });
    res.json(prediction);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Create assessment
router.post('/assess', auth, async (req: any, res) => {
  console.log('Incoming assessment request body:', req.body);
  console.log('Fasting glucose from request:', req.body.fastingGlucose, 'Type:', typeof req.body.fastingGlucose);

  const {
    // New fields
    patientName,
    age,
    gender,
    pregnancies,
    systolicBP,
    diastolicBP,
    bmi,
    hba1c,
    fastingGlucose,
    familyHistory,
    physicalActivity,
    smoking,
    alcohol,
    excessiveThirst,
    frequentUrination,
    suddenWeightLoss,
    // Legacy fields for backward compatibility
    diastolicBloodPressure,
    serumInsulin,
    skinFoldThickness
  } = req.body;

  // Validate required fields
  if (!age || age < 1 || age > 120) 
    return res.status(400).json({ message: 'Invalid age' });
  
  if (!bmi || isNaN(bmi) || bmi < 10 || bmi > 60) 
    return res.status(400).json({ message: 'Invalid BMI' });

  if (!fastingGlucose || isNaN(fastingGlucose) || fastingGlucose < 50 || fastingGlucose > 400) 
    return res.status(400).json({ message: 'Invalid fasting blood glucose' });

  // Validate blood pressure (at least one should be provided)
  if (!diastolicBP && !diastolicBloodPressure) 
    return res.status(400).json({ message: 'Blood pressure is required' });

  // Validate blood pressure values if provided
  if (diastolicBP && (isNaN(diastolicBP) || diastolicBP < 40 || diastolicBP > 150)) 
    return res.status(400).json({ message: 'Invalid diastolic blood pressure' });
  
  if (diastolicBloodPressure && (isNaN(diastolicBloodPressure) || diastolicBloodPressure < 40 || diastolicBloodPressure > 150)) 
    return res.status(400).json({ message: 'Invalid diastolic blood pressure' });

  if (systolicBP && (isNaN(systolicBP) || systolicBP < 60 || systolicBP > 250)) 
    return res.status(400).json({ message: 'Invalid systolic blood pressure' });

  // Validate gender-specific fields
  if (gender === 'Female' && (pregnancies !== undefined && (pregnancies < 0 || pregnancies > 10))) {
    return res.status(400).json({ message: 'Invalid number of pregnancies (0-10)' });
  }

  try {
    const { riskLevel, probability, riskScore, riskFactors, recommendations } = calculateRisk({
      patientName,
      age,
      gender,
      pregnancies,
      systolicBP,
      diastolicBP: diastolicBP || diastolicBloodPressure,
      bmi,
      hba1c,
      fastingGlucose,
      familyHistory,
      physicalActivity,
      smoking,
      alcohol,
      excessiveThirst,
      frequentUrination,
      suddenWeightLoss,
      // Legacy fields
      diastolicBloodPressure: diastolicBP || diastolicBloodPressure,
      serumInsulin
    });

    const predictionRepo = AppDataSource.getRepository(Prediction);
    const prediction = predictionRepo.create({
      userId: req.user.id,
      // New fields
      patientName,
      age,
      gender,
      pregnancies: gender === 'Female' ? pregnancies : null,
      systolicBP,
      diastolicBP: diastolicBP || diastolicBloodPressure,
      bmi,
      hba1c,
      fastingGlucose,
      familyHistory,
      physicalActivity,
      smoking,
      alcohol,
      excessiveThirst,
      frequentUrination,
      suddenWeightLoss,
      // Legacy fields (for backward compatibility)
      diastolicBloodPressure: diastolicBP || diastolicBloodPressure,
      serumInsulin,
      skinFoldThickness,
      // Results
      riskLevel,
      probability,
    });

    console.log('Prediction object before save:', prediction);
    console.log('Fasting glucose in prediction object:', prediction.fastingGlucose);

    await predictionRepo.save(prediction);
    console.log('Prediction saved successfully:', prediction);
    
    res.json({ 
      ...prediction, 
      riskScore,
      riskFactors,
      recommendations
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Create prediction (legacy endpoint)
router.post('/', auth, async (req: any, res) => {
  const { diastolicBloodPressure, bmi, serumInsulin, skinFoldThickness, age, familyHistory } = req.body;

  // Validate required fields
  if (!bmi || isNaN(bmi) || bmi < 10 || bmi > 60) 
    return res.status(400).json({ message: 'Invalid BMI' });
  
  if (!age || isNaN(age) || age < 1 || age > 120) 
    return res.status(400).json({ message: 'Invalid age' });

  try {
    const { riskLevel, probability } = calculateRisk({
      diastolicBloodPressure,
      bmi,
      serumInsulin,
      age,
      familyHistory,
    });

    const predictionRepo = AppDataSource.getRepository(Prediction);
    const prediction = predictionRepo.create({
      userId: req.user.id,
      diastolicBloodPressure,
      bmi,
      serumInsulin,
      skinFoldThickness,
      age,
      familyHistory,
      riskLevel,
      probability,
    });

    await predictionRepo.save(prediction);
    res.json(prediction);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
