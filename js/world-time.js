/**
 * world-time.js
 * Gerenciamento de fusos horários (World Time)
 */

const TIMEZONES = [
    { name: 'Londres', timezone: 'Europe/London', offset: 'GMT+0' },
    { name: 'Paris', timezone: 'Europe/Paris', offset: 'GMT+1' },
    { name: 'São Paulo', timezone: 'America/Sao_Paulo', offset: 'GMT-3' },
    { name: 'New York', timezone: 'America/New_York', offset: 'GMT-5' },
    { name: 'Los Angeles', timezone: 'America/Los_Angeles', offset: 'GMT-8' },
    { name: 'Tóquio', timezone: 'Asia/Tokyo', offset: 'GMT+9' },
    { name: 'Hong Kong', timezone: 'Asia/Hong_Kong', offset: 'GMT+8' },
    { name: 'Dubai', timezone: 'Asia/Dubai', offset: 'GMT+4' },
    { name: 'Singapura', timezone: 'Asia/Singapore', offset: 'GMT+8' },
    { name: 'Sydney', timezone: 'Australia/Sydney', offset: 'GMT+10' },
    { name: 'Moscou', timezone: 'Europe/Moscow', offset: 'GMT+3' },
    { name: 'Mumbai', timezone: 'Asia/Kolkata', offset: 'GMT+5:30' },
    { name: 'Bangkok', timezone: 'Asia/Bangkok', offset: 'GMT+7' },
    { name: 'Istambul', timezone: 'Europe/Istanbul', offset: 'GMT+3' },
    { name: 'México', timezone: 'America/Mexico_City', offset: 'GMT-6' },
    { name: 'Toronto', timezone: 'America/Toronto', offset: 'GMT-5' }
];

class WorldTimeManager {
    constructor() {
        this.init();
    }

    init() {
        this.renderTimezones();
        // Atualiza a cada segundo
        setInterval(() => {
            this.updateTimezones();
        }, 1000);
    }

    renderTimezones() {
        const grid = document.getElementById('timezonesGrid');
        if (!grid) return;

        grid.innerHTML = TIMEZONES.map(tz => this.createTimezoneCard(tz)).join('');
        this.updateTimezones();
    }

    createTimezoneCard(timezone) {
        return `
            <div class="timezone-card" data-timezone="${timezone.timezone}">
                <div class="timezone-name">${timezone.name}</div>
                <div class="timezone-offset">${timezone.offset}</div>
                <div class="timezone-time" id="time-${timezone.name.replace(/\s/g, '-')}">--:--:--</div>
                <div class="timezone-date" id="date-${timezone.name.replace(/\s/g, '-')}">--/--/----</div>
            </div>
        `;
    }

    updateTimezones() {
        TIMEZONES.forEach(tz => {
            const timeElement = document.getElementById(`time-${tz.name.replace(/\s/g, '-')}`);
            const dateElement = document.getElementById(`date-${tz.name.replace(/\s/g, '-')}`);

            if (timeElement && dateElement) {
                const time = this.getTimeInTimezone(tz.timezone);
                const date = this.getDateInTimezone(tz.timezone);
                
                timeElement.textContent = time;
                dateElement.textContent = date;
            }
        });
    }

    getTimeInTimezone(timezone) {
        try {
            const date = new Date();
            const options = {
                timeZone: timezone,
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            };
            
            const formatter = new Intl.DateTimeFormat('pt-BR', options);
            return formatter.format(date);
        } catch (e) {
            console.error(`Erro ao formatar horário para ${timezone}:`, e);
            return '--:--:--';
        }
    }

    getDateInTimezone(timezone) {
        try {
            const date = new Date();
            const options = {
                timeZone: timezone,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            };
            
            const formatter = new Intl.DateTimeFormat('pt-BR', options);
            return formatter.format(date);
        } catch (e) {
            console.error(`Erro ao formatar data para ${timezone}:`, e);
            return '--/--/----';
        }
    }
}

// Função global para atualizar os timezones
function updateTimezones() {
    if (worldTimeManager) {
        worldTimeManager.updateTimezones();
    }
}

// Instância global
let worldTimeManager;

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    worldTimeManager = new WorldTimeManager();
});
