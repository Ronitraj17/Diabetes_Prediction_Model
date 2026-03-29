from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
# Enable CORS so your frontend (on a different port) can talk to this backend
CORS(app) 

# 1. Load the ML Pipeline
try:
    pipeline_data = joblib.load('diabetes_pipeline.pkl')
    scaler = pipeline_data['scaler']
    model_xgb = pipeline_data['model_xgb']
    model_lgb = pipeline_data['model_lgb']
    model_rf = pipeline_data['model_rf']
    print("✅ Machine Learning models loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # 2. Get the JSON data sent from app.js
        data = request.get_json()

        # 3. Map Categorical Variables to match training data
        gender_map = {'Male': 0, 'Female': 1, 'Other': 2}
        gender = gender_map.get(data['gender'], 2) # Default to 'Other' if missing

        # Note: Adjust these numbers if your pandas .cat.codes resulted in different integers!
        smoking_map = {'never': 4, 'past': 3, 'active': 1} 
        smoking_history = smoking_map.get(data['smoking_history'], 0) 

        # Extract numeric features
        age = float(data['age'])
        hypertension = int(data['hypertension'])
        heart_disease = int(data['heart_disease'])
        bmi = float(data['bmi'])
        glucose = float(data['glucose'])
        hba1c = float(data['hba1c'])

        # 4. Assemble the exact feature array your model expects
        # MUST match the exact column order of X_train
        feature_names = ['gender', 'age', 'hypertension', 'heart_disease', 'smoking_history', 'bmi', 'HbA1c_level', 'blood_glucose_level']
        features_df = pd.DataFrame([[
            gender, age, hypertension, heart_disease, smoking_history, bmi, hba1c, glucose
        ]], columns=feature_names)

        # 5. Scale the features
        X_scaled = scaler.transform(features_df)

        # 6. Run the Ensemble Prediction (get probability of Class 1)
        p1 = model_xgb.predict_proba(X_scaled)[0][1]
        p2 = model_lgb.predict_proba(X_scaled)[0][1]
        p3 = model_rf.predict_proba(X_scaled)[0][1]

        # 7. Average the probabilities and convert to percentage
        final_prob = (p1 + p2 + p3) / 3
        risk_score = int(round(final_prob * 100))

        # 8. Send the result back to the frontend
        return jsonify({
            'success': True,
            'riskPercentage': risk_score
        })

    except Exception as e:
        print("Backend Error:", e)
        return jsonify({'success': False, 'error': str(e)}), 400

if __name__ == '__main__':
    # Run the server locally on port 5000
    app.run(debug=True, port=5000)