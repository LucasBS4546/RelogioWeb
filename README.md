# Relógio Web - Aplicativo Desktop

Aplicativo de referência para o projeto a ser desenvolvido no evento de 'Tecnologia inútil, complexa e criativamente horrível'.

Page do repositório: https://lucasbs4546.github.io/RelogioWeb/

## Funcionalidades
### 1. **Gerenciador de Alarmes** - Principal
- Criar alarmes com horários específicos
- Adicionar rótulos personalizados aos alarmes
- Ativar/Desativar alarmes
- Deletar alarmes
- Botão de teste de alarme
- Sons de alarme personalizados (ou som padrão)
- Notificações quando um alarme dispara

### 2. **Hora Mundial (World Time)** - Opcional
- Visualizar horários em 16 fusos horários diferentes
- Cidades incluídas: Londres, Paris, São Paulo, New York, Los Angeles, Tóquio, Hong Kong, Dubai, Singapura, Sydney, Moscou, Mumbai, Bangkok, Istambul, México e Toronto
- Atualização em tempo real
- Exibição de data local para cada timezone

### 3. **Temporizador** - Opcional
- Defina horas, minutos e segundos
- Iniciar, pausar e reiniciar
- Som de alarme quando o tempo expira
- Persistência de sessões

### 4. **Cronômetro** - Opcional
- Contar tempo crescente com precisão de centésimos
- Pausar e medir voltas
- Reiniciar e começar novamente
- Registro de voltas (laps)

## Estrutura do Projeto

```
RelogioWeb/
├── index.html              # Página principal
├── README.md              # Este arquivo
├── LICENSE                # Licença do projeto
├── css/
│   ├── style.css          # Estilos globais
│   ├── alarms.css         # Estilos dos alarmes
│   ├── world-time.css     # Estilos do world time
│   ├── timer.css          # Estilos do temporizador
│   └── stopwatch.css      # Estilos do cronômetro
├── js/
│   ├── storage.js         # Gerenciamento de persistência
│   ├── main.js            # Lógica principal e navegação
│   ├── alarms.js          # Gerenciamento de alarmes
│   ├── world-time.js      # Gerenciamento de fusos horários
│   ├── timer.js           # Gerenciamento do temporizador
│   └── stopwatch.js       # Gerenciamento do cronômetro
├── data/
│   └── data.json          # Arquivo de persistência de dados
└── audio/
    └── (adicione seus arquivos de áudio aqui)
```

## Como Usar

### Instalação
1. Clone ou baixe este repositório
2. Abra o arquivo `index.html` em um navegador moderno (Chrome, Firefox, Edge, Safari)

### Usando o Alarme
1. Clique na aba "Alarmes"
2. Selecione um horário usando o campo "Horário do Alarme"
3. Adicione um rótulo opcional
4. (Opcional) Escolha o audio a ser tocado
5. Clique em "Criar Alarme"
6. Use "Testar Alarme" para ouvir o som de teste

### Usando World Time
1. Clique na aba "Hora Mundial"
2. Visualize o horário atual em 16 fusos horários principais
3. A atualização é automática a cada segundo

### Usando Temporizador
1. Clique na aba "Temporizador"
2. Defina o tempo: horas, minutos e segundos
3. Clique em "Iniciar"
4. Use "Pausar" para pausar e "Reiniciar" para resetar

### Usando Cronômetro
1. Clique na aba "Cronômetro"
2. Clique em "Iniciar" para começar a contar
3. Clique em "Pausar" para registrar uma volta
4. Visualize o tempo de cada volta na seção abaixo
5. Clique em "Reiniciar" para resetar

## Persistência de Dados

Os dados são armazenados no **localStorage** do navegador:
- Alarmes criados
- Histórico de sessões do temporizador
- Histórico de sessões do cronômetro

**Nota**: Os dados persistem apenas neste navegador/dispositivo. Limpar o cache do navegador irá deletar os dados.

## Configurar Áudio Personalizado

Para usar um arquivo de áudio personalizado como alarme:

1. Coloque o arquivo de áudio na pasta `audio/` do projeto
2. Ao criar um alarme, preencha o campo "Arquivo de Áudio" com o caminho relativo
   - Exemplo: `audio/meu-alarme.mp3`
   - Exemplo: `audio/notification.wav`

Formatos suportados:
- MP3
- WAV
- OGG
- M4A
- FLAC
