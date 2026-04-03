from typing import Dict, List, Any

class PredictionService:
    """Service for calculating diabetes risk predictions."""
    
    def calculate_risk(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculate diabetes risk using enhanced scoring algorithm.
        This replicates the logic from the original JavaScript backend.
        """
        # Extract data with fallback to legacy fields
        systolic_bp = data.get('systolic_bp')
        diastolic_bp = data.get('diastolic_bp') or data.get('diastolic_blood_pressure')
        bmi = data.get('bmi')
        hba1c = data.get('hba1c')
        fasting_glucose = data.get('fasting_glucose')
        age = data.get('age')
        gender = data.get('gender')
        pregnancies = data.get('pregnancies')
        family_history = data.get('family_history', False)
        physical_activity = data.get('physical_activity')
        smoking = data.get('smoking', False)
        alcohol = data.get('alcohol', False)
        excessive_thirst = data.get('excessive_thirst', False)
        frequent_urination = data.get('frequent_urination', False)
        sudden_weight_loss = data.get('sudden_weight_loss', False)
        serum_insulin = data.get('serum_insulin')
        
        risk_score = 0
        risk_level = 'Low'
        probability = 0
        risk_factors = []
        
        # Enhanced fasting glucose scoring (important factor)
        if fasting_glucose:
            if fasting_glucose >= 126:
                risk_score += 5
                risk_factors.append('High fasting glucose (≥126 mg/dL)')
            elif fasting_glucose >= 100:
                risk_score += 3
                risk_factors.append('Elevated fasting glucose (100-125 mg/dL)')
            elif fasting_glucose >= 90:
                risk_score += 1
                risk_factors.append('Borderline fasting glucose (90-99 mg/dL)')
        
        # Enhanced HbA1c scoring (most important factor)
        if hba1c:
            if hba1c > 6.5:
                risk_score += 5
                risk_factors.append('High HbA1c (>6.5%)')
            elif hba1c > 5.7:
                risk_score += 3
                risk_factors.append('Elevated HbA1c (5.7-6.5%)')
            elif hba1c > 5.4:
                risk_score += 1
                risk_factors.append('Borderline HbA1c (5.4-5.7%)')
        
        # Enhanced BMI scoring with gender-specific considerations
        if bmi:
            if gender == 'Female':
                if bmi > 32:
                    risk_score += 4
                    risk_factors.append('High BMI (>32) for female')
                elif bmi > 28:
                    risk_score += 2
                    risk_factors.append('Elevated BMI (28-32) for female')
                elif bmi > 24:
                    risk_score += 1
                    risk_factors.append('Borderline BMI (24-28) for female')
            else:
                if bmi > 30:
                    risk_score += 4
                    risk_factors.append('High BMI (>30) for male')
                elif bmi > 25:
                    risk_score += 2
                    risk_factors.append('Elevated BMI (25-30) for male')
                elif bmi > 23:
                    risk_score += 1
                    risk_factors.append('Borderline BMI (23-25) for male')
        
        # Enhanced blood pressure scoring
        if systolic_bp and diastolic_bp:
            hypertension_stage = 2 if (systolic_bp > 140 or diastolic_bp > 90) else \
                                1 if (systolic_bp > 130 or diastolic_bp > 80) else 0
            
            if hypertension_stage == 2:
                risk_score += 3
                risk_factors.append('Hypertension Stage 2')
            elif hypertension_stage == 1:
                risk_score += 2
                risk_factors.append('Hypertension Stage 1')
            elif systolic_bp > 120 or diastolic_bp > 80:
                risk_score += 1
                risk_factors.append('Elevated blood pressure')
        elif diastolic_bp:
            if diastolic_bp > 90:
                risk_score += 2
                risk_factors.append('High diastolic pressure')
            elif diastolic_bp > 80:
                risk_score += 1
                risk_factors.append('Elevated diastolic pressure')
        
        # Enhanced age scoring with age brackets
        if age:
            if age > 75:
                risk_score += 4
                risk_factors.append('Age > 75 years')
            elif age > 65:
                risk_score += 3
                risk_factors.append('Age 65-75 years')
            elif age > 55:
                risk_score += 2
                risk_factors.append('Age 55-65 years')
            elif age > 45:
                risk_score += 1
                risk_factors.append('Age 45-55 years')
        
        # Family history with relationship weight
        if family_history:
            risk_score += 3
            risk_factors.append('Family history of diabetes')
        
        # Enhanced physical activity scoring
        if physical_activity:
            if physical_activity == 'No Activity':
                risk_score += 3
                risk_factors.append('Sedentary lifestyle')
            elif physical_activity == 'Little Activity':
                risk_score += 2
                risk_factors.append('Low physical activity')
            elif physical_activity == 'Moderate Activity':
                risk_score += 1
                risk_factors.append('Moderate physical activity')
            # High activity reduces risk (no points added)
        
        # Enhanced lifestyle factors
        if smoking:
            risk_score += 2
            risk_factors.append('Smoking')
        if alcohol:
            risk_score += 1
            risk_factors.append('Alcohol consumption')
        
        # Enhanced symptom scoring with weighted importance
        if sudden_weight_loss:
            risk_score += 3
            risk_factors.append('Sudden weight loss')
        if excessive_thirst:
            risk_score += 2
            risk_factors.append('Excessive thirst')
        if frequent_urination:
            risk_score += 2
            risk_factors.append('Frequent urination')
        
        # Gender-specific risk factors
        if gender == 'Female' and pregnancies:
            if pregnancies > 4:
                risk_score += 2
                risk_factors.append('High number of pregnancies (>4)')
            elif pregnancies > 2:
                risk_score += 1
                risk_factors.append('Multiple pregnancies (3-4)')
        
        # Legacy serum insulin scoring (if available)
        if serum_insulin:
            if serum_insulin > 200:
                risk_score += 3
                risk_factors.append('High serum insulin (>200)')
            elif serum_insulin > 166:
                risk_score += 2
                risk_factors.append('Elevated serum insulin (166-200)')
            elif serum_insulin > 100:
                risk_score += 1
                risk_factors.append('Borderline serum insulin (100-166)')
        
        # Enhanced risk level determination with more granular probability calculation
        max_score = 25  # Maximum possible risk score
        normalized_score = risk_score / max_score
        
        if risk_score >= 15:
            risk_level = 'Very High'
            probability = min(0.95, 0.75 + normalized_score * 0.2)
        elif risk_score >= 10:
            risk_level = 'High'
            probability = min(0.75, 0.5 + normalized_score * 0.25)
        elif risk_score >= 6:
            risk_level = 'Moderate'
            probability = min(0.5, 0.25 + normalized_score * 0.25)
        elif risk_score >= 3:
            risk_level = 'Low-Moderate'
            probability = min(0.25, normalized_score * 0.25)
        else:
            risk_level = 'Low'
            probability = min(0.1, normalized_score * 0.1)
        
        return {
            'risk_level': risk_level,
            'probability': round(probability, 2),  # Round to 2 decimal places
            'risk_score': risk_score,
            'risk_factors': risk_factors,
            'recommendations': self._generate_recommendations(risk_level, risk_factors)
        }
    
    def _generate_recommendations(self, risk_level: str, risk_factors: List[str]) -> List[str]:
        """Generate personalized recommendations based on risk factors."""
        recommendations = []
        
        # Basic recommendations for everyone
        recommendations.append('Maintain a healthy diet rich in vegetables and whole grains')
        recommendations.append('Stay hydrated with water and limit sugary beverages')
        
        # Risk-specific recommendations
        if any('BMI' in factor for factor in risk_factors):
            recommendations.append('Work with a healthcare provider to achieve a healthy weight')
            recommendations.append('Consider consulting a registered dietitian for personalized nutrition advice')
        
        if any('activity' in factor.lower() for factor in risk_factors):
            recommendations.append('Aim for at least 150 minutes of moderate exercise per week')
            recommendations.append('Start with 10-15 minute walks and gradually increase duration')
        
        if any('HbA1c' in factor for factor in risk_factors):
            recommendations.append('Monitor blood sugar levels regularly as advised by your doctor')
            recommendations.append('Consider diabetes education classes for better management')
        
        if any('Hypertension' in factor or 'blood pressure' in factor.lower() for factor in risk_factors):
            recommendations.append('Monitor blood pressure regularly and follow treatment plan')
            recommendations.append('Reduce sodium intake and increase potassium-rich foods')
        
        if 'Smoking' in risk_factors:
            recommendations.append('Seek smoking cessation support and resources')
            recommendations.append('Consider nicotine replacement therapy under medical guidance')
        
        if 'Family history of diabetes' in risk_factors:
            recommendations.append('Inform your healthcare provider about family history')
            recommendations.append('Consider more frequent diabetes screenings')
        
        if any(symptom in risk_factors for symptom in ['Excessive thirst', 'Frequent urination', 'Sudden weight loss']):
            recommendations.append('Schedule an immediate medical consultation for symptom evaluation')
            recommendations.append('Keep a symptom diary to track patterns and severity')
        
        # Risk level specific recommendations
        if risk_level in ['Very High', 'High']:
            recommendations.append('Schedule an immediate comprehensive medical evaluation')
            recommendations.append('Consider consulting with an endocrinologist or diabetes specialist')
            recommendations.append('Implement daily blood glucose monitoring as recommended')
        elif risk_level == 'Moderate':
            recommendations.append('Schedule a medical check-up within the next 3 months')
            recommendations.append('Implement lifestyle changes gradually with professional guidance')
        
        return recommendations
