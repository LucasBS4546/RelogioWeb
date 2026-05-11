/**
 * alarms.js
 * Gerenciamento de alarmes
 */

class AlarmsManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderAlarms();
    }

    setupEventListeners() {
        // Botão de criar alarme
        const createBtn = document.getElementById('createAlarmBtn');
        if (createBtn) {
            createBtn.addEventListener('click', () => this.handleCreateAlarm());
        }

        // Botão de testar alarme
        const testBtn = document.getElementById('testAlarmBtn');
        if (testBtn) {
            testBtn.addEventListener('click', () => this.handleTestAlarm());
        }

        // Enter no campo de horário
        const timeInput = document.getElementById('alarmTime');
        if (timeInput) {
            timeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleCreateAlarm();
                }
            });
        }
    }

    handleCreateAlarm() {
        const timeInput = document.getElementById('alarmTime');
        const labelInput = document.getElementById('alarmLabel');
        const audioInput = document.getElementById('alarmAudio');

        if (!timeInput.value) {
            alert('Por favor, selecione um horário para o alarme');
            return;
        }

        const alarm = {
            time: timeInput.value,
            label: labelInput.value || 'Alarme',
            audio: audioInput.value || '',
            active: true
        };

        storage.addAlarm(alarm);

        timeInput.value = '';
        labelInput.value = '';
        audioInput.value = '';

        this.renderAlarms();
        this.showMessage('Alarme criado com sucesso!');
    }

    handleTestAlarm() {
        this.showMessage('Tocando alarme de teste...');
        app.playAlarmSound();
        
        setTimeout(() => {
            app.stopAlarm();
        }, 3000);
    }

    renderAlarms() {
        const alarmsList = document.getElementById('alarmsList');
        const alarms = storage.getAlarms();

        if (alarms.length === 0) {
            alarmsList.innerHTML = '<p class="empty-message">Nenhum alarme criado ainda</p>';
            return;
        }

        alarmsList.innerHTML = alarms.map(alarm => this.createAlarmElement(alarm)).join('');

        // Adiciona event listeners aos botões
        alarms.forEach(alarm => {
            const toggleBtn = document.getElementById(`toggle-${alarm.id}`);
            const deleteBtn = document.getElementById(`delete-${alarm.id}`);

            if (toggleBtn) {
                toggleBtn.addEventListener('click', () => this.handleToggleAlarm(alarm.id));
            }

            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => this.handleDeleteAlarm(alarm.id));
            }
        });
    }

    createAlarmElement(alarm) {
        const statusClass = alarm.active ? 'active' : 'inactive';
        const statusText = alarm.active ? 'Ativo' : 'Inativo';
        const toggleBtnText = alarm.active ? 'Desativar' : 'Ativar';
        const toggleBtnClass = alarm.active ? 'alarm-btn-toggle' : 'alarm-btn-toggle';

        return `
            <div class="alarm-item ${statusClass}">
                <div class="alarm-time">${alarm.time}</div>
                <div class="alarm-label">${alarm.label}</div>
                <span class="alarm-status ${statusClass}">${statusText}</span>
                <div class="alarm-actions">
                    <button id="toggle-${alarm.id}" class="alarm-btn ${toggleBtnClass}">
                        ${toggleBtnText}
                    </button>
                    <button id="delete-${alarm.id}" class="alarm-btn alarm-btn-delete">
                        Deletar
                    </button>
                </div>
            </div>
        `;
    }

    handleToggleAlarm(id) {
        storage.toggleAlarmActive(id);
        this.renderAlarms();
        
        const alarm = storage.getAlarms().find(a => a.id === id);
        const status = alarm.active ? 'ativado' : 'desativado';
        this.showMessage(`Alarme ${status}`);
    }

    handleDeleteAlarm(id) {
        if (confirm('Tem certeza que deseja deletar este alarme?')) {
            storage.deleteAlarm(id);
            this.renderAlarms();
            this.showMessage('Alarme deletado');
        }
    }

    showMessage(message) {
        if (app) {
            app.showNotification(message);
        }
    }
}

// Instância global
let alarmsManager;

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    alarmsManager = new AlarmsManager();
});
