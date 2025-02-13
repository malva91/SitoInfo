// Aggiungi questo codice all'inizio del file config.js
document.addEventListener('DOMContentLoaded', () => {
  // Inizializzazione dei pulsanti principali
  document.getElementById('addAppartamentiBtn')
      .addEventListener('click', () => addActivity('appartamenti'));
      
  document.getElementById('addBnBBtn')
      .addEventListener('click', () => addActivity('bnb'));
      
  // Gestione del form di registrazione    
  document.getElementById('registrationForm')
      .addEventListener('submit', handleFormSubmit);
      
  // Avvio dell'ordinamento dei select
  setupSelectSorting();
});

const dipendenti = employees.map((emp) => emp.name);

const FeedbackSystem = {
  feedbackStates: {
    dataFormatting: false,
    dataSending: false,
    dataReceiving: false,
    dataWriting: false,
    validazioneDati: false,
    salvataggioDati: false,
    completamento: false
  },
  progress: 0,

  reset() {
    Object.keys(this.feedbackStates).forEach((key) => {
      this.feedbackStates[key] = false;
    });
    this.progress = 0;
  },

  updateFeedback(state, value) {
    if (this.feedbackStates.hasOwnProperty(state)) {
      this.feedbackStates[state] = value;
      this.updateProgress();
    }
  },

  updateProgress() {
    const totalStates = Object.keys(this.feedbackStates).length;
    const completedStates = Object.values(this.feedbackStates).filter(
      (state) => state
    ).length;
    this.progress = (completedStates / totalStates) * 100;
  },

  complete() {
    Object.keys(this.feedbackStates).forEach((key) => {
      this.feedbackStates[key] = true;
    });
    this.progress = 100;
  },
};
async function loadOptions(type) {
  if (type === "dipendenti") {
    return dipendenti.map((nome) => ({
      value: nome,
      text: nome,
    }));
  } else if (type === "nomi_Appartamenti") {
    return appartamenti.map((item) => {
      const [text, value] = item.split("|");
      return { value: text, text: text };
    });
  } else {
    console.error(`Tipo di opzioni non riconosciuto: ${type}`);
    return [];
  }
}
function validateForm() {
  const requiredFields = document.querySelectorAll("[required]");
  for (let field of requiredFields) {
    if (!field.value.trim()) {
      showMessage(`Il campo ${field.name} è obbligatorio`, "danger");
      field.focus();
      return false;
    }
  }
  return true;
}
function handleResponse(response, data) {
  if (response.status === "success") {
    showMessage("Registrazione inviata con successo!", "success");
    showPopup(data);
    document.getElementById("registrationForm").reset();
    document.getElementById("activitiesContainer").innerHTML = "";
  } else {
    showMessage("Errore durante l'invio: " + response.message, "danger");
  }
}
function resetSubmitButton(button) {
  setTimeout(() => {
    button.disabled = false;
    button.textContent = "Registra";
  }, 5000);
}

