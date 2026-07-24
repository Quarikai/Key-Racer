class Keyboard {
    constructor() {
        this.container = document.getElementById('keyboard');
        this.currentLanguage = 'ru';
        this.keys = new Map();
        this.init();
    }

    init() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        const layout = CONFIG.keyboardLayout[this.currentLanguage];
        this.container.innerHTML = '';
        this.keys.clear();

        layout.forEach(row => {
            row.forEach(key => {
                const keyElement = document.createElement('div');
                keyElement.className = 'key';
                
                // Специальные классы для широких клавиш
                if (key === 'space') keyElement.classList.add('space');
                else if (['shift', 'ctrl', 'alt', 'win'].includes(key)) {
                    keyElement.classList.add(key);
                } else if (key === 'tab') keyElement.classList.add('tab');
                else if (key === 'caps') keyElement.classList.add('caps');
                else if (key === 'enter') keyElement.classList.add('enter');
                else if (key === 'backspace') keyElement.classList.add('backspace');
                
                // Отображение специальных клавиш
                const displayMap = {
                    'backspace': '⌫',
                    'tab': '⇥',
                    'caps': '⇪',
                    'enter': '↵',
                    'shift': '⇧',
                    'ctrl': '⌃',
                    'alt': '⌥',
                    'win': '⊞',
                    'space': '␣'
                };
                
                keyElement.textContent = displayMap[key] || key.toUpperCase();
                keyElement.dataset.key = key;
                
                this.container.appendChild(keyElement);
                this.keys.set(key, keyElement);
            });
        });
    }

    setLanguage(language) {
        this.currentLanguage = language;
        this.render();
    }

    highlightKey(key, type = 'active') {
        // Сначала сбрасываем все highlight
        this.keys.forEach(el => {
            el.classList.remove('active', 'correct', 'incorrect', 'tutorial');
            // Сбрасываем inline стили
            el.style.background = '';
            el.style.borderColor = '';
            el.style.color = '';
            el.style.fontWeight = '';
            el.style.transform = '';
            el.style.boxShadow = '';
        });

        const keyElement = this.keys.get(key);
        if (keyElement) {
            keyElement.classList.add(type);
            
            // Для tutorial используем особый стиль
            if (type === 'tutorial') {
                keyElement.style.background = '#667eea';
                keyElement.style.borderColor = '#5a67d8';
                keyElement.style.color = 'white';
                keyElement.style.transform = 'scale(1.1)';
                keyElement.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
            }
        }
    }

    markKey(key, status) {
        const keyElement = this.keys.get(key);
        if (keyElement) {
            keyElement.classList.add(status);
            setTimeout(() => {
                keyElement.classList.remove(status);
                // Сбрасываем стили, если они были установлены
                if (status === 'tutorial') {
                    keyElement.style.background = '';
                    keyElement.style.borderColor = '';
                    keyElement.style.color = '';
                    keyElement.style.transform = '';
                    keyElement.style.boxShadow = '';
                }
            }, 300);
        }
    }

    clearHighlights() {
        this.keys.forEach(el => {
            el.classList.remove('active', 'correct', 'incorrect', 'tutorial');
            // Сбрасываем inline стили
            el.style.background = '';
            el.style.borderColor = '';
            el.style.color = '';
            el.style.fontWeight = '';
            el.style.transform = '';
            el.style.boxShadow = '';
        });
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            let key = e.key.toLowerCase();
            
            // Обработка специальных клавиш
            const keyMap = {
                ' ': 'space',
                'backspace': 'backspace',
                'tab': 'tab',
                'capslock': 'caps',
                'enter': 'enter',
                'shift': 'shift',
                'control': 'ctrl',
                'alt': 'alt',
                'win': 'win'
            };
            
            key = keyMap[key] || key;
            
            // Игнорируем клавиши, которых нет на клавиатуре
            const validKeys = ['space', 'backspace', 'tab', 'caps', 'enter', 'shift', 'ctrl', 'alt', 'win'];
            if (validKeys.includes(key) || key.length === 1) {
                this.highlightKey(key, 'active');
            }
        });

        document.addEventListener('keyup', (e) => {
            // Снимаем подсветку через небольшую задержку
            setTimeout(() => {
                this.keys.forEach(el => {
                    if (el.classList.contains('active')) {
                        el.classList.remove('active');
                    }
                });
            }, 100);
        });
    }

    updateLanguage(language) {
        this.setLanguage(language);
    }
}