class Trainer {
    constructor() {
        this.textToType = document.getElementById('textToType');
        this.userInput = document.getElementById('userInput');
        this.currentText = '';
        this.currentIndex = 0;
        this.isActive = false;
        this.correctChars = 0;
        this.errors = 0;
        this.totalChars = 0;
        this.totalAttempts = 0; // НОВОЕ: общее количество попыток (включая исправленные)
        this.startTime = null;
        this.timerInterval = null;
        this.callbacks = {};
        this.results = [];
        this.lastInputLength = 0;
        this.isFinished = false;
    }

    generateText(language, difficulty) {
        // Останавливаем текущий таймер, если он активен
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        const texts = CONFIG.texts[language][difficulty];
        const randomIndex = Math.floor(Math.random() * texts.length);
        this.currentText = texts[randomIndex];
        this.currentIndex = 0;
        this.correctChars = 0;
        this.errors = 0;
        this.totalChars = 0;
        this.totalAttempts = 0; // Сбрасываем общее количество попыток
        this.isActive = false;
        this.startTime = null;
        this.results = [];
        this.lastInputLength = 0;
        this.isFinished = false;
        
        // ОЧИЩАЕМ поле ввода!
        this.userInput.value = '';
        this.userInput.disabled = false;
        this.userInput.focus();
        
        // Обновляем отображение
        this.updateDisplay();
        this.resetTimer();
        this.updateStats();
        
        // Активируем кнопку старта
        document.getElementById('startBtn').disabled = false;
    }

    updateDisplay() {
        let html = '';
        const inputValue = this.userInput.value || '';
        
        for (let i = 0; i < this.currentText.length; i++) {
            const char = this.currentText[i];
            let className = '';
            
            // Проверяем, есть ли у нас результат для этой позиции
            if (i < this.results.length) {
                // Используем сохраненный результат
                className = this.results[i] === 'correct' ? 'correct' : 'incorrect';
            } else if (i === inputValue.length && i < this.currentText.length) {
                // Текущий символ для ввода (только если тренировка активна)
                if (this.isActive || this.results.length === 0) {
                    className = 'current';
                }
            }
            
            html += `<span class="${className}">${char}</span>`;
        }
        this.textToType.innerHTML = html;
    }

    handleInput(input) {
        // Если тренировка завершена - игнорируем ввод
        if (this.isFinished) {
            this.userInput.value = this.userInput.value.slice(0, this.results.length);
            return;
        }

        const inputLength = input.length;
        const isDeleting = inputLength < this.lastInputLength;
        this.lastInputLength = inputLength;

        // Защита от выхода за границы текста
        if (inputLength > this.currentText.length) {
            this.userInput.value = input.slice(0, this.currentText.length);
            return;
        }

        // Запуск тренировки при первом вводе
        if (!this.isActive && inputLength > 0 && !this.isFinished) {
            this.startTraining();
        }

        if (!this.isActive && inputLength === 0) {
            this.updateDisplay();
            return;
        }

        // Обработка удаления
        if (isDeleting) {
            if (this.results.length > 0) {
                const lastResult = this.results.pop();
                // Удаляем только правильные символы из счетчика
                if (lastResult === 'correct') {
                    this.correctChars--;
                }
                // totalChars НЕ УМЕНЬШАЕМ! Он считает все попытки
                // totalAttempts тоже не уменьшаем
                this.currentIndex = this.results.length;
                this.updateDisplay();
                this.updateStats();
            }
            return;
        }

        // Обработка добавления символа
        if (inputLength > this.results.length && this.results.length < this.currentText.length) {
            const typedChar = input[inputLength - 1];
            const expectedChar = this.currentText[this.results.length];

            // Увеличиваем общее количество попыток (включая ошибки)
            this.totalAttempts++;
            
            if (typedChar === expectedChar) {
                this.results.push('correct');
                this.correctChars++;
                this.totalChars++; // Правильные символы
                if (window.keyboard) {
                    window.keyboard.markKey(expectedChar, 'correct');
                }
            } else {
                this.results.push('incorrect');
                this.errors++; // Ошибка добавляется, но НЕ УДАЛЯЕТСЯ при исправлении
                this.totalChars++; // Ошибочные символы тоже считаем в totalChars
                if (window.keyboard) {
                    window.keyboard.markKey(typedChar, 'incorrect');
                }
            }

            this.currentIndex = this.results.length;
            this.updateDisplay();
            this.updateStats();

            // Проверка завершения
            if (this.results.length === this.currentText.length) {
                this.finishTraining();
            }
        }
    }

    startTraining() {
        this.isActive = true;
        this.isFinished = false;
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, 1000);
        document.getElementById('startBtn').disabled = true;
    }

    finishTraining() {
        this.isActive = false;
        this.isFinished = true;
        this.userInput.disabled = true;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        document.getElementById('startBtn').disabled = false;
        
        // Сохраняем результат
        const stats = this.getStats();
        if (this.callbacks.onComplete) {
            this.callbacks.onComplete(stats);
        }
    }

    reset() {
        // Останавливаем таймер
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        this.isActive = false;
        this.isFinished = false;
        this.currentIndex = 0;
        this.correctChars = 0;
        this.errors = 0;
        this.totalChars = 0;
        this.totalAttempts = 0;
        this.startTime = null;
        this.results = [];
        this.lastInputLength = 0;
        
        // ОЧИЩАЕМ поле ввода
        this.userInput.value = '';
        this.userInput.disabled = false;
        this.userInput.focus();
        
        this.resetTimer();
        this.updateDisplay();
        this.updateStats();
        document.getElementById('startBtn').disabled = false;
    }

    getStats() {
        const elapsed = this.startTime ? (Date.now() - this.startTime) / 1000 : 0;
        const minutes = elapsed / 60;
        
        // Скорость считаем по правильным символам
        const speed = minutes > 0 ? Math.round(this.correctChars / minutes) : 0;
        
        // ТОЧНОСТЬ считаем по ОБЩЕМУ количеству попыток (totalAttempts)
        // totalAttempts - это все введенные символы, включая исправленные ошибки
        const accuracy = this.totalAttempts > 0 
            ? Math.round((this.correctChars / this.totalAttempts) * 100) 
            : 100;
        
        return {
            correct: this.correctChars,
            errors: this.errors,
            total: this.totalChars,
            attempts: this.totalAttempts, // Добавляем для отладки
            speed: speed,
            accuracy: accuracy,
            time: elapsed
        };
    }

    updateStats() {
        const stats = this.getStats();
        document.getElementById('correctChars').textContent = stats.correct;
        document.getElementById('errors').textContent = stats.errors;
        document.getElementById('totalChars').textContent = stats.total;
        document.getElementById('speed').textContent = stats.speed;
        document.getElementById('accuracy').textContent = stats.accuracy;
    }

    updateTimer() {
        if (!this.startTime) return;
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
        const seconds = String(elapsed % 60).padStart(2, '0');
        document.getElementById('timer').textContent = `${minutes}:${seconds}`;
    }

    resetTimer() {
        document.getElementById('timer').textContent = '00:00';
    }

    onComplete(callback) {
        this.callbacks.onComplete = callback;
    }
}