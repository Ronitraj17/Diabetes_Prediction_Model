const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
});

const form = document.getElementById('predictionForm');
const resultsSection = document.getElementById('resultsSection');
const resetBtn = document.getElementById('resetBtn');
const riskPercentageEl = document.getElementById('riskPercentage');
const riskLabelEl = document.getElementById('riskLabel');
const suggestionsList = document.getElementById('suggestionsList');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        gender: document.getElementById('gender').value,
        age: parseFloat(document.getElementById('age').value),
        hypertension: parseInt(document.getElementById('hypertension').value),
        heart_disease: parseInt(document.getElementById('heart_disease').value),
        smoking_history: document.getElementById('smoking_history').value,
        bmi: parseFloat(document.getElementById('bmi').value),
        glucose: parseFloat(document.getElementById('glucose').value),
        hba1c: parseFloat(document.getElementById('hba1c').value)
    };
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = "Analyzing...";
    submitBtn.disabled = true;

    try {
        const response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error || "Prediction failed");
        }

        const riskScore = result.riskPercentage; 

        displayResults(riskScore);
        
        form.classList.add('hidden');
        resultsSection.classList.remove('hidden');

    } catch (error) {
        console.error("Error connecting to backend:", error);
        alert("Failed to connect to the prediction server. Please make sure your Python app.py is running!");
    } finally {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    }
});

function displayResults(score) {
    riskPercentageEl.innerText = `${score}%`;
    suggestionsList.innerHTML = '';

    if (score < 30) {
        riskLabelEl.innerText = "Low Risk";
        riskLabelEl.className = "text-lg font-medium mb-4 text-green-500";
        addSuggestions(["Maintain current balanced diet.", "Continue regular cardiovascular exercise.", "Schedule standard annual checkups."]);
    } else if (score < 60) {
        riskLabelEl.innerText = "Moderate Risk";
        riskLabelEl.className = "text-lg font-medium mb-4 text-yellow-500";
        addSuggestions(["Consider monitoring carbohydrate intake.", "Aim for 150 minutes of moderate exercise weekly.", "Consult a doctor about your HbA1c levels."]);
    } else {
        riskLabelEl.innerText = "High Risk";
        riskLabelEl.className = "text-lg font-medium mb-4 text-red-500";
        addSuggestions(["Schedule an appointment with a healthcare provider immediately.", "Strictly monitor blood glucose levels.", "Consult a dietitian for a specialized meal plan."]);
    }
}

function addSuggestions(suggestions) {
    suggestions.forEach(text => {
        const li = document.createElement('li');
        li.innerText = text;
        suggestionsList.appendChild(li);
    });
}
resetBtn.addEventListener('click', () => {
    resultsSection.classList.add('hidden');
    form.classList.remove('hidden');
    form.reset();
});