document.addEventListener('DOMContentLoaded', () => {
    const predictionForm = document.getElementById('predictionForm');
    const resultsSection = document.getElementById('resultsSection');
    const submitBtn = document.getElementById('submitBtn');
    const resetBtn = document.getElementById('resetBtn');
    const dietBtn = document.getElementById('dietBtn');

    // Risk UI Elements
    const riskCircle = document.getElementById('riskPercentage').parentElement;
    const riskText = document.getElementById('riskPercentage');
    const riskLabel = document.getElementById('riskLabel');
    const suggestionsList = document.getElementById('suggestionsList');

    // Store current risk %
    let currentRisk = 0;

    // ===============================
    // FORM SUBMIT
    // ===============================
    predictionForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = "Analyzing Vitals...";
        submitBtn.disabled = true;

        // Collect form data
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
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error("API Error");
            }

            const data = await response.json();

            // Save risk percentage
            currentRisk = data.riskPercentage;

            // Reset old color classes
            riskCircle.className =
                "relative inline-flex items-center justify-center w-36 h-36 rounded-full border-[10px] mb-6 shadow-inner transition-all duration-700 bg-white/50";

            riskText.className =
                "text-4xl font-black transition-colors duration-700";

            riskLabel.className =
                "text-xl font-bold mb-6 uppercase tracking-wide transition-colors duration-700";

            // ===============================
            // COLOR LOGIC
            // ===============================
            if (currentRisk < 30) {
                riskCircle.classList.add('border-green-400');
                riskText.classList.add('text-green-600');
                riskLabel.classList.add('text-green-600');
            } 
            else if (currentRisk < 70) {
                riskCircle.classList.add('border-amber-400');
                riskText.classList.add('text-amber-600');
                riskLabel.classList.add('text-amber-600');
            } 
            else {
                riskCircle.classList.add('border-red-500');
                riskText.classList.add('text-red-600');
                riskLabel.classList.add('text-red-600');
            }

            // Show result section
            predictionForm.classList.add('hidden');
            resultsSection.classList.remove('hidden');

            // Show data
            riskText.innerText = `${currentRisk}%`;
            riskLabel.innerText = data.riskLabel;

            // Show suggestions
            suggestionsList.innerHTML = "";

            data.suggestions.forEach(item => {
                const li = document.createElement('li');
                li.innerText = item;
                suggestionsList.appendChild(li);
            });

        } catch (error) {
            console.error(error);
            alert("Connection Failed: Make sure Flask app.py is running on port 5000.");
        } finally {
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    // ===============================
    // RESET BUTTON
    // ===============================
    resetBtn.addEventListener('click', () => {
        predictionForm.reset();
        resultsSection.classList.add('hidden');
        predictionForm.classList.remove('hidden');
        currentRisk = 0;
    });

    // ===============================
    // DIET BUTTON
    // ===============================
    dietBtn.addEventListener('click', () => {
        window.location.href = `diet.html?risk=${currentRisk}`;
    });

});