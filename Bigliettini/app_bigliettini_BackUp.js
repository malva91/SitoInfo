// Funzione per mostrare il popup con i dati inviati
const dipendenti = employees.map((emp) => emp.name);

const FeedbackSystem = {
  feedbackStates: {
    dataFormatting: false,
    dataSending: false,
    dataReceiving: false,
    dataWriting: false,
    validazioneDati: false,
    salvataggioDati: false,
    completamento: false,
  },
  progress: 0,

  // Aggiungi questi metodi essenziali
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

const feedbackSummary = `
    <div style="margin-bottom: 20px; background: #34495e; padding: 15px; border-radius: 8px;">
        <h3 style="color: #fff; margin-bottom: 15px; font-size: 1.2em;">📊 Stato Operazioni</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="padding: 8px 0; display: flex; align-items: center;">
                ${FeedbackSystem.feedbackStates.validazioneDati ? "✅" : "❌"} 
                <span style="margin-left: 10px;">Validazione Dati</span>
            </li>
            <!-- Continue updating other states similarly -->
        </ul>
    </div>
`;

function showPopup(data) {
  const popup = document.createElement("div");
  popup.id = "customPopup";
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

  let content = `
        <h2 style="color: #2ecc71; text-align: center; margin-bottom: 20px; font-size: 1.5em;">
            ✨ Dati inviati con successo
        </h2>
        
        <div style="margin-bottom: 20px; background: #34495e; padding: 15px; border-radius: 8px;">
            <h3 style="color: #fff; margin-bottom: 15px; font-size: 1.2em;">📊 Stato Operazioni</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="padding: 8px 0; display: flex; align-items: center;">
                    ${
                      FeedbackSystem.feedbackStates.dataFormatting ? "✅" : "❌"
                    } 
                    <span style="margin-left: 10px;">Formattazione dati</span>
                </li>
                <li style="padding: 8px 0; display: flex; align-items: center;">
                    ${FeedbackSystem.feedbackStates.dataSending ? "✅" : "❌"} 
                    <span style="margin-left: 10px;">Invio dati</span>
                </li>
                <li style="padding: 8px 0; display: flex; align-items: center;">
                    ${
                      FeedbackSystem.feedbackStates.dataReceiving ? "✅" : "❌"
                    } 
                    <span style="margin-left: 10px;">Ricezione dati</span>
                </li>
                <li style="padding: 8px 0; display: flex; align-items: center;">
                    ${FeedbackSystem.feedbackStates.dataWriting ? "✅" : "❌"} 
                    <span style="margin-left: 10px;">Scrittura dati</span>
                </li>
            </ul>
        </div>
    `;

  data.forEach((activity, index) => {
    const parts = activity.split(" ");
    const isBnB =
      parts.includes("Martiri") ||
      parts.includes("Dalmazia") ||
      parts.includes("Nuovo-CameraGrande") ||
      parts.includes("Nuovo-CameraPiccola");

    content += `
            <div style="margin-bottom: 30px; background: #2c3e50; padding: 20px; border-radius: 12px; border: 2px solid #3498db;">
                <h2 style="color: #3498db; text-align: center; margin-bottom: 20px; font-size: 1.3em; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
                    📋 Bigliettino ${index + 1}
                </h2>
                <div style="margin-bottom: 20px; background: #34495e; padding: 15px; border-radius: 8px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="border-bottom: 1px solid #546e7a;">
                            <th style="padding: 12px; text-align: left; color: #bdc3c7;">Data</th>
                            <td style="padding: 12px; color: #fff;">${
                              parts[0]
                            }</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #546e7a;">
                            <th style="padding: 12px; text-align: left; color: #bdc3c7;">Dipendente1</th>
                            <td style="padding: 12px; color: #fff;">${
                              parts[1]
                            } ${parts[2]}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #546e7a;">
                            <th style="padding: 12px; text-align: left; color: #bdc3c7;">Dipendente2</th>
                            <td style="padding: 12px; color: #fff;">${
                              parts[3]
                            } ${parts[4]}</td>
                        </tr>
                        <tr>
                            <th style="padding: 12px; text-align: left; color: #bdc3c7;">${
                              isBnB ? "BnB" : "Appartamento"
                            }</th>
                            <td style="padding: 12px; color: #fff;">${
                              parts[5]
                            }</td>
                        </tr>
                    </table>
                </div>
                ${
                  isBnB
                    ? `
                   <div style="margin-bottom: 30px; background: #2c3e50; padding: 20px; border-radius: 12px; border: 2px solid #3498db;">
        <h2 style="color: #3498db; text-align: center; margin-bottom: 20px; font-size: 1.3em; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
            📋 Bigliettino ${index + 1}
        </h2>
        <div style="margin-bottom: 20px; background: #34495e; padding: 15px; border-radius: 8px;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #546e7a;">
                    <th style="padding: 12px; text-align: left; color: #bdc3c7;">CheckOut</th>
                    <td style="padding: 12px; color: #fff;">${parts[6]}</td>
                </tr>
                <tr style="border-bottom: 1px solid #546e7a;">
                    <th style="padding: 12px; text-align: left; color: #bdc3c7;">Refresh</th>
                    <td style="padding: 12px; color: #fff;">${parts[7]}</td>
                </tr>
                <tr style="border-bottom: 1px solid #546e7a;">
                    <th style="padding: 12px; text-align: left; color: #bdc3c7;">Refresh Approfondito</th>
                    <td style="padding: 12px; color: #fff;">${parts[8]}</td>
                </tr>
                <tr style="border-bottom: 1px solid #546e7a;">
                    <th style="padding: 12px; text-align: left; color: #bdc3c7;">AreaComune</th>
                    <td style="padding: 12px; color: #fff;">${parts[9]}</td>
                </tr>
                <tr>
                    <th style="padding: 12px; text-align: left; color: #bdc3c7;">OreExtra</th>
                    <td style="padding: 12px; color: #fff;">${parts[10]}</td>
                </tr>
            </table>
        </div>
`
                
                    : ""
                }
                <div style="margin-bottom: 20px; background: #34495e; padding: 15px; border-radius: 8px;">
                    <h3 style="color: #fff; margin-bottom: 15px; font-size: 1.2em;">🧺 Biancheria</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="border-bottom: 1px solid #546e7a;">
                            <th style="padding: 12px; text-align: left; color: #bdc3c7;">Tipo</th>
                            ${
                              isBnB
                                ? `
                                <th style="padding: 12px; text-align: left; color: #bdc3c7;">Sporco</th>
                                <th style="padding: 12px; text-align: left; color: #bdc3c7;">Pulito</th>
                                <th style="padding: 12px; text-align: left; color: #bdc3c7;">Magazzino</th>
                            `
                                : `
                                <th style="padding: 12px; text-align: left; color: #bdc3c7;">Quantità</th>
                            `
                            }
                        </tr>
                        ${generateBiancheriaRows(parts, isBnB)}
                    </table>
                </div>
            </div>
        `;
  });

  modalContent.innerHTML = `
        <div style="position: relative;">
            ${content}
            <button onclick="document.getElementById('customPopup').remove()" 
                    style="background: #3498db; color: white; border: none; padding: 10px 20px; 
                           border-radius: 5px; cursor: pointer; display: block; margin: 20px auto 0;
                           transition: background 0.3s;">
                Chiudi
            </button>
        </div>
    `;

  popup.appendChild(modalContent);
  document.body.appendChild(popup);
}

function generateBiancheriaRows(parts, isBnB) {
  const biancheriaIndex = parts.indexOf("Biancheria:") + 1;
  let rows = "";

  for (let i = biancheriaIndex; i < parts.length; i += isBnB ? 4 : 2) {
    rows += `
            <tr style="border-bottom: 1px solid #546e7a;">
                <td style="padding: 12px; color: #fff;">${parts[i]}</td>
                ${
                  isBnB
                    ? `
                    <td style="padding: 12px; color: #fff;">${parts[i + 1]}</td>
                    <td style="padding: 12px; color: #fff;">${parts[i + 2]}</td>
                    <td style="padding: 12px; color: #fff;">${parts[i + 3]}</td>
                `
                    : `
                    <td style="padding: 12px; color: #fff;">${parts[i + 1]}</td>
                `
                }
            </tr>
        `;
  }

  return rows;
}

// Funzione per chiudere il popup
function closePopup() {
  const popup = document.querySelector(".popup");
  if (popup) {
    popup.remove();
    // Ripristina lo scroll del body
    document.body.style.overflow = "";
  }
}
// Funzione per mostrare messaggi di feedback
function showMessage(text, type) {
  const messageEl = document.getElementById("message");
  messageEl.textContent = text;
  messageEl.className = `mt-3 alert alert-${type}`;
  messageEl.style.display = "block";
  setTimeout(() => {
    messageEl.style.display = "none";
  }, 5000);
}

// Funzione per caricare le opzioni dei select
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

// Funzione per aggiungere un'attività
async function addActivity(type) {
  if (type === "bnb") {
    await addBnBActivity();
  } else {
    await addAppartamentiActivity();
  }
}
// Funzione per aggiungere un'attività di tipo appartamento
async function addAppartamentiActivity() {
  const activitiesContainer = document.getElementById("activitiesContainer");
  const activityIndex = activitiesContainer.children.length;

  const dipendentiOptions = await loadOptions("dipendenti");
  const locationOptions = await loadOptions("nomi_Appartamenti");
  const dipendentiHtml = dipendentiOptions
    .map((option) => `<option value="${option.value}">${option.text}</option>`)
    .join("");
  const locationHtml = locationOptions
    .map((option) => `<option value="${option.value}">${option.text}</option>`)
    .join("");

  const canovaccioOptions = ['<option value="">Canovaccio</option>']
    .concat(
      Array.from({ length: 31 }, (_, i) => `<option value="${i}">${i}</option>`)
    )
    .join("");
  const matrimonialeOptions = ['<option value="">Matrimoniale</option>']
    .concat(
      Array.from({ length: 31 }, (_, i) => `<option value="${i}">${i}</option>`)
    )
    .join("");
  const singoloOptions = ['<option value="">Singolo</option>']
    .concat(
      Array.from({ length: 31 }, (_, i) => `<option value="${i}">${i}</option>`)
    )
    .join("");
  const federaOptions = ['<option value="">Federa</option>']
    .concat(
      Array.from({ length: 31 }, (_, i) => `<option value="${i}">${i}</option>`)
    )
    .join("");
  const visoOptions = ['<option value="">Viso</option>']
    .concat(
      Array.from({ length: 31 }, (_, i) => `<option value="${i}">${i}</option>`)
    )
    .join("");
  const bidetOptions = ['<option value="">Bidet</option>']
    .concat(
      Array.from({ length: 31 }, (_, i) => `<option value="${i}">${i}</option>`)
    )
    .join("");
  const corpoOptions = ['<option value="">Corpo</option>']
    .concat(
      Array.from({ length: 31 }, (_, i) => `<option value="${i}">${i}</option>`)
    )
    .join("");
  const scendibagnoOptions = ['<option value="">Scendibagno</option>']
    .concat(
      Array.from({ length: 31 }, (_, i) => `<option value="${i}">${i}</option>`)
    )
    .join("");

  const activityHtml = `
    <div class="activity-group mb-3" id="activity${activityIndex}" data-type="appartamenti">
        <h4>Appartamento ${activityIndex + 1}</h4>
        <div class="row mb-2">
            <div class="col">
                <select class="form-select" name="nome${activityIndex}" required>
                    <option value="" hidden selected>Dipendente1</option>
                    ${dipendentiHtml}
                </select>
            </div>
            <div class="col">
                <select class="form-select" name="nome2${activityIndex}" required>
                    <option value="" hidden selected>Dipendente2</option>
                    ${dipendentiHtml}
                </select>
            </div>
        </div>
        <div class="row mb-2">
            <div class="col">
                <div class="input-group">
                    <span class="input-group-text">Data</span>
                    <input type="date" class="form-control" id="data${activityIndex}" name="data${activityIndex}" required>
                </div>
            </div>
            <div class="col">
                <select class="form-select" name="appartamenti${activityIndex}" required>
                    <option value="" hidden selected>appartamento</option>
                    ${locationHtml}
                </select>
            </div>
        </div>
        <div class="activity-group mb-3" id="activity${activityIndex}" data-type="appartamenti">
            <div class="row mb-2">
                <h5>Biancheria sporca</h5>
                <div class="col">
                    <select class="form-select" name="canovaccio${activityIndex}">
                        ${canovaccioOptions}
                    </select>
                </div>
                <div class="col">
                    <select class="form-select" name="matrimoniale${activityIndex}">
                        ${matrimonialeOptions}
                    </select>
                </div>
            </div>
            <div class="row mb-2">
                <div class="col">
                    <select class="form-select" name="singolo${activityIndex}">
                        ${singoloOptions}
                    </select>
                </div>
                <div class="col">
                    <select class="form-select" name="federa${activityIndex}">
                        ${federaOptions}
                    </select>
                </div>
            </div>
            <div class="row mb-2">
                <div class="col">
                    <select class="form-select" name="viso${activityIndex}">
                        ${visoOptions}
                    </select>
                </div>
                <div class="col">
                    <select class="form-select" name="bidet${activityIndex}">
                        ${bidetOptions}
                    </select>
                </div>
            </div>
            <div class="row mb-2">
                <div class="col">
                    <select class="form-select" name="corpo${activityIndex}">
                        ${corpoOptions}
                    </select>
                </div>
                <div class="col">
                    <select class="form-select" name="scendibagno${activityIndex}">
                        ${scendibagnoOptions}
                    </select>
                </div>
            </div>
        </div>
        <button type="button" class="btn btn-danger" onclick="deleteActivity(${activityIndex})">Elimina</button>
    </div>
`;

  activitiesContainer.insertAdjacentHTML("beforeend", activityHtml);
}

// Funzione per aggiungere un'attività di tipo BnB
async function addBnBActivity() {
  const activitiesContainer = document.getElementById("activitiesContainer");
  const activityIndex = activitiesContainer.children.length;

  const dipendentiOptions = await loadOptions("dipendenti");
  const dipendentiHtml = dipendentiOptions
    .map((option) => `<option value="${option.value}">${option.text}</option>`)
    .join("");

  const bnbOptions = [
    "Martiri",
    "Dalmazia",
    "Nuovo-CameraGrande",
    "Nuovo-CameraPiccola",
  ];
  const bnbHtml = bnbOptions
    .map((option) => `<option value="${option}">${option}</option>`)
    .join("");

  // Generazione delle opzioni per i vari select
  const generateOptions = (max, step = 1, showDecimals = false) =>
    [""]
      .concat(
        Array.from({ length: max }, (_, i) => {
          const value = i * step;
          return `<option value="${
            showDecimals ? value.toFixed(1) : Math.floor(value)
          }">${showDecimals ? value.toFixed(1) : Math.floor(value)}</option>`;
        })
      )
      .join("");

  const checkOutRefreshOptions = generateOptions(10); // No decimals
  const areaComuneOptions = generateOptions(4); // No decimals
  const oreExtraOptions = generateOptions(10, 0.5, true); // Show decimals for ore extra

  const biancheriaTypes = [
    "matrimoniale",
    "federa",
    "viso",
    "corpo",
    "bidet",
    "scendibagno",
  ];
  const biancheriaHtml = biancheriaTypes
    .map(
      (type) => `
        <div class="row mb-2">
            <div class="col">
                <label>${type.charAt(0).toUpperCase() + type.slice(1)}</label>
                <div class="input-group">
                    <select style="color:red" class="form-select" name="${type}Sporco${activityIndex}" required>
                        <option value="" hidden selected>Sporco</option>
                        ${generateOptions(31)}
                    </select>
                    <select style="color:blue" class="form-select" name="${type}Pulito${activityIndex}" required>
                        <option value="" hidden selected>Pulito</option>
                        ${generateOptions(31)}
                    </select>
                    <select style="color:green" class="form-select" name="${type}Magazzino${activityIndex}">
                        <option value="" hidden selected>Magazzino</option>                            ${generateOptions(
                          31
                        )}
                    </select>
                </div>
            </div>
        </div>
    `
    )
    .join("");

  const activityHtml = `
        <div class="activity-group mb-3" id="activity${activityIndex}" data-type="bnb">
            <h4>BnB ${activityIndex + 1}</h4>
            <div class="row mb-2">
                <div class="col">
                    <select class="form-select" name="nome${activityIndex}" required>
                        <option value="" hidden selected>Dipendente1</option>
                        ${dipendentiHtml}
                    </select>
                </div>
                <div class="col">
                    <select class="form-select" name="nome2${activityIndex}" required>
                        <option value="" hidden selected>Dipendente2</option>
                        ${dipendentiHtml}
                    </select>
                </div>
            </div>
            <div class="row mb-2">
                <div class="col">
                    <div class="input-group">
                        <span class="input-group-text">Data</span>
                        <input type="date" class="form-control" id="data${activityIndex}" name="data${activityIndex}" required>
                    </div>
                </div>
                <div class="col">
                    <select class="form-select" name="bnb${activityIndex}" required>
                        <option value="" hidden selected>BnB</option>
                        ${bnbHtml}
                    </select>
                </div>
            </div>
            <h5>Biancheria</h5>
            ${biancheriaHtml}
            <h5>Bigliettino Aggiuntive</h5>
            <div class="mb-2">
                <div class="mb-2">
                    <select class="form-select" name="checkOut${activityIndex}" required>
                        <option value="" hidden selected>CheckOut</option>
                        ${checkOutRefreshOptions}
                    </select>
                </div>
                <div class="mb-2">
                    <select class="form-select" name="refresh${activityIndex}" required>
                        <option value="" hidden selected>Refresh</option>
                        ${checkOutRefreshOptions}
                    </select>
                </div>
                    <!-- Add the new field here -->
    <div class="mb-2">
        <select class="form-select" name="refreshApprofondito${activityIndex}" required>
            <option value="" hidden selected>Refresh Approfondito</option>
            ${checkOutRefreshOptions}
        </select>
    </div>
                <div class="mb-2">
                    <select class="form-select" name="areaComune${activityIndex}" required>
                        <option value="" hidden selected>AreaComune</option>
                        ${areaComuneOptions}
                    </select>
                </div>
                <div class="mb-2">
                    <select class="form-select" name="oreExtra${activityIndex}">
                        <option value="" hidden selected>OreExtra</option>
                        ${oreExtraOptions}
                    </select>
                </div>
                <button type="button" class="btn btn-danger" onclick="deleteActivity(${activityIndex})">Elimina</button>
            </div>
        </div>
    `;

  activitiesContainer.insertAdjacentHTML("beforeend", activityHtml);

  updateBnBColors(activityIndex);
}

// Funzione per eliminare un'attività
function deleteActivity(index) {
  const activityElement = document.getElementById(`activity${index}`);
  if (activityElement) {
    activityElement.remove();
  }
}

// Event listeners per i pulsanti di aggiunta attività e invio form
document
  .getElementById("addAppartamentiBtn")
  .addEventListener("click", () => addActivity("appartamenti"));
document
  .getElementById("addBnBBtn")
  .addEventListener("click", () => addActivity("bnb"));
document
  .getElementById("registrationForm")
  .addEventListener("submit", handleFormSubmit);

// Funzione per gestire l'invio del form
async function handleFormSubmit(e) {
  e.preventDefault();

  const submitBtn = document.getElementById("submitBtn");
  if (submitBtn.disabled) {
    return;
  }

  if (!validateForm()) {
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Invio in corso...";

  FeedbackSystem.reset();
  FeedbackSystem.updateFeedback("validazioneDati", true);

  const formData = new FormData(e.target);
  const data = [];

  showMessage("Preparazione dei dati in corso...", "info");

  const activityGroups = e.target.querySelectorAll(".activity-group");
  const processedIndices = new Set();

  for (let group of activityGroups) {
    const type = group.dataset.type;
    const index = group.id.replace("activity", "");

    if (processedIndices.has(index)) {
      continue;
    }

    let formattedData;
    if (type === "bnb") {
      formattedData = formatBnBData(formData, index);
    } else if (type === "appartamenti") {
      formattedData = formatAppartamentiData(formData, index);
    }

    if (formattedData) {
      data.push(formattedData);
      processedIndices.add(index);
    }
  }

  FeedbackSystem.updateFeedback("dataFormatting", true);
  console.log("Dati formattati:", data);

  if (data.some((item) => item === null)) {
    showMessage("Alcuni dati sono mancanti o non validi", "danger");
    resetSubmitButton(submitBtn);
    return;
  }

  if (data.length === 0) {
    showMessage("Aggiungi almeno un'attività prima di inviare", "danger");
    resetSubmitButton(submitBtn);
    return;
  }

  showMessage("Invio dei dati in corso...", "info");

  try {
    FeedbackSystem.updateFeedback("dataSending", true);
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbz1NH7RqbK0syG1A6StXwtnm63_C0PL2cqkyuEWi7Xsdv5iLMiaHtD8EjkZYtL628st/exec",
      {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    FeedbackSystem.updateFeedback("dataReceiving", true);
    FeedbackSystem.updateFeedback("dataWriting", true);
    FeedbackSystem.updateFeedback("salvataggioDati", true);
    FeedbackSystem.updateFeedback("completamento", true);
    FeedbackSystem.complete();

    handleResponse(
      { status: "success", message: "Dati inviati con successo" },
      data
    );
  } catch (error) {
    console.error("Error:", error);
    handleResponse({
      status: "error",
      message: "Errore durante l'invio: " + error.message,
    });
  } finally {
    resetSubmitButton(submitBtn);
  }
}

// Funzione per formattare i dati BnB
function formatBnBData(formData, index) {
  const date = formData.get(`data${index}`);
  const nome1 = formData.get(`nome${index}`);
  const nome2 = formData.get(`nome2${index}`);
  const bnb = formData.get(`bnb${index}`);

  if (!date || !nome1 || !nome2 || !bnb) {
    showMessage(`Dati mancanti per l'attività BnB ${index + 1}`, "warning");
    return null;
  }

  const checkOut = formData.get(`checkOut${index}`) || "0";
  const refresh = formData.get(`refresh${index}`) || "0";
  const refreshApprofondito =
    formData.get(`refreshApprofondito${index}`) || "0"; // Add this line
  const areaComune = formData.get(`areaComune${index}`) || "0";
  const oreExtra = formData.get(`oreExtra${index}`) || "0";

  let formattedData = `${date} ${nome1} ${nome2} ${bnb} ${checkOut} ${refresh} ${refreshApprofondito} ${areaComune} ${oreExtra} Biancheria:`; // Modified this line

  const biancheriaTypes = [
    "matrimoniale",
    "federa",
    "viso",
    "corpo",
    "bidet",
    "scendibagno",
  ];

  biancheriaTypes.forEach((type) => {
    const sporco = formData.get(`${type}Sporco${index}`) || "0";
    const pulito = formData.get(`${type}Pulito${index}`) || "0";
    const magazzino = formData.get(`${type}Magazzino${index}`) || "0";
    formattedData += ` ${type} ${sporco} ${pulito} ${magazzino}`;
  });

  return formattedData;
}

// Funzione per formattare i dati degli appartamenti
function formatAppartamentiData(formData, index) {
  const date = formData.get(`data${index}`);
  const nome1 = formData.get(`nome${index}`);
  const nome2 = formData.get(`nome2${index}`);
  const appartamento = formData.get(`appartamenti${index}`);

  if (!date || !nome1 || !nome2 || !appartamento) {
    showMessage(
      `Dati mancanti per l'attività Appartamenti ${index + 1}`,
      "warning"
    );
    return null;
  }

  let formattedData = `${date} ${nome1} ${nome2} ${appartamento} Biancheria:`;

  const biancheriaTypes = [
    "canovaccio",
    "matrimoniale",
    "singolo",
    "federa",
    "viso",
    "bidet",
    "corpo",
    "scendibagno",
    
  ];

  biancheriaTypes.forEach((type) => {
    const quantita = formData.get(`${type}${index}`) || "0";
    formattedData += ` ${type} ${quantita}`;
  });

  return formattedData;
}

// Funzione per validare il form
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

// Funzione per gestire la risposta del server
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

// Funzione per aggiornare i colori dei BnB
function updateBnBColors(activityIndex) {
  const activity = document.getElementById(`activity${activityIndex}`);
  if (!activity) {
    console.warn(`Elemento activity${activityIndex} non trovato`);
    return;
  }

  const bnbSelect = activity.querySelector(
    `select[name="bnb${activityIndex}"]`
  );
  if (!bnbSelect) {
    console.warn(`Select BnB non trovato per activity${activityIndex}`);
    return;
  }

  const allSelectors = activity.querySelectorAll("select");
  const dateInput = activity.querySelector('input[type="date"]');

  const updateColors = () => {
    const selectedBnB = bnbSelect.value;
    let color;
    switch (selectedBnB) {
      case "Martiri":
        color = "#1E2F97"; // Deep Royal Blue
        break;
      case "Nuovo-CameraGrande":
        color = "#2D0F42"; // Deep Purple
        break;
      case "Nuovo-CameraPiccola":
        color = "#0F4C41"; // Dark Teal
        break;
      case "Dalmazia":
        color = "#8B0000"; // Dark Red
        break;
      default:
        color = "";
    }

    allSelectors.forEach((selector) => {
      selector.style.setProperty("background-color", color, "important");
    });

    if (dateInput) {
      dateInput.style.setProperty("background-color", color, "important");
    }
  };

  bnbSelect.addEventListener("change", updateColors);
  updateColors();
}

// Funzione per resettare il pulsante di invio
function resetSubmitButton(button) {
  setTimeout(() => {
    button.disabled = false;
    button.textContent = "Registra";
  }, 5000);
}

// Funzione per ordinare le opzioni dei select
function sortSelectOptions(select) {
  let options = Array.from(select.options);
  let firstOption = options.shift();

  let isNumeric = options.every((option) => !isNaN(option.text.trim()));

  if (!isNumeric) {
    options.sort((a, b) => a.text.localeCompare(b.text));
  }

  select.innerHTML = "";
  select.appendChild(firstOption);
  options.forEach((option) => select.appendChild(option));
}

// Funzione per ordinare tutti i select
function sortAllSelects() {
  document.querySelectorAll("select").forEach(sortSelectOptions);
}

// Funzione per configurare l'ordinamento dei select
function setupSelectSorting() {
  sortAllSelects();

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName.toLowerCase() === "select") {
            sortSelectOptions(node);
          } else {
            node.querySelectorAll("select").forEach(sortSelectOptions);
          }
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Esegui la funzione quando il DOM è completamente caricato
document.addEventListener("DOMContentLoaded", setupSelectSorting);
