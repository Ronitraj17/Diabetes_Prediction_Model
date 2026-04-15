from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app) 

try:
    pipeline_data = joblib.load('diabetes_pipeline.pkl')
    scaler = pipeline_data['scaler']
    model_xgb = pipeline_data['model_xgb']
    model_lgb = pipeline_data['model_lgb']
    model_rf = pipeline_data['model_rf']
    print("Machine Learning models loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        gender_map = {'Male': 0, 'Female': 1, 'Other': 2}
        gender = gender_map.get(data['gender'], 2) 

        smoking_map = {'never': 4, 'past': 3, 'active': 1}
        smoking_history = smoking_map.get(data['smoking_history'], 0) 

        age = float(data['age'])
        hypertension = int(data['hypertension'])
        heart_disease = int(data['heart_disease'])
        bmi = float(data['bmi'])
        glucose = float(data['glucose'])
        hba1c = float(data['hba1c'])

        feature_names = ['gender', 'age', 'hypertension', 'heart_disease', 'smoking_history', 'bmi', 'HbA1c_level', 'blood_glucose_level']
        features_df = pd.DataFrame([[
            gender, age, hypertension, heart_disease, smoking_history, bmi, hba1c, glucose
        ]], columns=feature_names)

        X_scaled = scaler.transform(features_df)

        p1 = model_xgb.predict_proba(X_scaled)[0][1]
        p2 = model_lgb.predict_proba(X_scaled)[0][1]
        p3 = model_rf.predict_proba(X_scaled)[0][1]

        final_prob = (p1 + p2 + p3) / 3
        risk_score = int(round(final_prob * 100))

        print("\n" + "="*30)
        print("1. INCOMING DATA:")
        print(f"Age: {age}, BMI: {bmi}, Glucose: {glucose}, HbA1c: {hba1c}")
        print("\n2. RAW MODEL PROBABILITIES (Class 1):")
        print(f"   XGBoost:       {p1:.4f}")
        print(f"   LightGBM:      {p2:.4f}")
        print(f"   Random Forest: {p3:.4f}")
        print(f"\n3. FINAL MATH:")
        print(f"   Calculated %:  {risk_score}%")
        print("="*30 + "\n")

        return jsonify({
            'success': True,
            'riskPercentage': risk_score
        })

    except Exception as e:
        print("Backend Error:", e)
        return jsonify({'success': False, 'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)