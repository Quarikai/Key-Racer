class App {
    constructor() {
        this.keyboard = new Keyboard();
        this.trainer = new Trainer();
        this.statistics = new Statistics();
        this.tutorial = new Tutorial();
        
        // Сохраняем ссылку на клавиатуру для использования в других модулях
        window.keyboard = this.keyboard;
        
        this.init();
    }

    init() {
        // Загружаем начальный текст
        const language = document.getElementById('language').value;
        const difficulty = document.getElementById('difficulty').value;
        this.trainer.generateText(language, difficulty);

        // Настраиваем обработчики событий
        this.setupEventListeners();
        
        // Настраиваем колбэк завершения тренировки
        this.trainer.onComplete((stats) => {
            this.statistics.saveResult(stats);
        });

        // Добавляем кнопку для вызова обучения
        this.addTutorialButton();
    }

    addTutorialButton() {
        const settings = document.querySelector('.settings');
        
        // Проверяем, не добавлена ли уже кнопка
        if (document.querySelector('.btn-tutorial')) {
            return;
        }
        
        const btn = document.createElement('button');
        btn.className = 'btn-tutorial';
        btn.textContent = '📖 Обучение';
        btn.onclick = () => {
            if (this.tutorial) {
                this.tutorial.show();
            }
        };
        settings.appendChild(btn);
    }

    setupEventListeners() {
        // Обработка ввода с клавиатуры
        const userInput = document.getElementById('userInput');
        userInput.addEventListener('input', (e) => {
            if (this.trainer) {
                this.trainer.handleInput(e.target.value);
            }
        });

        // Кнопка старта
        const startBtn = document.getElementById('startBtn');
        startBtn.addEventListener('click', () => {
            const language = document.getElementById('language').value;
            const difficulty = document.getElementById('difficulty').value;
            
            if (this.trainer) {
                this.trainer.generateText(language, difficulty);
                this.keyboard.updateLanguage(language);
                this.keyboard.clearHighlights();
                
                // Фокусируем поле ввода
                document.getElementById('userInput').focus();
            }
        });

        // Кнопка сброса
        document.getElementById('resetBtn').addEventListener('click', () => {
            if (this.trainer) {
                this.trainer.reset();
                this.keyboard.clearHighlights();
                document.getElementById('userInput').focus();
            }
        });

        // Смена языка
        document.getElementById('language').addEventListener('change', (e) => {
            this.keyboard.updateLanguage(e.target.value);
            const difficulty = document.getElementById('difficulty').value;
            if (this.trainer) {
                this.trainer.generateText(e.target.value, difficulty);
                document.getElementById('userInput').focus();
            }
        });

        // Смена сложности
        document.getElementById('difficulty').addEventListener('change', (e) => {
            const language = document.getElementById('language').value;
            if (this.trainer) {
                this.trainer.generateText(language, e.target.value);
                document.getElementById('userInput').focus();
            }
        });

        // Предотвращение ввода в поле для некоторых клавиш
        document.getElementById('userInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });
    }
}

// Запуск приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
});