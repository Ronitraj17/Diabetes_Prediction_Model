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
    print("Ensemble Intelligence Loaded Successfully!")
except Exception as e:
    print(f"Error loading model: {e}")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        gender_map = {'Male': 0, 'Female': 1, 'Other': 2}
        gender = gender_map.get(data.get('gender'), 2) 

        smoking_map = {'never': 4, 'past': 3, 'active': 1}
        smoking_history = smoking_map.get(data.get('smoking_history'), 0) 

        age = float(data.get('age', 0))
        hypertension = int(data.get('hypertension', 0))
        heart_disease = int(data.get('heart_disease', 0))
        bmi = float(data.get('bmi', 0))
        glucose = float(data.get('blood_glucose_level', 0))
        hba1c = float(data.get('HbA1c_level', 0))

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

        if risk_score < 30:
            label = "Low Risk"
            suggestions = [
                "Maintain your current balanced diet.",
                "Continue regular physical activity (30 mins/day).",
                "Routine check-up recommended once a year."
            ]
        elif 30 <= risk_score < 70:
            label = "Moderate Risk (Pre-Diabetic)"
            suggestions = [
                "Reduce refined sugar and high-carb intake.",
                "Increase daily fiber (vegetables, whole grains).",
                "Consult a physician for a Glucose Tolerance Test."
            ]
        else:
            label = "High Risk"
            suggestions = [
                "Immediate consultation with an Endocrinologist is advised.",
                "Monitor blood glucose levels daily.",
                "Strict adherence to a low-glycemic index diet."
            ]

        print(f"Prediction: {risk_score}% | Status: {label}")

        return jsonify({
            'success': True,
            'riskPercentage': risk_score,
            'riskLabel': label,
            'suggestions': suggestions
        })

    except Exception as e:
        print("Backend Error:", e)
        return jsonify({'success': False, 'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)