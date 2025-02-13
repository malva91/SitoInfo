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
    <div class="activity-group mb-3 appartamento" id="activity${activityIndex}" data-type="appartamenti">
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
            <input type="date" class="form-control" name="data${activityIndex}" required>
          </div>
        </div>
        <div class="col">
          <select class="form-select" name="appartamenti${activityIndex}" required>
            <option value="" hidden selected>appartamento</option>
            ${locationHtml}
          </select>
        </div>
      </div>
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
      <button type="button" class="btn btn-danger" onclick="deleteActivity(${activityIndex})">Elimina</button>
    </div>
  `;

  activitiesContainer.insertAdjacentHTML("beforeend", activityHtml);
}

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

function deleteActivity(index) {
  const activityElement = document.getElementById(`activity${index}`);
  if (activityElement) {
    activityElement.remove();
  }
}

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

function setupSelectSorting() {
  const sortAll = () =>
    document.querySelectorAll("select").forEach(sortSelectOptions);
  sortAll();

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
