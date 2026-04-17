document.addEventListener('DOMContentLoaded', () => {
    const predictionForm = document.getElementById('predictionForm');
    const resultsSection = document.getElementById('resultsSection');
    const submitBtn = document.getElementById('submitBtn');

    predictionForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = "Processing Logic...";
        submitBtn.disabled = true;

        const formData = {
            gender: document.getElementById('gender').value,
            age: parseInt(document.getElementById('age').value),
            hypertension: parseInt(document.getElementById('hypertension').value),
            heart_disease: parseInt(document.getElementById('heart_disease').value),
            smoking_history: document.getElementById('smoking_history').value,
            bmi: parseFloat(document.getElementById('bmi').value),
            HbA1c_level: parseFloat(document.getElementById('hba1c').value),
            blood_glucose_level: parseFloat(document.getElementById('glucose').value)
        };

        try {
            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('API Error');

            const data = await response.json();

            predictionForm.classList.add('hidden');
            resultsSection.classList.remove('hidden');

            document.getElementById('riskPercentage').innerText = `${data.riskPercentage}%`;
            document.getElementById('riskLabel').innerText = data.riskLabel;

            const list = document.getElementById('suggestionsList');
            list.innerHTML = '';
            data.suggestions.forEach(suggestion => {
                const li = document.createElement('li');
                li.innerText = suggestion;
                list.appendChild(li);
            });

        } catch (error) {
            console.error('Fetch Error:', error);
            alert('Could not connect to Flask Server. Please ensure app.py is running on port 5000.');
        } finally {
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
        resultsSection.classList.add('hidden');
        predictionForm.classList.remove('hidden');
        predictionForm.reset();
    });
});