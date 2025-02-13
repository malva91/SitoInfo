/* INIZIALIZZAZIONE APPLICAZIONE */
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
    WRITE: 'https://script.google.com/macros/s/AKfycbwMERTjmRa8wmpCcjMctZ0PKNfwPhhN5wJC483RlE7cYatNmAUJMkP2AXb3MsyR0GA3/exec'
};

const FeedbackSystem = {
    feedbackStates: {
        connection: false,
        sending: false,
        completed: false
    },

    init() {
        // Reset states
        this.feedbackStates.connection = false;
        this.feedbackStates.sending = false;
        this.feedbackStates.completed = false;
        
        // Remove any existing container
        const existingContainer = document.getElementById('progressContainer');
        if (existingContainer) {
            existingContainer.remove();
        }
    },

    createParticles() {
        let particles = '';
        for(let i = 0; i < 5; i++) {
            particles += `<div class="data-particle active" style="animation-delay: ${i * 0.3}s"></div>`;
        }
        return particles;
    },

    renderProgress(status = '') {
        let progressContainer = document.getElementById('progressContainer');
        if (!progressContainer) {
            progressContainer = document.createElement('div');
            progressContainer.id = 'progressContainer';
            progressContainer.className = 'progress-container';
            document.body.appendChild(progressContainer);
        }

        progressContainer.innerHTML = `
            <div class="data-stream">
                ${this.createParticles()}
                <div class="server-icon">
                    <div class="server-light ${status ? 'active' : ''}"></div>
                </div>
                <div class="progress-text">${status}</div>
            </div>`;
    }
};

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

        const loggedUser = sessionStorage.getItem('loggedUser');
        if (loggedUser) {
            const usernameSelect = document.getElementById('username');
            usernameSelect.value = loggedUser;
            usernameSelect.disabled = true;
        }
    },

    populateDipendentiSelect() {
        const select = document.getElementById('username');
        if (select) {
            const sortedDipendenti = [...dipendenti].sort((a, b) =>
                a.localeCompare(b, 'it', { sensitivity: 'base' })
            );

            sortedDipendenti.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                select.appendChild(option);
            });
        }
    },

    cacheElements() {
        this.form = document.getElementById('registrationForm');
        this.festaCheckbox = document.getElementById('festaCheckbox');
        this.activitiesContainer = document.getElementById('activitiesContainer');
        this.submitBtn = document.getElementById('submitBtn');
        this.messageEl = document.getElementById('message');
    },

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

    toggleActivityFields() {
        const isFestaChecked = this.festaCheckbox.checked;
        this.activitiesContainer.style.display = isFestaChecked ? 'none' : 'block';
        document.getElementById('activityButtons').style.display = isFestaChecked ? 'none' : 'flex';
    },

    bindEvents() {
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
        }
        if (this.festaCheckbox) {
            this.festaCheckbox.addEventListener('change', this.toggleActivityFields.bind(this));
        }
    },

    initializeDatePicker() {
        const dateInput = document.getElementById('date');
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

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

        dateInput.type = 'text';
        dateInput.value = formatDisplay(today);

        const hiddenDateInput = document.createElement('input');
        hiddenDateInput.type = 'hidden';
        hiddenDateInput.name = 'hiddenDate';
        hiddenDateInput.value = formatISO(today);
        dateInput.after(hiddenDateInput);

        const pickerInput = document.createElement('input');
        pickerInput.type = 'date';
        pickerInput.style.position = 'absolute';
        pickerInput.style.opacity = '0';
        pickerInput.value = formatISO(today);
        pickerInput.min = formatISO(yesterday);
        pickerInput.max = formatISO(today);
        dateInput.after(pickerInput);

        dateInput.addEventListener('click', () => {
            pickerInput.showPicker();
        });

        pickerInput.addEventListener('change', (e) => {
            const selectedDate = new Date(e.target.value);
            dateInput.value = formatDisplay(selectedDate);
            hiddenDateInput.value = formatISO(selectedDate);
        });

        dateInput.readOnly = true;
    },

    setupSelectSorting() {
        const sortSelectOptions = select => {
            const options = Array.from(select.options);
            const firstOption = options.shift();
            options.sort((a, b) => a.text.localeCompare(b.text, 'it', { sensitivity: 'base' }));
            select.innerHTML = '';
            select.appendChild(firstOption);
            options.forEach(option => select.appendChild(option));
        };

        document.querySelectorAll('select').forEach(sortSelectOptions);

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
    },

    initializeForm() {
        this.toggleActivityFields();
    },

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

    createMoltiplicatoreHtml(index) {
        return `
            <select class="form-select mb-2" name="moltiplicatore${index}" required>
                <option value="">Moltiplicatore</option>
                ${Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}
            </select>
        `;
    },

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

    updateMinutes(selectElement, index) {
        const [, minutes] = selectElement.value.split('|');
        const minutesInput = document.querySelector(`[name="minutes${index}"]`);
        minutesInput.value = minutes || '';
        minutesInput.readOnly = !!minutes;
    },

    deleteActivity(index) {
        document.getElementById(`activity${index}`)?.remove();
    },

    checkPeopleSelected() {
        return Array.from(document.querySelectorAll('.activity-group')).every(group =>
            group.dataset.type === 'pst' || group.querySelector('select[name^="people"]').value !== ''
        );
    },

    collectFormData() {
        const data = {
            username: document.getElementById('username').value,
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

    createFestaActivity() {
        return {
            activityType: 'festa',
            activity: 'Riposo',
            minutes: '0',
            people: '1',
            moltiplicatore: '0'
        };
    },

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

    validateData(data) {
        if (this.festaCheckbox.checked) return true;
        if (!data.activities.length) {
            this.showMessage('Inserisci almeno un\'attività o seleziona riposo', 'danger');
            return false;
        }
        return true;
    },

    async sendData(data) {
        FeedbackSystem.init(); // Initialize feedback system

        try {
            FeedbackSystem.feedbackStates.connection = true;
            FeedbackSystem.renderProgress('Inizializzazione connessione...');
            await new Promise(resolve => setTimeout(resolve, 800));
            
            FeedbackSystem.feedbackStates.sending = true;
            FeedbackSystem.renderProgress('Invio pacchetti dati...');
            const formattedData = this.formatData(data);
            const success = await this.quickSendData(formattedData);
            
            if (success) {
                FeedbackSystem.feedbackStates.completed = true;
                FeedbackSystem.renderProgress('Dati ricevuti con successo!');
                await new Promise(resolve => setTimeout(resolve, 1000));
                this.handleSuccess(data);
            }
        } catch (error) {
            console.error('Error:', error);
            this.showMessage('Errore durante l\'invio dei dati', 'danger');
        } finally {
            const container = document.getElementById('progressContainer');
            if (container) container.remove();
        }
    }
    ,
    

    async quickSendData(data) {
        try {
            const response = await fetch(API_ENDPOINTS.WRITE, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            return true; // Since no-cors mode doesn't return response details
        } catch (error) {
            console.error('Error sending data:', error);
            return false;
        }
    }
    ,

    handleSuccess(data) {
        const username = document.getElementById('username').value;
        
        this.showMessage('Registrazione completata con successo!', 'success');
        this.showPopup(data);
        
        this.form.reset();
        document.getElementById('username').value = username;
        document.getElementById('username').disabled = true;
        
        this.activitiesContainer.innerHTML = '';
    }
    ,

    showMessage(text, type) {
        this.messageEl.textContent = text;
        this.messageEl.className = `mt-3 alert alert-${type}`;
        this.messageEl.style.display = 'block';
        setTimeout(() => this.messageEl.style.display = 'none', 3000);
    },

    showPopup: function (data) {
        const popup = document.createElement('div');
        popup.classList.add('popup-overlay');

        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        const feedbackStates = FeedbackSystem.feedbackStates;

        const feedbackSummary = `
            <div class="feedback-summary">
                <h3>📊 Stato Operazioni</h3>
                <ul>
                    ${Object.entries(feedbackStates).map(([key, value]) => `
                        <li>
                            ${value ? '✅' : '❌'} 
                            <span>${key}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;

        let formattedContent = `
            <h2>✨ Dati inviati con successo</h2>
        `;
        formattedContent += feedbackSummary;
        formattedContent += `
            <div class="general-info">
                <h3>👤 Informazioni Generali</h3>
                <table>
                    <tr>
                        <th>Dipendente</th>
                        <td>${data.username}</td>
                    </tr>
                    <tr>
                        <th>Data</th>
                        <td>${data.date}</td>
                    </tr>
                </table>
            </div>
        `;

        if (data.activities.length > 0) {
            formattedContent += `
                <div class="activity-list">
                    <h3>📝 Lista Attività</h3>
                    ${data.activities.map(activity => `
                        <div class="activity-item">
                            <div>
                                <strong>Tipo:</strong>
                                <div>${activity.activityType}</div>
                            </div>
                            <div>
                                <strong>Descrizione:</strong>
                                <div>${activity.activity}</div>
                            </div>
                            <div>
                                <strong>Minuti:</strong>
                                <div>${activity.minutes}</div>
                            </div>
                            <div>
                                <strong>Persone:</strong>
                                <div>${activity.people}</div>
                            </div>
                            <div>
                                <strong>Moltiplicatore:</strong>
                                <div>${activity.moltiplicatore}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        modalContent.innerHTML = `
            <div>
                ${formattedContent}
                <button onclick="App.closePopup()" class="close-button">
                    Chiudi
                </button>
            </div>
        `;

        popup.appendChild(modalContent);
        document.body.appendChild(popup);
    },


    closePopup: function () {
        const popup = document.querySelector('.popup-overlay');
        if (popup) {
            document.body.removeChild(popup);
        }
    },
};

document.addEventListener('DOMContentLoaded', () => App.init());

