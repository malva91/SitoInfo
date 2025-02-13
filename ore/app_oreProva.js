/* INIZIALIZZAZIONE APPLICAZIONE */
const dipendenti = employees.map((emp) => emp.name);
/* VERIFICA AUTENTICAZIONE */
function checkAuth() {
  const loggedUser = sessionStorage.getItem("loggedUser");
  if (!loggedUser || !employees.some((emp) => emp.name === loggedUser)) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}
/* GESTIONE LOGOUT */
function logout() {
  sessionStorage.removeItem("loggedUser");
  window.location.href = "login.html";
}
/* CONFIGURAZIONE ENDPOINT API */
const API_ENDPOINTS = {
  WRITE:
    "https://script.google.com/macros/s/AKfycby5Ektnaanro8B1KQxw6JW422HjkDoWEacbrZZnyqRVl5fCsOJUj4zblOXREbJ0CgtiWg/exec",
};
/* SISTEMA DI FEEDBACK */
const FeedbackSystem = {
  feedbackStates: {
    dataSending: false, // 25%
    dataReceiving: false, // 50%
    dataWriting: false, // 75%
    dataVerifying: false, // 100%
  },

  progress: 0,

  updateFeedback(step, status) {
    this.feedbackStates[step] = status;
    this.updateProgress();
  },

  updateProgress(step) {
    const progressMap = {
      dataSending: 25,
      dataReceiving: 50,
      dataWriting: 75,
      dataVerifying: 100,
    };

    this.progress = progressMap[step] || 0;
    this.renderProgress();
  },

  renderProgress() {
    let progressContainer = document.getElementById("progressContainer");
    if (!progressContainer) {
      progressContainer = document.createElement("div");
      progressContainer.id = "progressContainer";
      progressContainer.className = "progress-container";
      progressContainer.style = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            `;
      document.body.appendChild(progressContainer);
    }

    let currentMessage;
    if (this.progress <= 25) {
      currentMessage = "📤 Fase 1: Invio dati...";
    } else if (this.progress <= 50) {
      currentMessage = "📥 Fase 2: Ricezione dati...";
    } else if (this.progress <= 75) {
      currentMessage = "💾 Fase 3: Scrittura dati...";
    } else if (this.progress < 100) {
      currentMessage = "✓ Fase 4: Verifica finale...";
    } else {
      currentMessage = "Completato ✨";
    }

    const modalContent = `
    <div class="progress-modal">
        <h2 class="progress-title">✨ Elaborazione in corso</h2>
        <div class="progress-content">
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${this.progress}%;"></div>
            </div>
            <div class="progress-text">${currentMessage}</div>
            <div class="progress-percentage">${Math.round(this.progress)}%</div>
        </div>
    </div>
`;

    progressContainer.innerHTML = modalContent;
  },

  getStepText(step) {
    const stepTexts = {
      dataSending: "📤 Fase 1: Invio dati...",
      dataReceiving: "📥 Fase 2: Ricezione dati...",
      dataWriting: "💾 Fase 3: Scrittura dati...",
      dataVerifying: "✓ Fase 4: Verifica finale...",
    };
    return stepTexts[step] || "Completato ✨";
  },

  reset() {
    Object.keys(this.feedbackStates).forEach((key) => {
      this.feedbackStates[key] = false;
    });
    this.progress = 0;
    const progressContainer = document.getElementById("progressContainer");
    if (progressContainer) {
      progressContainer.remove();
    }
  },

  complete() {
    const progressContainer = document.getElementById("progressContainer");
    if (progressContainer) {
      setTimeout(() => progressContainer.remove(), 500);
    }
  },
};
/* STILI CSS */
const styles = `
.feedback-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}

.feedback-step {
    display: flex;
    align-items: center;
    margin: 10px 0;
    padding: 10px;
    border-radius: 4px;
    transition: all 0.3s ease;
}

.feedback-step.pending {
    background: #f5f5f5;
}

.feedback-step.success {
    background: #e8f5e9;
}

.step-icon {
    margin-right: 10px;
    font-size: 1.2em;
}

.feedback-step.success .step-icon {
    color: #4caf50;
}

.feedback-step.pending .step-icon {
    color: #9e9e9e;
}
`;
const App = {
  init() {
    if (!checkAuth()) return;

    this.cacheElements();
    this.bindEvents();
    this.initializeDatePicker();
    this.setupSelectSorting();
    this.populateDipendentiSelect();
    this.initializeForm();
    this.renderActivityButtons();

    // Imposta il dipendente loggato
    const loggedUser = sessionStorage.getItem("loggedUser");
    if (loggedUser) {
      const usernameSelect = document.getElementById("username");
      usernameSelect.value = loggedUser;
      usernameSelect.disabled = true;
    }
  },

  populateDipendentiSelect() {
    const select = document.getElementById("username");
    if (select) {
      const sortedDipendenti = [...dipendenti].sort((a, b) =>
        a.localeCompare(b, "it", { sensitivity: "base" })
      );

      sortedDipendenti.forEach((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
      });
    }
  },

  cacheElements() {
    this.form = document.getElementById("registrationForm");
    this.festaCheckbox = document.getElementById("festaCheckbox");
    this.activitiesContainer = document.getElementById("activitiesContainer");
    this.submitBtn = document.getElementById("submitBtn");
    this.messageEl = document.getElementById("message");
  },

  async handleSubmit(e) {
    e.preventDefault();
    if (this.submitBtn.disabled) return;

    const data = this.collectFormData();
    await this.sendData(data);
  },

  toggleActivityFields() {
    const isFestaChecked = this.festaCheckbox.checked;
    this.activitiesContainer.style.display = isFestaChecked ? "none" : "block";
    document.getElementById("activityButtons").style.display = isFestaChecked
      ? "none"
      : "flex";
  },

  bindEvents() {
    if (this.form) {
      this.form.addEventListener("submit", this.handleSubmit.bind(this));
    }
    if (this.festaCheckbox) {
      this.festaCheckbox.addEventListener(
        "change",
        this.toggleActivityFields.bind(this)
      );
    }
  },

  /* METODI DI INIZIALIZZAZIONE DATE PICKER E SELECT */

  initializeDatePicker() {
    const dateInput = document.getElementById("date");
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const formatDisplay = (date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const formatISO = (date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    };

    dateInput.type = "text";
    dateInput.value = formatDisplay(today);

    const hiddenDateInput = document.createElement("input");
    hiddenDateInput.type = "hidden";
    hiddenDateInput.name = "hiddenDate";
    hiddenDateInput.value = formatISO(today);
    dateInput.after(hiddenDateInput);

    const pickerInput = document.createElement("input");
    pickerInput.type = "date";
    pickerInput.style.position = "absolute";
    pickerInput.style.opacity = "0";
    pickerInput.value = formatISO(today);
    pickerInput.min = formatISO(yesterday);
    pickerInput.max = formatISO(today);
    dateInput.after(pickerInput);

    dateInput.addEventListener("click", () => {
      pickerInput.showPicker();
    });

    pickerInput.addEventListener("change", (e) => {
      const selectedDate = new Date(e.target.value);
      dateInput.value = formatDisplay(selectedDate);
      hiddenDateInput.value = formatISO(selectedDate);
    });

    dateInput.readOnly = true;
  },

  setupSelectSorting() {
    const sortSelectOptions = (select) => {
      const options = Array.from(select.options);
      const firstOption = options.shift();

      options.sort((a, b) =>
        a.text.localeCompare(b.text, "it", { sensitivity: "base" })
      );

      select.innerHTML = "";
      select.appendChild(firstOption);
      options.forEach((option) => select.appendChild(option));
    };

    document.querySelectorAll("select").forEach(sortSelectOptions);
    new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === "SELECT") {
              sortSelectOptions(node);
            }
            node.querySelectorAll("select").forEach(sortSelectOptions);
          }
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
  },

  initializeForm() {
    this.toggleActivityFields();
  },

  /* GESTIONE ATTIVITÀ E RENDERING */

  renderActivityButtons() {
    const buttonContainer = document.getElementById("activityButtons");
    const buttons = [
      { id: "addCantiereBtn", text: "Cantiere", color: "#006669" },
      { id: "addAppartamentiBtn", text: "Appartamenti", color: "#B71C6B" },
      { id: "addBnBBtn", text: "BnB", color: "#B38F00" },
      { id: "addPstBtn", text: "PST", color: "#283593" },
    ];

    this.activityColors = {
      cantiere: "#006669",
      appartamenti: "#B71C6B",
      bnb: "#B38F00",
      pst: "#283593",
    };

    buttons.forEach((button) => {
      const btnHtml = `
                <div class="col-12 mb-2">
                    <button type="button" class="btn w-100 fw-bold" id="${button.id}"
                        style="background-color: ${button.color} !important; color: #FFFFFF !important;">${button.text}</button>
                </div>
            `;
      buttonContainer.insertAdjacentHTML("beforeend", btnHtml);
      document
        .getElementById(button.id)
        .addEventListener("click", () =>
          this.addActivity(button.text.toLowerCase())
        );
    });
  },

  async addActivity(type) {
    const activityIndex = this.activitiesContainer.children.length;
    const backgroundColor = this.activityColors[type];
    const baseStyle = `background-color: ${backgroundColor} !important; color: #FFFFFF !important; padding: 15px !important; border-radius: 5px !important;`;

    let activityHtml = "";
    if (type === "pst") {
      activityHtml = this.createPSTActivityHtml(activityIndex, baseStyle);
    } else {
      activityHtml = await this.createStandardActivityHtml(
        type,
        activityIndex,
        baseStyle
      );
    }
    this.activitiesContainer.insertAdjacentHTML("beforeend", activityHtml);
  },

  createPSTActivityHtml(index, baseStyle) {
    return `
            <div class="activity-group d-flex align-items-center mb-3" id="activity${index}" data-type="pst" style="${baseStyle}">
                <div class="flex-grow-1 me-2">
                    <input type="text" class="form-control mb-2" name="activity${index}" placeholder="PST" required>
                    <input type="number" class="form-control" name="minutes${index}" placeholder="Minuti" required>
                    <input type="hidden" name="people${index}" value="1">
                </div>
                <button type="button" class="btn btn-danger delete-btn" onclick="App.deleteActivity(${index})">Elimina</button>
            </div>
        `;
  },

  async createStandardActivityHtml(type, index, baseStyle) {
    const options = await this.loadOptionsFromHtml(type);
    const optionsHtml = options
      .map(
        (option) => `<option value="${option.value}">${option.text}</option>`
      )
      .join("");
    const moltiplicatoreHtml =
      type === "bnb" ? this.createMoltiplicatoreHtml(index) : "";

    return `
            <div class="activity-group d-flex align-items-center mb-3" id="activity${index}" data-type="${type}" style="${baseStyle}">
                <div class="flex-grow-1 me-2">
                    <select class="form-select mb-2" name="activity${index}" required onchange="App.updateMinutes(this, ${index})">
                        <option value="">${type}</option>
                        ${optionsHtml}
                    </select>
                    <input type="number" class="form-control mb-2" name="minutes${index}" placeholder="Minuti" required readonly>
                    ${moltiplicatoreHtml}
                    <select class="form-select" name="people${index}" required>
                        <option value="">Persone</option>
                        ${[1, 2, 3, 4]
                          .map(
                            (num) =>
                              `<option value="${num}" ${
                                num === 2 ? "selected" : ""
                              }>${num}</option>`
                          )
                          .join("")}
                    </select>
                </div>
                <button type="button" class="btn btn-danger delete-btn" onclick="App.deleteActivity(${index})">Elimina</button>
            </div>
        `;
  },

  /* GESTIONE ATTIVITÀ E DATI */

  createMoltiplicatoreHtml(index) {
    return `
            <select class="form-select mb-2" name="moltiplicatore${index}" required>
                <option value="">Moltiplicatore</option>
                ${Array.from(
                  { length: 10 },
                  (_, i) => `<option value="${i + 1}">${i + 1}</option>`
                ).join("")}
            </select>
        `;
  },

  async loadOptionsFromHtml(type) {
    const optionsMap = {
      cantiere: uffici,
      bnb: bnb,
      appartamenti: appartamenti,
    };
    return (optionsMap[type] || []).map((item) => {
      const [text, value] = item.split("|");
      return { text, value: `${text}|${value}` };
    });
  },

  updateMinutes(selectElement, index) {
    const [, minutes] = selectElement.value.split("|");
    const minutesInput = document.querySelector(`[name="minutes${index}"]`);
    minutesInput.value = minutes || "";
    minutesInput.readOnly = !!minutes;
  },

  deleteActivity(index) {
    document.getElementById(`activity${index}`)?.remove();
  },

  collectFormData() {
    const data = {
      username: document.getElementById("username").value,
      date: document.getElementById("date").value,
      activities: [],
    };

    if (this.festaCheckbox.checked) {
      data.activities.push(this.createFestaActivity());
    } else {
      const activityGroups = this.form.querySelectorAll(".activity-group");
      activityGroups.forEach((group) => {
        const activityData = this.getActivityData(group);
        if (activityData) data.activities.push(activityData);
      });
    }

    return data;
  },

  /* GESTIONE FORMATTAZIONE E INVIO DATI */

  createFestaActivity() {
    return {
      activityType: "festa",
      activity: "Riposo",
      minutes: "0",
      people: "1",
      moltiplicatore: "0",
    };
  },

  getActivityData(group) {
    const type = group.dataset.type;
    const activityInput =
      type === "pst"
        ? group.querySelector('input[name^="activity"]')
        : group.querySelector('select[name^="activity"]');
    const minutesInput = group.querySelector('input[name^="minutes"]');
    const peopleInput =
      type === "pst"
        ? group.querySelector('input[name^="people"][type="hidden"]')
        : group.querySelector('select[name^="people"]');
    const moltiplicatoreSelect =
      type === "bnb"
        ? group.querySelector('select[name^="moltiplicatore"]')
        : null;

    if (!activityInput || !minutesInput || !peopleInput) {
      console.error("Elementi mancanti nel gruppo di attività:", group);
      return null;
    }

    return {
      activityType: type,
      activity: this.formatActivityValue(type, activityInput),
      minutes: minutesInput.value || "0",
      people: peopleInput.value || "1",
      moltiplicatore:
        type === "bnb" && moltiplicatoreSelect
          ? moltiplicatoreSelect.value || "1"
          : "1",
    };
  },

  formatActivityValue(type, input) {
    if (type === "pst") return `Pst-${input.value}`;
    const selectedText = input.options[input.selectedIndex]?.text || "N/A";
    const prefixMap = {
      bnb: "BnB",
      cantiere: "POR",
      appartamenti: "App",
    };
    return `${prefixMap[type] || ""}-${selectedText}`;
  },

  formatData(data) {
    return {
      username: data.username,
      date: data.date,
      activities: data.activities.map((activity) => ({
        activityType: activity.activityType,
        activity: activity.activity,
        minutes: activity.minutes,
        people: activity.people,
        moltiplicatore: activity.moltiplicatore || "1",
      })),
    };
  },

  /* GESTIONE INVIO DATI E UI */

  async sendData(data) {
    FeedbackSystem.reset();
    this.submitBtn.disabled = true;

    try {
        // Step 1: Invio dati (25%)
        FeedbackSystem.updateProgress("dataSending");
        const formattedData = this.formatData(data);
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Step 2: Ricezione dati (50%)
        FeedbackSystem.updateProgress("dataReceiving");
        const quickSendResult = await this.quickSendData(formattedData);
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Step 3: Scrittura dati (75%)
        FeedbackSystem.updateProgress("dataWriting");
        const sheetVerification = await appendToSheet(data);
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Step 4: Verifica dati (100%)
        FeedbackSystem.updateProgress("dataVerifying");

        if (quickSendResult && sheetVerification.success) {
            await new Promise((resolve) => setTimeout(resolve, 200));
            FeedbackSystem.complete();
            this.handleSuccess(data);
        } else {
            throw new Error("Verifica dati fallita. Aggiornare e reinviare i dati.");
        }

    } catch (error) {
        console.error("Error:", error);
        this.showMessage("Verifica dati fallita. Aggiornare e reinviare i dati", "danger");
        FeedbackSystem.complete();
    } finally {
        this.submitBtn.disabled = false;
    }
},

  async quickSendData(data) {
    try {
      await fetch(API_ENDPOINTS.WRITE, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(data),
      });
      return true;
    } catch (error) {
      console.error("Error sending data:", error);
      return false;
    }
  },

  handleSuccess(data) {
    this.showMessage("Registrazione completata con successo!", "success");
    this.showPopup(data);
    this.form.reset();
    this.activitiesContainer.innerHTML = "";
  },

  showMessage(text, type) {
    this.messageEl.textContent = text;
    this.messageEl.className = `mt-3 alert alert-${type}`;
    this.messageEl.style.display = "block";
    setTimeout(() => (this.messageEl.style.display = "none"), 5000);
  },
  createModalContent(data) {
    let formattedContent = this.createGeneralInfoSection(data);
    if (data.activities.length > 0) {
      formattedContent += this.createActivitiesSection(data.activities);
    }
    return formattedContent;
  },

  createGeneralInfoSection(data) {
    return `
            <h2 style="color: #2ecc71; text-align: center; margin-bottom: 20px; font-size: 1.5em;">
                ✨ Dati inviati con successo
            </h2>
            <div style="margin-bottom: 20px; background: #34495e; padding: 15px; border-radius: 8px;">
                <h3 style="color: #fff; margin-bottom: 15px; font-size: 1.2em;">👤 Informazioni Generali</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr style="border-bottom: 1px solid #546e7a;">
                        <th style="padding: 12px; text-align: left; color: #bdc3c7;">Dipendente</th>
                        <td style="padding: 12px;">${data.username}</td>
                    </tr>
                    <tr>
                        <th style="padding: 12px; text-align: left; color: #bdc3c7;">Data</th>
                        <td style="padding: 12px;">${data.date}</td>
                    </tr>
                </table>
            </div>
        `;
  },

  createActivitiesSection(activities) {
    return `
            <div style="margin-bottom: 20px; background: #34495e; padding: 15px; border-radius: 8px;">
                <h3 style="color: #fff; margin-bottom: 15px; font-size: 1.2em;">📝 Lista Attività</h3>
                ${activities.map(this.createActivityCard).join("")}
            </div>
        `;
  },

  createActivityCard(activity) {
    return `
            <div style="background: #2c3e50; margin-bottom: 15px; padding: 15px; border-radius: 8px;">
                <div style="margin-bottom: 10px;">
                    <strong style="color: #bdc3c7;">Tipo:</strong>
                    <div style="color: #fff;">${activity.activityType}</div>
                </div>
                <div style="margin-bottom: 10px;">
                    <strong style="color: #bdc3c7;">Descrizione:</strong>
                    <div style="color: #fff;">${activity.activity}</div>
                </div>
                <div style="margin-bottom: 10px;">
                    <strong style="color: #bdc3c7;">Minuti:</strong>
                    <div style="color: #fff;">${activity.minutes}</div>
                </div>
                <div style="margin-bottom: 10px;">
                    <strong style="color: #bdc3c7;">Persone:</strong>
                    <div style="color: #fff;">${activity.people}</div>
                </div>
                <div>
                    <strong style="color: #bdc3c7;">Moltiplicatore:</strong>
                    <div style="color: #fff;">${activity.moltiplicatore}</div>
                </div>
            </div>
        `;
  },

  showPopup(data) {
    const popup = document.createElement("div");
    popup.setAttribute(
      "style",
      `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `
    );

    const modalContent = document.createElement("div");
    modalContent.setAttribute(
      "style",
      `
            background: #2d3436;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 0 20px rgba(0,0,0,0.8);
            max-width: 800px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            color: #dfe6e9;
        `
    );

    modalContent.innerHTML = `
            <div style="position: relative;">
                ${this.createModalContent(data)}
                <button onclick="App.closePopup()" 
                        style="background: #3498db; color: white; border: none; padding: 10px 20px; 
                               border-radius: 5px; cursor: pointer; display: block; margin: 20px auto 0;
                               transition: background 0.3s;">
                    Chiudi
                </button>
            </div>
        `;

    popup.appendChild(modalContent);
    document.body.appendChild(popup);
  },

  closePopup() {
    const popup = document.body.querySelector('div[style*="position: fixed"]');
    if (popup) {
      popup.remove();
      sessionStorage.removeItem("loggedUser");
      window.location.href = "login.html";
    }
  },
};

document.addEventListener("DOMContentLoaded", () => App.init());
