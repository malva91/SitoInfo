const BIANCHERIA_TYPES = [
  "matrimoniale",
  "federa",
  "viso",
  "corpo",
  "bidet",
  "scendibagno",
];

function generateOptions(max, step = 1) {
  return [""]
    .concat(
      Array.from({ length: max }, (_, i) => {
        const value = step === 1 ? i : (i * step).toFixed(1);
        return `<option value="${value}">${value}</option>`;
      })
    )
    .join("");
}

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

  const standardOptions = generateOptions(10);
  const areaComuneOptions = generateOptions(4);
  const oreExtraOptions = generateOptions(10, 0.5, true);

  const biancheriaHtml = `
<div class="row align-items-center mb-2">
    <div class="col-auto">
        <div class="form-check form-switch">
            <input class="form-check-input custom-switch" type="checkbox" role="switch" id="noBiancheria${activityIndex}">
            <label class="form-check-label" for="noBiancheria${activityIndex}">
                No biancheria
            </label>
        </div>
    </div>
</div>
  ${BIANCHERIA_TYPES
      .map(
        (type) => `
        <div class="row mb-2">
            <div class="col">
                <label>${type.charAt(0).toUpperCase() + type.slice(1)}</label>
                <div class="input-group">
                    <select class="form-select biancheria-select pulito" name="${type}Pulito${activityIndex}" required>
                        <option value="" hidden selected>Pulito</option>
                        ${generateOptions(31)}
                    </select>
                    <select class="form-select biancheria-select sporco" name="${type}Sporco${activityIndex}" required>
                        <option value="" hidden selected>Sporco</option>
                        ${generateOptions(31)}
                    </select>
                    <select class="form-select biancheria-select magazzino" name="${type}Magazzino${activityIndex}">
                        <option value="" hidden selected>Magazzino</option>
                        ${generateOptions(31)}
                    </select>
                </div>
            </div>
        </div>
    `
      )
      .join("")}`;

  const activityHtml = `
    <div class="activity-group mb-3 bnb" id="activity${activityIndex}" data-type="bnb">
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
        <h5>Ciabattine</h5>
        <div class="mb-2">
            <select class="form-select" name="ciabattine${activityIndex}" required>
                <option value="" hidden selected>Ciabattine</option>
                ${standardOptions}
            </select>
        </div>
        <h5>Bigliettino Aggiuntive</h5>
        <div class="mb-2">
            <div class="mb-2">
                <select class="form-select" name="checkOut${activityIndex}" required>
                    <option value="" hidden selected>CheckOut</option>
                    ${standardOptions}
                </select>
            </div>
            <div class="mb-2">
                <select class="form-select" name="refresh${activityIndex}" required>
                    <option value="" hidden selected>Refresh</option>
                    ${standardOptions}
                </select>
            </div>
            <div class="mb-2">
                <select class="form-select" name="refreshApprofondito${activityIndex}" required>
                    <option value="" hidden selected>Refresh Approfondito</option>
                    ${standardOptions}
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

  document.querySelector(`#noBiancheria${activityIndex}`).addEventListener('change', function(e) {
    const activityGroup = e.target.closest('.activity-group');
    const selects = activityGroup.querySelectorAll('.biancheria-select');
    
    if (e.target.checked) {
      selects.forEach(select => {
        select.value = "0";
        select.disabled = true;
      });
    } else {
      selects.forEach(select => {
        select.value = "";
        select.disabled = false;
      });
    }
  });
}

function formatBnBData(formData, index) {
  const baseFields = ["data", "nome", "nome2", "bnb"];
  const values = baseFields.map((field) => formData.get(`${field}${index}`));

  if (values.some((v) => !v)) {
    showMessage(`Dati mancanti per l'attività BnB ${index + 1}`, "warning");
    return null;
  }

  const additionalFields = [
    "checkOut",
    "refresh",
    "refreshApprofondito",
    "areaComune",
    "oreExtra",
    "ciabattine",
  ];
  const additionalValues = additionalFields.map(
    (field) => formData.get(`${field}${index}`) || "0"
  );

  let formattedData = [...values, ...additionalValues, "Biancheria:"].join(" ");

  const biancheriaData = BIANCHERIA_TYPES.map((type) => {
    const values = ["Sporco", "Pulito", "Magazzino"].map(
      (state) => formData.get(`${type}${state}${index}`) || "0"
    );
    return `${type} ${values.join(" ")}`;
  });

  return formattedData + " " + biancheriaData.join(" ");
}

const addActivity = (type) =>
  type === "bnb" ? addBnBActivity() : addAppartamentiActivity();
