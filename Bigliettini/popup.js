const createTableRow = (label, value, isLast = false) => `
    <tr class="${!isLast ? 'table-row' : ''}">
        <th>${label}</th>
        <td>${value}</td>
    </tr>
`;

const createBnBDetails = (parts, index) => `
    <div class="bnb-details">
        <table>
            ${createTableRow("CheckOut", parts[6])}
            ${createTableRow("Refresh", parts[7])}
            ${createTableRow("Refresh Approfondito", parts[8])}
            ${createTableRow("AreaComune", parts[9])}
            ${createTableRow("OreExtra", parts[10])}
            ${createTableRow("Ciabattine", parts[11], true)}
        </table>
    </div>
`;

function showPopup(data) {
    const popup = document.createElement("div");
    popup.id = "customPopup";
    popup.className = "popup";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    let content = `<h2 class="success-title">✨ Dati inviati con successo</h2>`;

    data.forEach((activity, index) => {
        const parts = activity.split(" ");
        const isBnB = parts.includes("Martiri") || 
                     parts.includes("Dalmazia") || 
                     parts.includes("Nuovo-CameraGrande") || 
                     parts.includes("Nuovo-CameraPiccola");

        content += `
            <div class="activity-card">
                <h2 class="card-title">📋 Bigliettino ${index + 1}</h2>
                <div class="info-section">
                    <table>
                        ${createTableRow("Data", parts[0])}
                        ${createTableRow("Dipendente1", `${parts[1]} ${parts[2]}`)}
                        ${createTableRow("Dipendente2", `${parts[3]} ${parts[4]}`)}
                        ${createTableRow(isBnB ? "BnB" : "Appartamento", parts[5], true)}
                    </table>
                </div>
                ${isBnB ? createBnBDetails(parts, index) : ""}
                <div class="biancheria-section">
                    <h3 class="biancheria-title">🧺 Biancheria</h3>
                    <table class="biancheria-table">
                        <tr>
                            <th>Tipo</th>
                            ${isBnB ? `
                                <th>S</th>
                                <th>P</th>
                                <th>M</th>
                            ` : `
                                <th>Quantità</th>
                            `}
                        </tr>
                        ${generateBiancheriaRows(parts, isBnB)}
                    </table>
                </div>
            </div>
        `;
    });

    modalContent.innerHTML = `
        <div class="popup-container">
            ${content}
            <button class="close-button" onclick="document.getElementById('customPopup').remove()">
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
            <tr>
                <td>${parts[i]}</td>
                ${isBnB ? `
                    <td>${parts[i + 1]}</td>
                    <td>${parts[i + 2]}</td>
                    <td>${parts[i + 3]}</td>
                ` : `
                    <td>${parts[i + 1]}</td>
                `}
            </tr>
        `;
    }
    return rows;
}

function showMessage(text, type) {
    const messageEl = document.getElementById("message");
    messageEl.textContent = text;
    messageEl.className = `mt-3 alert alert-${type}`;
    messageEl.style.display = "block";
    setTimeout(() => {
        messageEl.style.display = "none";
    }, 5000);
}
