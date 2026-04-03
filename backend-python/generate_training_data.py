import os
import numpy as np
import pandas as pd
from datetime import datetime

def generate_and_export_samples(n_samples: int = 2000, output_filename: str = "training_data.csv"):
    """
    Generate synthetic diabetes dataset and export to CSV.
    
    Args:
        n_samples: Number of samples to generate (default: 2000)
        output_filename: Output CSV filename (default: training_data.csv)
    """
    print(f"Generating {n_samples} synthetic samples...")
    np.random.seed(42)
    
    # Generate realistic sample data
    data = {
        'age': np.random.randint(18, 80, n_samples),
        'gender': np.random.choice(['Male', 'Female'], n_samples),
        'bmi': np.random.normal(28, 5, n_samples),
        'fasting_glucose': np.random.normal(100, 30, n_samples),
        'hba1c': np.random.normal(5.5, 1.5, n_samples),
        'systolic_bp': np.random.normal(120, 20, n_samples),
        'diastolic_bp': np.random.normal(80, 15, n_samples),
        'family_history': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
        'physical_activity': np.random.choice([0, 1, 2, 3], n_samples, p=[0.3, 0.3, 0.25, 0.15]),
        'smoking': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
        'alcohol': np.random.choice([0, 1], n_samples, p=[0.6, 0.4]),
        'pregnancies': np.random.randint(0, 6, n_samples),
        'excessive_thirst': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
        'frequent_urination': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
        'sudden_weight_loss': np.random.choice([0, 1], n_samples, p=[0.9, 0.1])
    }
    
    df = pd.DataFrame(data)
    
    # Create target variable based on risk factors
    risk_score = (
        (df['fasting_glucose'] > 100) * 2 +
        (df['hba1c'] > 5.7) * 2 +
        (df['bmi'] > 25) * 1 +
        (df['age'] > 45) * 1 +
        df['family_history'] * 1 +
        (df['physical_activity'] < 2) * 1
    )
    
    # Create binary target (diabetes risk)
    df['diabetes_risk'] = (risk_score >= 3).astype(int)
    
    # Export to CSV
    csv_path = os.path.join(os.path.dirname(__file__), output_filename)
    df.to_csv(csv_path, index=False)
    
    print(f"\n✓ CSV file created successfully!")
    print(f"  File: {csv_path}")
    print(f"  Samples: {len(df)}")
    print(f"  Columns: {len(df.columns)}")
    print(f"  File size: {os.path.getsize(csv_path) / 1024:.2f} KB")
    
    # Print summary statistics
    print(f"\n📊 Dataset Summary:")
    print(f"  Diabetes Risk Distribution:")
    print(f"    - No Risk (0): {(df['diabetes_risk'] == 0).sum()} samples ({(df['diabetes_risk'] == 0).sum() / len(df) * 100:.1f}%)")
    print(f"    - At Risk (1): {(df['diabetes_risk'] == 1).sum()} samples ({(df['diabetes_risk'] == 1).sum() / len(df) * 100:.1f}%)")
    
    print(f"\n📈 Feature Statistics:")
    print(df.describe().round(2))
    
    return df

if __name__ == "__main__":
    # Generate 2000 samples (can be changed)
    df = generate_and_export_samples(n_samples=2000, output_filename="diabetes_training_data.csv")
    
    # Optional: Also generate a larger dataset with 5000 samples
    print("\n" + "="*60)
    df_large = generate_and_export_samples(n_samples=5000, output_filename="diabetes_training_data_5k.csv")
