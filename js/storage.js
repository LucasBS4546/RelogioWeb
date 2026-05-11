/**
 * storage.js
 * Gerencia a persistência de dados em JSON
 */

class DataStorage {
    constructor() {
        this.storageKey = 'clockAppData';
        this.initializeStorage();
    }

    initializeStorage() {
        // Verifica se há dados no localStorage
        if (!localStorage.getItem(this.storageKey)) {
            this.resetData();
        }
    }

    resetData() {
        const defaultData = {
            alarms: [],
            timerSessions: [],
            stopwatchSessions: []
        };
        localStorage.setItem(this.storageKey, JSON.stringify(defaultData));
    }

    getData() {
        const data = localStorage.getItem(this.storageKey);
        try {
            return JSON.parse(data) || this.getDefaultData();
        } catch (e) {
            console.error('Erro ao parsear dados do storage:', e);
            return this.getDefaultData();
        }
    }

    getDefaultData() {
        return {
            alarms: [],
            timerSessions: [],
            stopwatchSessions: []
        };
    }

    saveData(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Erro ao salvar dados:', e);
            return false;
        }
    }

    // MÉTODOS PARA ALARMES
    getAlarms() {
        return this.getData().alarms || [];
    }

    addAlarm(alarm) {
        const data = this.getData();
        alarm.id = Date.now().toString();
        alarm.active = true;
        data.alarms.push(alarm);
        this.saveData(data);
        return alarm;
    }

    updateAlarm(id, updatedAlarm) {
        const data = this.getData();
        const index = data.alarms.findIndex(a => a.id === id);
        if (index !== -1) {
            data.alarms[index] = { ...data.alarms[index], ...updatedAlarm };
            this.saveData(data);
            return data.alarms[index];
        }
        return null;
    }

    deleteAlarm(id) {
        const data = this.getData();
        data.alarms = data.alarms.filter(a => a.id !== id);
        this.saveData(data);
        return true;
    }

    toggleAlarmActive(id) {
        const alarm = this.getAlarms().find(a => a.id === id);
        if (alarm) {
            return this.updateAlarm(id, { active: !alarm.active });
        }
        return null;
    }

    // MÉTODOS PARA SESSÕES
    getTimerSessions() {
        return this.getData().timerSessions || [];
    }

    saveTimerSession(session) {
        const data = this.getData();
        session.id = Date.now().toString();
        session.date = new Date().toISOString();
        data.timerSessions.push(session);
        this.saveData(data);
        return session;
    }

    getStopwatchSessions() {
        return this.getData().stopwatchSessions || [];
    }

    saveStopwatchSession(session) {
        const data = this.getData();
        session.id = Date.now().toString();
        session.date = new Date().toISOString();
        data.stopwatchSessions.push(session);
        this.saveData(data);
        return session;
    }

    // Método para exportar dados
    exportData() {
        return JSON.stringify(this.getData(), null, 2);
    }

    // Método para importar dados
    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (data.alarms && data.timerSessions && data.stopwatchSessions) {
                this.saveData(data);
                return true;
            }
            return false;
        } catch (e) {
            console.error('Erro ao importar dados:', e);
            return false;
        }
    }
}

// Instância global do storage
const storage = new DataStorage();
