// Add styles to document head

const createDataParticles = () => {
    let particles = '';
    for(let i = 0; i < 8; i++) {
        particles += `<div class="data-particle active" style="animation-delay: ${i * 0.3}s"></div>`;
    }
    return particles;
};

const progressOverlay = (() => {
    const overlay = document.createElement("div");
    overlay.className = "progress-overlay";
    overlay.innerHTML = `
        <div class="data-stream">
            ${createDataParticles()}
            <div class="server-icon">
                <div class="server-light"></div>
            </div>
            <div class="progress-text">Preparazione dati...</div>
        </div>
    `;
    return overlay;
})();

function updateProgress(text, percentage) {
    const progressText = progressOverlay.querySelector('.progress-text');
    const serverLight = progressOverlay.querySelector('.server-light');
    
    progressText.textContent = `${text} (${percentage}%)`;
    
    if (percentage > 50) {
        serverLight.classList.add('active');
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const submitBtn = document.getElementById("submitBtn");
    if (submitBtn.disabled || !validateForm()) return;

    document.body.appendChild(progressOverlay);
    submitBtn.disabled = true;
    submitBtn.textContent = "Invio in corso...";

    const formData = new FormData(e.target);
    const data = collectFormDataFast(e.target, formData);

    if (!data || data.length === 0) {
        document.body.removeChild(progressOverlay);
        resetSubmitButton(submitBtn);
        return;
    }

    await sendDataOptimized(data, submitBtn);
}

function collectFormDataFast(form, formData) {
    updateProgress("Raccolta dati...", 25);
    showMessage("Preparazione dei dati in corso...", "info");

    const data = Array.from(form.querySelectorAll(".activity-group"))
        .reduce((acc, group) => {
            const type = group.dataset.type;
            const index = group.id.replace("activity", "");
            const formatter = type === "bnb" ? formatBnBData : formatAppartamentiData;
            const formattedData = formatter(formData, index);

            if (formattedData) acc.push(formattedData);
            return acc;
        }, []);

    if (data.some(item => item === null)) {
        showMessage("Alcuni dati sono mancanti o non validi", "danger");
        return null;
    }

    if (data.length === 0) {
        showMessage("Aggiungi almeno un'attività prima di inviare", "danger");
        return null;
    }

    updateProgress("Dati preparati", 50);
    return data;
}

async function sendDataOptimized(data, submitBtn) {
    updateProgress("Invio...", 75);
    showMessage("Invio dei dati in corso...", "info");

    try {
        await fetch("https://script.google.com/macros/s/AKfycbz1jcGuHJwPbSPK9N8_YE6MaZP-hhA7ZYP39EmytHjxgQiVk9sIvflSzsRVyNfZT4W1/exec", {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        updateProgress("Completato", 100);
        handleResponse({
            status: "success",
            message: "Dati inviati con successo"
        }, data);
    } catch (error) {
        console.error("Error:", error);
        handleResponse({
            status: "error",
            message: "Errore durante l'invio: " + error.message
        });
    } finally {
        document.body.removeChild(progressOverlay);
        resetSubmitButton(submitBtn);
    }
}

function resetSubmitButton(submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = "Invia";
}
