/**
 * timer.js
 * Gerenciamento do temporizador (decrescente)
 */

class TimerManager {
    constructor() {
        this.totalSeconds = 0;
        this.remainingSeconds = 0;
        this.isRunning = false;
        this.intervalId = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDisplay();
    }

    setupEventListeners() {
        const startBtn = document.getElementById('timerStartBtn');
        const pauseBtn = document.getElementById('timerPauseBtn');
        const resetBtn = document.getElementById('timerResetBtn');

        if (startBtn) {
            startBtn.addEventListener('click', () => this.handleStart());
        }

        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.handlePause());
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.handleReset());
        }

        // Atualiza o tempo total quando os inputs mudam
        const hoursInput = document.getElementById('timerHours');
        const minutesInput = document.getElementById('timerMinutes');
        const secondsInput = document.getElementById('timerSeconds');

        [hoursInput, minutesInput, secondsInput].forEach(input => {
            if (input) {
                input.addEventListener('change', () => this.updateTotalSeconds());
                input.addEventListener('input', () => this.updateDisplay());
            }
        });
    }

    updateTotalSeconds() {
        if (this.isRunning) return; // Não atualiza enquanto está rodando

        const hours = parseInt(document.getElementById('timerHours').value) || 0;
        const minutes = parseInt(document.getElementById('timerMinutes').value) || 0;
        const seconds = parseInt(document.getElementById('timerSeconds').value) || 0;

        this.totalSeconds = hours * 3600 + minutes * 60 + seconds;
        this.remainingSeconds = this.totalSeconds;
        this.updateDisplay();
    }

    handleStart() {
        if (this.isRunning) return;

        if (this.remainingSeconds === 0) {
            this.updateTotalSeconds();
        }

        if (this.remainingSeconds <= 0) {
            alert('Por favor, defina um tempo maior que 0');
            return;
        }

        this.isRunning = true;
        this.updateButtonStates();

        // Desabilita os inputs
        this.disableInputs(true);

        // Adiciona classe de animação
        const display = document.querySelector('.timer-display');
        if (display) {
            display.classList.add('timer-is-running');
        }

        this.intervalId = setInterval(() => {
            this.remainingSeconds--;
            this.updateDisplay();

            if (this.remainingSeconds <= 0) {
                this.handleTimerComplete();
            }
        }, 1000);
    }

    handlePause() {
        if (!this.isRunning) return;

        this.isRunning = false;
        clearInterval(this.intervalId);
        this.updateButtonStates();

        const display = document.querySelector('.timer-display');
        if (display) {
            display.classList.remove('timer-is-running');
        }
    }

    handleReset() {
        this.isRunning = false;
        clearInterval(this.intervalId);
        this.remainingSeconds = 0;
        this.totalSeconds = 0;
        
        document.getElementById('timerHours').value = '0';
        document.getElementById('timerMinutes').value = '1';
        document.getElementById('timerSeconds').value = '0';

        this.disableInputs(false);
        this.updateButtonStates();
        this.updateDisplay();

        const display = document.querySelector('.timer-display');
        if (display) {
            display.classList.remove('timer-is-running');
            display.classList.remove('timer-finished');
        }
    }

    handleTimerComplete() {
        this.isRunning = false;
        clearInterval(this.intervalId);
        this.updateButtonStates();
        this.disableInputs(false);

        const display = document.querySelector('.timer-display');
        if (display) {
            display.classList.remove('timer-is-running');
            display.classList.add('timer-finished');
        }

        // Reproduz o alarme
        if (app) {
            app.playAlarmSound();
            app.showNotification('Tempo finalizado! Seu temporizador expirou.');
            
            // Para o áudio após 5 segundos
            setTimeout(() => {
                app.stopAlarm();
            }, 5000);
        }

        // Salva a sessão
        storage.saveTimerSession({
            duration: this.totalSeconds,
            completed: true
        });
    }

    updateDisplay() {
        const hours = Math.floor(this.remainingSeconds / 3600);
        const minutes = Math.floor((this.remainingSeconds % 3600) / 60);
        const seconds = this.remainingSeconds % 60;

        const display = document.getElementById('timerValue');
        if (display) {
            display.textContent = 
                `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    }

    updateButtonStates() {
        const startBtn = document.getElementById('timerStartBtn');
        const pauseBtn = document.getElementById('timerPauseBtn');

        if (startBtn) {
            startBtn.disabled = this.isRunning;
        }

        if (pauseBtn) {
            pauseBtn.disabled = !this.isRunning;
        }
    }

    disableInputs(disable) {
        document.getElementById('timerHours').disabled = disable;
        document.getElementById('timerMinutes').disabled = disable;
        document.getElementById('timerSeconds').disabled = disable;
    }
}

// Instância global
let timerManager;

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    timerManager = new TimerManager();
});
