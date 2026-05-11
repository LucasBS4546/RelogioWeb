/**
 * stopwatch.js
 * Gerenciamento do cronômetro (crescente)
 */

class StopwatchManager {
    constructor() {
        this.elapsedSeconds = 0;
        this.isRunning = false;
        this.intervalId = null;
        this.laps = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDisplay();
    }

    setupEventListeners() {
        const startBtn = document.getElementById('stopwatchStartBtn');
        const pauseBtn = document.getElementById('stopwatchPauseBtn');
        const resetBtn = document.getElementById('stopwatchResetBtn');

        if (startBtn) {
            startBtn.addEventListener('click', () => this.handleStart());
        }

        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.handlePause());
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.handleReset());
        }
    }

    handleStart() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.updateButtonStates();

        const display = document.querySelector('.stopwatch-display');
        if (display) {
            display.classList.add('stopwatch-is-running');
        }

        this.intervalId = setInterval(() => {
            this.elapsedSeconds += 0.01; // Incrementa em 0.01 para precisão de centésimos
            this.updateDisplay();
        }, 10); // Atualiza a cada 10ms
    }

    handlePause() {
        if (!this.isRunning) return;

        this.isRunning = false;
        clearInterval(this.intervalId);
        this.updateButtonStates();

        const display = document.querySelector('.stopwatch-display');
        if (display) {
            display.classList.remove('stopwatch-is-running');
        }

        // Registra uma volta quando pausado
        this.recordLap();
    }

    handleReset() {
        this.isRunning = false;
        clearInterval(this.intervalId);
        this.elapsedSeconds = 0;
        this.laps = [];

        this.updateButtonStates();
        this.updateDisplay();
        this.renderLaps();

        const display = document.querySelector('.stopwatch-display');
        if (display) {
            display.classList.remove('stopwatch-is-running');
        }

        // Salva a sessão
        storage.saveStopwatchSession({
            duration: this.elapsedSeconds,
            lapsCount: 0,
            completed: false
        });
    }

    recordLap() {
        const lapTime = this.elapsedSeconds;
        
        // Calcula o tempo da volta (diferença com a volta anterior)
        let lapDuration = lapTime;
        if (this.laps.length > 0) {
            lapDuration = lapTime - this.laps[this.laps.length - 1].totalTime;
        }

        this.laps.push({
            number: this.laps.length + 1,
            totalTime: lapTime,
            lapDuration: lapDuration,
            timestamp: new Date().toISOString()
        });

        this.renderLaps();
    }

    updateDisplay() {
        const display = document.getElementById('stopwatchValue');
        if (display) {
            display.textContent = this.formatTime(this.elapsedSeconds);
        }
    }

    formatTime(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);
        const centiseconds = Math.floor((totalSeconds % 1) * 100);

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
    }

    formatLapTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const centiseconds = Math.floor((seconds % 1) * 100);

        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
    }

    renderLaps() {
        const lapsList = document.getElementById('lapsList');
        
        if (this.laps.length === 0) {
            lapsList.innerHTML = '<p class="empty-message">Nenhuma volta registrada</p>';
            return;
        }

        lapsList.innerHTML = this.laps.map(lap => this.createLapElement(lap)).join('');
    }

    createLapElement(lap) {
        return `
            <div class="lap-item">
                <span class="lap-number">Volta ${lap.number}</span>
                <span class="lap-time">${this.formatLapTime(lap.lapDuration)}</span>
            </div>
        `;
    }

    updateButtonStates() {
        const startBtn = document.getElementById('stopwatchStartBtn');
        const pauseBtn = document.getElementById('stopwatchPauseBtn');

        if (startBtn) {
            startBtn.disabled = this.isRunning;
        }

        if (pauseBtn) {
            pauseBtn.disabled = !this.isRunning;
        }
    }
}

// Instância global
let stopwatchManager;

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    stopwatchManager = new StopwatchManager();
});
