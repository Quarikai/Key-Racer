class Statistics {
    constructor() {
        this.bestSpeed = parseInt(localStorage.getItem('bestSpeed')) || 0;
        this.totalLessons = parseInt(localStorage.getItem('totalLessons')) || 0;
        this.averageAccuracy = parseInt(localStorage.getItem('averageAccuracy')) || 0;
        this.updateBestSpeed();
    }

    updateBestSpeed() {
        document.getElementById('bestSpeed').textContent = this.bestSpeed;
    }

    saveResult(stats) {
        // Обновляем лучшую скорость
        if (stats.speed > this.bestSpeed) {
            this.bestSpeed = stats.speed;
            localStorage.setItem('bestSpeed', this.bestSpeed);
            this.updateBestSpeed();
        }

        // Обновляем общую статистику
        this.totalLessons++;
        localStorage.setItem('totalLessons', this.totalLessons);
        
        // Обновляем среднюю точность
        const newAvg = Math.round(
            (this.averageAccuracy * (this.totalLessons - 1) + stats.accuracy) / this.totalLessons
        );
        this.averageAccuracy = newAvg;
        localStorage.setItem('averageAccuracy', this.averageAccuracy);

        // Показываем результаты
        this.showResultModal(stats);
    }

    showResultModal(stats) {
        // Создаем модальное окно с результатами
        const modal = document.createElement('div');
        modal.className = 'result-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            padding: 40px;
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            text-align: center;
        `;

        const emoji = stats.accuracy >= 95 ? '🎉' : stats.accuracy >= 80 ? '👍' : '💪';
        
        content.innerHTML = `
            <h2 style="font-size: 3em; margin-bottom: 20px;">${emoji}</h2>
            <h3 style="margin-bottom: 20px; color: #333;">Результаты тренировки</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
                <div>
                    <div style="color: #666; font-size: 0.9em;">Скорость</div>
                    <div style="font-size: 1.8em; font-weight: bold; color: #667eea;">${stats.speed}</div>
                    <div style="color: #999; font-size: 0.8em;">зн/мин</div>
                </div>
                <div>
                    <div style="color: #666; font-size: 0.9em;">Точность</div>
                    <div style="font-size: 1.8em; font-weight: bold; color: #38a169;">${stats.accuracy}%</div>
                </div>
                <div>
                    <div style="color: #666; font-size: 0.9em;">Правильных</div>
                    <div style="font-size: 1.4em; font-weight: bold; color: #38a169;">${stats.correct}</div>
                </div>
                <div>
                    <div style="color: #666; font-size: 0.9em;">Ошибок</div>
                    <div style="font-size: 1.4em; font-weight: bold; color: #e53e3e;">${stats.errors}</div>
                </div>
            </div>
            <div style="margin: 15px 0; padding: 10px; background: #f8f9fa; border-radius: 8px;">
                <span style="color: #666;">Время: </span>
                <span style="font-weight: bold;">${Math.floor(stats.time)}с</span>
            </div>
            <button onclick="this.closest('.result-modal').remove()" 
                    style="background: #667eea; color: white; border: none; padding: 12px 40px; border-radius: 8px; font-size: 1em; font-weight: 600; cursor: pointer; margin-top: 20px;">
                Отлично! Продолжить
            </button>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // Закрытие по клику вне модалки
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
}