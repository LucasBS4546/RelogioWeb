/**
 * main.js
 * Lógica principal e navegação por abas
 */

class ClockApp {
    constructor() {
        this.currentTab = 'alarms';
        this.triggeredAlarms = {}; // Rastreia alarmes já disparados neste minuto
        this.currentAudioElement = null; // Referência ao áudio sendo tocado
        this.currentAudioContext = null; // Referência ao Web Audio Context
        this.currentOscillator = null; // Referência ao oscillator (tom)
        this.currentGainNode = null; // Referência ao gain node
        this.toneTimeoutId = null; // ID do timeout do tom
        this.init();
    }

    init() {
        this.setupTabNavigation();
        this.updateClock();
        this.startClockInterval();
    }

    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');
                this.switchTab(tabName, button, tabPanes);
            });
        });
    }

    switchTab(tabName, button, tabPanes) {
        // Remove classe active de todos os botões
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Remove classe active de todos os panes
        tabPanes.forEach(pane => {
            pane.classList.remove('active');
        });

        // Adiciona classe active ao botão e pane selecionado
        button.classList.add('active');
        document.getElementById(tabName).classList.add('active');

        this.currentTab = tabName;

        // Trigger para atualizar dados específicos da aba
        this.onTabChange(tabName);
    }

    onTabChange(tabName) {
        if (tabName === 'world-time') {
            updateTimezones();
        }
    }

    updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        const timeString = `${hours}:${minutes}:${seconds}`;
        const currentTimeElement = document.getElementById('currentTime');
        if (currentTimeElement) {
            currentTimeElement.textContent = timeString;
        }

        return timeString;
    }

    startClockInterval() {
        let lastMinute = -1;
        
        setInterval(() => {
            this.updateClock();
            
            // Limpa alarmes disparados a cada novo minuto
            const now = new Date();
            const currentMinute = now.getMinutes();
            if (currentMinute !== lastMinute) {
                this.triggeredAlarms = {};
                lastMinute = currentMinute;
            }
            
            // Verifica alarmes ativos
            this.checkAlarms();
        }, 1000);
    }

    checkAlarms() {
        const alarms = storage.getAlarms();
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        alarms.forEach(alarm => {
            if (alarm.active && alarm.time === currentTime) {
                // Verifica se já foi disparado NESTE MINUTO
                if (!this.triggeredAlarms[alarm.id]) {
                    this.triggerAlarm(alarm);
                    this.triggeredAlarms[alarm.id] = true; // Marca como disparado
                }
            }
        });
    }

    triggerAlarm(alarm) {
        console.log('Alarme disparado:', alarm);
        this.showNotification(`Alarme! ${alarm.label || 'Horário'} - ${alarm.time}`);
        this.playAlarmSound(alarm.audio);
    }

    playAlarmSound(audioPath = null) {
        const soundPath = audioPath || 'audio/alarm_default.mp3';
        
        // Para qualquer som anterior
        this.stopAlarm();
        
        // Tenta usar o elemento de áudio existente
        let audioElement = document.getElementById('alarmAudio');
        
        // Se não existir ou não for um HTMLAudioElement válido, cria um novo
        if (!audioElement || typeof audioElement.play !== 'function') {
            console.warn('Elemento de áudio inválido, criando novo...');
            audioElement = new Audio();
            audioElement.id = 'alarmAudio';
        }
        
        // Armazena referência para poder parar depois
        this.currentAudioElement = audioElement;
        
        audioElement.src = soundPath;
        audioElement.loop = true;
        
        // Tenta reproduzir
        try {
            const playPromise = audioElement.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log('✅ Áudio reproduzindo:', soundPath);
                    })
                    .catch(err => {
                        console.error('❌ Erro ao reproduzir áudio:', err);
                        // Fallback: tenta usar tom como alternativa
                        this.playToneAlarm();
                    });
            }
        } catch (err) {
            console.error('❌ Erro ao chamar play():', err);
            this.playToneAlarm();
        }
    }

    playToneAlarm() {
        try {
            // Para qualquer tom anterior
            this.stopToneAlarm();
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Frequência do som (440 Hz = nota A)
            oscillator.frequency.value = 880;
            oscillator.type = 'sine';

            // Fade in
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);

            oscillator.start(audioContext.currentTime);

            // Armazena referências para poder parar depois
            this.currentAudioContext = audioContext;
            this.currentOscillator = oscillator;
            this.currentGainNode = gainNode;

            // Parar após 5 segundos
            this.toneTimeoutId = setTimeout(() => {
                this.stopToneAlarm();
            }, 5000);
        } catch (err) {
            console.error('Erro ao criar tom:', err);
        }
    }

    stopToneAlarm() {
        try {
            if (this.toneTimeoutId) {
                clearTimeout(this.toneTimeoutId);
                this.toneTimeoutId = null;
            }
            
            if (this.currentOscillator && this.currentAudioContext) {
                this.currentGainNode.gain.linearRampToValueAtTime(0, this.currentAudioContext.currentTime);
                this.currentOscillator.stop(this.currentAudioContext.currentTime + 0.1);
                this.currentOscillator = null;
                this.currentAudioContext = null;
                this.currentGainNode = null;
            }
        } catch (err) {
            console.error('Erro ao parar tom:', err);
        }
    }

    stopAlarm() {
        try {
            // Para o áudio do arquivo
            if (this.currentAudioElement && typeof this.currentAudioElement.pause === 'function') {
                this.currentAudioElement.pause();
                this.currentAudioElement.currentTime = 0;
                this.currentAudioElement = null;
            }
            
            // Para o tom gerado (Web Audio API)
            this.stopToneAlarm();
            
            console.log('✅ Áudio parado');
        } catch (err) {
            console.error('❌ Erro ao parar áudio:', err);
        }
    }

    showNotification(message) {
        const modal = document.getElementById('notificationModal');
        const text = document.getElementById('notificationText');
        
        if (modal && text) {
            text.textContent = message;
            modal.style.display = 'flex';
        }
    }
}

// Função para fechar notificações
function closeNotification() {
    const modal = document.getElementById('notificationModal');
    if (modal) {
        modal.style.display = 'none';
    }
    // Para o som quando fecha a notificação
    if (app && typeof app.stopAlarm === 'function') {
        app.stopAlarm();
    }
}

// Instância global da app
let app;

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    app = new ClockApp();
});

// Utilidades globais
function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

function formatDate(date) {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
}

function padZero(num) {
    return String(num).padStart(2, '0');
}
