/* INIZIALIZZAZIONE APPLICAZIONE */
// Aggiungi all'inizio del file
const dipendenti = employees.map(emp => emp.name);


function checkAuth() {
    const loggedUser = sessionStorage.getItem('loggedUser');
    if (!loggedUser || !employees.some(emp => emp.name === loggedUser)) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function logout() {
    sessionStorage.removeItem('loggedUser');
    window.location.href = 'login.html';
}


const API_ENDPOINTS = {
    WRITE: 'https://script.google.com/macros/s/AKfycby5Ektnaanro8B1KQxw6JW422HjkDoWEacbrZZnyqRVl5fCsOJUj4zblOXREbJ0CgtiWg/exec'
};
const FeedbackSystem = {
    feedbackStates: {
        dataFormatting: false,
        dataSending: false,
        dataReceiving: false,
        dataWriting: false
    },

    progress: 0,

    updateFeedback(step, status) {
        this.feedbackStates[step] = status;
        this.updateProgress();
    },

    updateProgress() {
        const totalSteps = Object.keys(this.feedbackStates).length;
        const completedSteps = Object.values(this.feedbackStates).filter(status => status).length;
        this.progress = (completedSteps / totalSteps) * 100;
        this.renderProgress();
    },

    renderProgress() {
        let progressContainer = document.getElementById('progressContainer');
        if (!progressContainer) {
            progressContainer = document.createElement('div');
            progressContainer.id = 'progressContainer';
            progressContainer.className = 'progress-container';
            document.body.appendChild(progressContainer);
        }

        const currentStep = Object.entries(this.feedbackStates).find(([, status]) => !status)?.[0];
        const stepText = currentStep ? this.getStepText(currentStep) : 'Completato';

        progressContainer.innerHTML = `
            <div class="progress-modal">
                <h2 class="progress-title">✨ Invio in corso</h2>
                <div class="progress-content">
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${this.progress}%"></div>
                    </div>
                    <div class="progress-text">${stepText}</div>
                    <div class="progress-percentage">${Math.round(this.progress)}%</div>
                </div>
            </div>
        `;

        // Aggiungi stili CSS
        if (!document.getElementById('progress-styles')) {
            const styles = document.createElement('style');
            styles.id = 'progress-styles';                
            document.head.appendChild(styles);
        }
    },

    getStepText(step) {
        const stepTexts = {
            dataFormatting: '📝 Formattazione dati in corso...',
            dataSending: '📤 Invio dati in corso...',
            dataReceiving: '📥 Ricezione dati in corso...',
            dataWriting: '💾 Scrittura dati in corso...'
        };
        return stepTexts[step] || '';
    },

    reset() {
        Object.keys(this.feedbackStates).forEach(key => {
            this.feedbackStates[key] = false;
        });
        this.progress = 0;
        const progressContainer = document.getElementById('progressContainer');
        if (progressContainer) {
            progressContainer.remove();
        }
    },

    complete() {
        const progressContainer = document.getElementById('progressContainer');
        if (progressContainer) {
            setTimeout(() => progressContainer.remove(), 500);
        }
    }
};

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
        this.populateDipendentiSelect(); // Aggiungi questa riga
        this.initializeForm();
        this.renderActivityButtons();

        // Imposta il dipendente loggato
        const loggedUser = sessionStorage.getItem('loggedUser');
        if (loggedUser) {
            const usernameSelect = document.getElementById('username');
            usernameSelect.value = loggedUser;
            usernameSelect.disabled = true; // Blocca la modifica
        }
    },

    populateDipendentiSelect() {
        const select = document.getElementById('username');
        if (select) {
            // Sort dipendenti array alphabetically
            const sortedDipendenti = [...dipendenti].sort((a, b) =>
                a.localeCompare(b, 'it', { sensitivity: 'base' })
            );

            // Create and append options
            sortedDipendenti.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                select.appendChild(option);
            });
        }
    }
    ,
    // Cache degli elementi DOM principali
    cacheElements() {
        this.form = document.getElementById('registrationForm');
        this.festaCheckbox = document.getElementById('festaCheckbox');
        this.activitiesContainer = document.getElementById('activitiesContainer');
        this.submitBtn = document.getElementById('submitBtn');
        this.messageEl = document.getElementById('message');
    },
    // Gestione submit del form


    async handleSubmit(e) {
        e.preventDefault();
        if (this.submitBtn.disabled) return;

        if (!this.festaCheckbox.checked && !this.checkPeopleSelected()) {
            this.showMessage('Seleziona il numero di persone per tutte le attività', 'danger');
            return;
        }

        const data = this.collectFormData();
        if (!this.validateData(data)) return;
        await this.sendData(data);
    },

    // Binding degli eventi principali
    toggleActivityFields() {
        const isFestaChecked = this.festaCheckbox.checked;
        this.activitiesContainer.style.display = isFestaChecked ? 'none' : 'block';
        document.getElementById('activityButtons').style.display = isFestaChecked ? 'none' : 'flex';
    },
    // Poi il tuo bindEvents esistente
    bindEvents() {
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
        }
        if (this.festaCheckbox) {
            this.festaCheckbox.addEventListener('change', this.toggleActivityFields.bind(this));
        }
    },
    // Inizializzazione del date picker
    initializeDatePicker() {
        const dateInput = document.getElementById('date');
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
    
        // Format functions
        const formatDisplay = date => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        };
    
        const formatISO = date => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${year}-${month}-${day}`;
        };
    
        // Set initial values
        dateInput.type = 'text';
        dateInput.value = formatDisplay(today);
    
        // Create hidden input for form submission
        const hiddenDateInput = document.createElement('input');
        hiddenDateInput.type = 'hidden';
        hiddenDateInput.name = 'hiddenDate';
        hiddenDateInput.value = formatISO(today);
        dateInput.after(hiddenDateInput);
    
        // Create date picker input
        const pickerInput = document.createElement('input');
        pickerInput.type = 'date';
        pickerInput.style.position = 'absolute';
        pickerInput.style.opacity = '0';
        pickerInput.value = formatISO(today);
        pickerInput.min = formatISO(yesterday);
        pickerInput.max = formatISO(today);
        dateInput.after(pickerInput);
    
        // Event handlers
        dateInput.addEventListener('click', () => {
            pickerInput.showPicker();
        });
    
        pickerInput.addEventListener('change', (e) => {
            const selectedDate = new Date(e.target.value);
            dateInput.value = formatDisplay(selectedDate);
            hiddenDateInput.value = formatISO(selectedDate);
        });
    
        // Make visible input readonly
        dateInput.readOnly = true;
    },
    


    /* GESTIONE DELLE ATTIVITÀ E RENDERING */
    // Configurazione iniziale del form e sorting delle select
    setupSelectSorting() {
        const sortSelectOptions = select => {
            // Get all options except the first one (placeholder)
            const options = Array.from(select.options);
            const firstOption = options.shift();

            // Sort remaining options alphabetically
            options.sort((a, b) => a.text.localeCompare(b.text, 'it', { sensitivity: 'base' }));

            // Clear and rebuild select
            select.innerHTML = '';
            select.appendChild(firstOption);
            options.forEach(option => select.appendChild(option));
        };

        // Sort all existing selects
        document.querySelectorAll('select').forEach(sortSelectOptions);

        // Watch for new selects being added
        new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.tagName === 'SELECT') {
                            sortSelectOptions(node);
                        }
                        node.querySelectorAll('select').forEach(sortSelectOptions);
                    }
                });
            });
        }).observe(document.body, { childList: true, subtree: true });
    }
    ,

    // Inizializzazione del form
    initializeForm() {
        this.toggleActivityFields();
    },

    // Rendering dei pulsanti delle attività
    renderActivityButtons() {
        const buttonContainer = document.getElementById('activityButtons');
        const buttons = [
            { id: 'addCantiereBtn', text: 'Cantiere', color: '#006669' },
            { id: 'addAppartamentiBtn', text: 'Appartamenti', color: '#B71C6B' },
            { id: 'addBnBBtn', text: 'BnB', color: '#B38F00' },
            { id: 'addPstBtn', text: 'PST', color: '#283593' }
        ];

        this.activityColors = {
            cantiere: '#006669',
            appartamenti: '#B71C6B',
            bnb: '#B38F00',
            pst: '#283593'
        };

        buttons.forEach(button => {
            const btnHtml = `
                <div class="col-12 mb-2">
                    <button type="button" class="btn w-100 fw-bold" id="${button.id}"
                        style="background-color: ${button.color} !important; color: #FFFFFF !important;">${button.text}</button>
                </div>
            `;
            buttonContainer.insertAdjacentHTML('beforeend', btnHtml);
            document.getElementById(button.id).addEventListener('click', () => this.addActivity(button.text.toLowerCase()));
        });
    },
    /* GESTIONE DELLE SINGOLE ATTIVITÀ */
    // Aggiunta di una nuova attività
    async addActivity(type) {
        const activityIndex = this.activitiesContainer.children.length;
        const backgroundColor = this.activityColors[type];
        const baseStyle = `background-color: ${backgroundColor} !important; color: #FFFFFF !important; padding: 15px !important; border-radius: 5px !important;`;

        let activityHtml = '';
        if (type === 'pst') {
            activityHtml = this.createPSTActivityHtml(activityIndex, baseStyle);
        } else {
            activityHtml = await this.createStandardActivityHtml(type, activityIndex, baseStyle);
        }
        this.activitiesContainer.insertAdjacentHTML('beforeend', activityHtml);
    },

    // Creazione HTML per attività PST
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

    // Creazione HTML per attività standard
    async createStandardActivityHtml(type, index, baseStyle) {
        const options = await this.loadOptionsFromHtml(type);
        const optionsHtml = options.map(option => `<option value="${option.value}">${option.text}</option>`).join('');
        const moltiplicatoreHtml = type === 'bnb' ? this.createMoltiplicatoreHtml(index) : '';

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
                        ${[1, 2, 3, 4].map(num => `<option value="${num}" ${num === 2 ? 'selected' : ''}>${num}</option>`).join('')}
                    </select>
                </div>
                <button type="button" class="btn btn-danger delete-btn" onclick="App.deleteActivity(${index})">Elimina</button>
            </div>
        `;
    },

    // Creazione HTML per il moltiplicatore
    createMoltiplicatoreHtml(index) {
        return `
            <select class="form-select mb-2" name="moltiplicatore${index}" required>
                <option value="">Moltiplicatore</option>
                ${Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}
            </select>
        `;
    },

    // Caricamento opzioni da HTML
    async loadOptionsFromHtml(type) {
        const optionsMap = {
            cantiere: uffici,
            bnb: bnb,
            appartamenti: appartamenti
        };
        return (optionsMap[type] || []).map(item => {
            const [text, value] = item.split('|');
            return { text, value: `${text}|${value}` };
        });
    },

    // Aggiornamento minuti
    updateMinutes(selectElement, index) {
        const [, minutes] = selectElement.value.split('|');
        const minutesInput = document.querySelector(`[name="minutes${index}"]`);
        minutesInput.value = minutes || '';
        minutesInput.readOnly = !!minutes;
    },

    // Eliminazione attività
    deleteActivity(index) {
        document.getElementById(`activity${index}`)?.remove();
    },
    /* GESTIONE VALIDAZIONE E INVIO DATI */
    // Controllo delle persone selezionate
    checkPeopleSelected() {
        return Array.from(document.querySelectorAll('.activity-group')).every(group =>
            group.dataset.type === 'pst' || group.querySelector('select[name^="people"]').value !== ''
        );
    },
    // Raccolta dati del form
    collectFormData() {
        const data = {
            username: document.getElementById('username').value, // Prendi il valore direttamente
            date: document.getElementById('date').value,
            activities: []
        };

        if (this.festaCheckbox.checked) {
            data.activities.push(this.createFestaActivity());
        } else {
            const activityGroups = this.form.querySelectorAll('.activity-group');
            activityGroups.forEach(group => {
                const activityData = this.getActivityData(group);
                if (activityData) data.activities.push(activityData);
            });
        }

        return data;
    },


    // Creazione attività festa
    createFestaActivity() {
        return {
            activityType: 'festa',
            activity: 'Riposo',
            minutes: '0',
            people: '1',
            moltiplicatore: '0'
        };
    },

    // Estrazione dati attività
    getActivityData(group) {
        const type = group.dataset.type;
        const activityInput = type === 'pst' ?
            group.querySelector('input[name^="activity"]') :
            group.querySelector('select[name^="activity"]');
        const minutesInput = group.querySelector('input[name^="minutes"]');
        const peopleInput = type === 'pst' ?
            group.querySelector('input[name^="people"][type="hidden"]') :
            group.querySelector('select[name^="people"]');
        const moltiplicatoreSelect = type === 'bnb' ?
            group.querySelector('select[name^="moltiplicatore"]') : null;

        if (!activityInput || !minutesInput || !peopleInput) {
            console.error('Elementi mancanti nel gruppo di attività:', group);
            return null;
        }

        return {
            activityType: type,
            activity: this.formatActivityValue(type, activityInput),
            minutes: minutesInput.value || '0',
            people: peopleInput.value || '1',
            moltiplicatore: (type === 'bnb' && moltiplicatoreSelect) ?
                (moltiplicatoreSelect.value || '1') : '1'
        };
    },

    // Formattazione valore attività
    formatActivityValue(type, input) {
        if (type === 'pst') return `Pst-${input.value}`;
        const selectedText = input.options[input.selectedIndex]?.text || 'N/A';
        const prefixMap = {
            'bnb': 'BnB',
            'cantiere': 'POR',
            'appartamenti': 'App'
        };
        return `${prefixMap[type] || ''}-${selectedText}`;
    },
    formatData(data) {
        return {
            username: data.username,
            date: data.date,
            activities: data.activities.map(activity => ({
                activityType: activity.activityType,
                activity: activity.activity,
                minutes: activity.minutes,
                people: activity.people,
                moltiplicatore: activity.moltiplicatore || '1'
            }))
        };
    },
    /* GESTIONE INVIO DATI E FEEDBACK UTENTE */
    // Validazione dati prima dell'invio
    validateData(data) {
        if (this.festaCheckbox.checked) return true;
        if (!data.activities.length) {
            this.showMessage('Inserisci almeno un\'attività o seleziona riposo', 'danger');
            return false;
        }
        return true;
    }

    ,

    // Invio dati al server
    // Modify the sendData method to show a loading popup
    // Modifica il metodo sendData nell'oggetto App

    async sendData(data) {
        FeedbackSystem.reset();
        this.submitBtn.disabled = true;

        try {
            const formattedData = this.formatData(data);
            FeedbackSystem.updateFeedback('dataFormatting', true);

            // Invio diretto con un solo retry se necessario
            const success = await this.quickSendData({
                ...formattedData,
                checkValue: `${data.username}_${data.date}_${Date.now()}`
            });

            if (success) {
                // Aggiorna feedback immediatamente
                Object.keys(FeedbackSystem.feedbackStates).forEach(key => {
                    FeedbackSystem.updateFeedback(key, true);
                });
                FeedbackSystem.complete();
                this.handleSuccess(data);
            }
        } catch (error) {
            console.error('Errore:', error);
            this.showMessage('Errore durante l\'invio dei dati', 'danger');
        } finally {
            this.submitBtn.disabled = false;
        }
    },

    async quickSendData(data) {
        try {
            await fetch(API_ENDPOINTS.WRITE, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(data)
            });
            return true;
        } catch (error) {
            console.error('Error sending data:', error);
            return false;
        }
    }
    ,

    // Gestione successo invio
    handleSuccess(data) {
        this.showMessage('Registrazione completata con successo!', 'success');
        this.showPopup(data);
        this.form.reset();
        this.activitiesContainer.innerHTML = '';
    }

    ,
    // Visualizzazione messaggi
    showMessage(text, type) {
        this.messageEl.textContent = text;
        this.messageEl.className = `mt-3 alert alert-${type}`;
        this.messageEl.style.display = 'block';
        setTimeout(() => this.messageEl.style.display = 'none', 5000);
    },

    // Visualizzazione popup di conferma
    showPopup(data) {
        const popup = document.createElement('div');

        // Add modal overlay styling
        popup.setAttribute('style', `
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
        `);

        const modalContent = document.createElement('div');
        modalContent.setAttribute('style', `
            background: #2d3436;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 0 20px rgba(0,0,0,0.8);
            max-width: 800px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            color: #dfe6e9;
        `);

        const feedbackStates = FeedbackSystem.feedbackStates;

        const feedbackSummary = `
        <div style="margin-bottom: 20px; background: #34495e; padding: 15px; border-radius: 8px;">
            <h3 style="color: #fff; margin-bottom: 15px; font-size: 1.2em;">📊 Stato Operazioni</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
                ${Object.entries(feedbackStates).map(([key, value]) => `
                    <li style="padding: 8px 0; display: flex; align-items: center;">
                        ${value ? '✅' : '❌'} 
                        <span style="margin-left: 10px;">${key}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;


        let formattedContent = `
            <h2 style="color: #2ecc71; text-align: center; margin-bottom: 20px; font-size: 1.5em;">
                ✨ Dati inviati con successo
            </h2>
        `;
        formattedContent += feedbackSummary;
        formattedContent += `
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

        if (data.activities.length > 0) {
            formattedContent += `
                <div style="margin-bottom: 20px; background: #34495e; padding: 15px; border-radius: 8px;">
                    <h3 style="color: #fff; margin-bottom: 15px; font-size: 1.2em;">📝 Lista Attività</h3>
                    ${data.activities.map(activity => `
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
                    `).join('')}
                </div>
            `;
        }

        modalContent.innerHTML = `
            <div style="position: relative;">
                ${formattedContent}
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

    // Chiusura popup
    closePopup() {
        const popup = document.body.querySelector('div[style*="position: fixed"]');
        if (popup) {
            popup.remove();
            // Immediate redirect on popup close
            sessionStorage.removeItem('loggedUser');
            window.location.href = 'login.html';
        }
    }
};
// Inizializzazione dell'applicazione al caricamento del DOM
document.addEventListener('DOMContentLoaded', () => App.init());
