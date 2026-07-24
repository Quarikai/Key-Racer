class Tutorial {
    constructor() {
        this.isVisible = false;
        this.currentStep = 0;
        this.steps = [
            {
                title: '👋 Правильная поза',
                description: 'Сядьте ровно, спина прямая. Локти согнуты под прямым углом. Расстояние до экрана — 45-70 см.',
                highlight: null
            },
            {
                title: '📍 Домашняя позиция (F и J)',
                description: 'Найдите выступы на клавишах F и J. Поставьте указательные пальцы на них. Остальные пальцы ложатся на ряд: A S D F и J K L ;',
                highlight: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';']
            },
            {
                title: '🖐 Левая рука',
                description: 'Левая рука: мизинец на A, безымянный на S, средний на D, указательный на F.',
                highlight: ['a', 's', 'd', 'f']
            },
            {
                title: '🖐 Правая рука',
                description: 'Правая рука: указательный на J, средний на K, безымянный на L, мизинец на ;.',
                highlight: ['j', 'k', 'l', ';']
            },
            {
                title: '👆 Зоны пальцев',
                description: 'Каждый палец отвечает за свою зону клавиш. Двигайте только пальцы, кисти остаются на месте.',
                highlight: null,
                showZones: true
            },
            {
                title: '⚡️ Пробел и Shift',
                description: 'Пробел нажимайте большим пальцем свободной руки. Shift — мизинцем противоположной руки.',
                highlight: ['space', 'shift']
            },
            {
                title: '🎯 Готово!',
                description: 'Теперь вы знаете основы! Начните тренировку и запоминайте положение пальцев. Не смотрите на клавиатуру!',
                highlight: null,
                isFinal: true
            }
        ];
        
        this.init();
    }

    init() {
        this.createModal();
        this.checkFirstVisit();
    }

    createModal() {
        // Создаем модальное окно
        this.modal = document.createElement('div');
        this.modal.className = 'tutorial-modal';
        this.modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            padding: 20px;
        `;

        this.modal.innerHTML = `
            <div class="tutorial-content" style="
                background: white;
                border-radius: 20px;
                padding: 40px;
                max-width: 700px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            ">
                <button class="tutorial-close" style="
                    position: absolute;
                    top: 15px;
                    right: 20px;
                    background: none;
                    border: none;
                    font-size: 1.8em;
                    cursor: pointer;
                    color: #999;
                    transition: color 0.3s;
                ">×</button>
                
                <div class="tutorial-progress" style="
                    margin-bottom: 30px;
                    display: flex;
                    gap: 8px;
                    justify-content: center;
                "></div>
                
                <div class="tutorial-step" style="
                    text-align: center;
                ">
                    <h2 style="
                        font-size: 2em;
                        color: #333;
                        margin-bottom: 15px;
                    "></h2>
                    <p style="
                        font-size: 1.1em;
                        color: #666;
                        line-height: 1.6;
                        margin-bottom: 25px;
                    "></p>
                    <div class="tutorial-keyboard-preview" style="
                        margin: 20px 0;
                        padding: 20px;
                        background: #f8f9fa;
                        border-radius: 12px;
                        min-height: 100px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex-wrap: wrap;
                        gap: 8px;
                    "></div>
                </div>
                
                <div class="tutorial-controls" style="
                    display: flex;
                    justify-content: space-between;
                    margin-top: 25px;
                    gap: 15px;
                ">
                    <button class="tutorial-prev" style="
                        padding: 10px 25px;
                        background: #e0e0e0;
                        border: none;
                        border-radius: 8px;
                        font-size: 1em;
                        cursor: pointer;
                        transition: all 0.3s;
                    ">← Назад</button>
                    <button class="tutorial-next" style="
                        padding: 10px 35px;
                        background: #667eea;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-size: 1em;
                        cursor: pointer;
                        transition: all 0.3s;
                        font-weight: 600;
                    ">Далее →</button>
                </div>
            </div>
        `;

        document.body.appendChild(this.modal);
        this.setupEventListeners();
    }

    setupEventListeners() {
        const closeBtn = this.modal.querySelector('.tutorial-close');
        const prevBtn = this.modal.querySelector('.tutorial-prev');
        const nextBtn = this.modal.querySelector('.tutorial-next');

        closeBtn.addEventListener('click', () => this.close());
        prevBtn.addEventListener('click', () => this.prevStep());
        nextBtn.addEventListener('click', () => this.nextStep());

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (!this.isVisible) return;
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                this.nextStep();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prevStep();
            } else if (e.key === 'Escape') {
                this.close();
            }
        });
    }

    checkFirstVisit() {
        const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
        if (!hasSeenTutorial) {
            this.open();
        }
    }

    open() {
        this.isVisible = true;
        this.currentStep = 0;
        this.modal.style.display = 'flex';
        this.renderStep();
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.isVisible = false;
        this.modal.style.display = 'none';
        document.body.style.overflow = '';
        localStorage.setItem('hasSeenTutorial', 'true');
    }

    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.renderStep();
        } else {
            this.close();
        }
    }

    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.renderStep();
        }
    }

    renderStep() {
        const step = this.steps[this.currentStep];
        const stepEl = this.modal.querySelector('.tutorial-step');
        const titleEl = stepEl.querySelector('h2');
        const descEl = stepEl.querySelector('p');
        const previewEl = stepEl.querySelector('.tutorial-keyboard-preview');
        const progressEl = this.modal.querySelector('.tutorial-progress');
        const prevBtn = this.modal.querySelector('.tutorial-prev');
        const nextBtn = this.modal.querySelector('.tutorial-next');

        // Обновляем шаги прогресса
        progressEl.innerHTML = this.steps.map((_, i) => `
            <div style="
                width: 40px;
                height: 4px;
                border-radius: 2px;
                background: ${i <= this.currentStep ? '#667eea' : '#e0e0e0'};
                transition: background 0.3s;
            "></div>
        `).join('');

        // Обновляем контент - очищаем текст от лишних символов
        titleEl.textContent = step.title.trim();
        descEl.textContent = step.description.trim();

        // Обновляем кнопки
        prevBtn.style.display = this.currentStep === 0 ? 'none' : 'block';
        nextBtn.textContent = this.currentStep === this.steps.length - 1 ? '✅ Начать!' : 'Далее →';

        // Рендерим превью клавиатуры
        this.renderPreview(previewEl, step);

        // Подсвечиваем клавиши в основной клавиатуре
        if (window.keyboard && step.highlight) {
            window.keyboard.clearHighlights();
            step.highlight.forEach(key => {
                window.keyboard.highlightKey(key, 'tutorial');
            });
        } else if (window.keyboard) {
            window.keyboard.clearHighlights();
        }

        if (step.showZones && window.keyboard) {
            this.showKeyZones();
        }
    }

    renderPreview(container, step) {
        container.innerHTML = '';
        
        if (step.highlight) {
            const allKeys = ['q','w','e','r','t','y','u','i','o','p','a','s','d','f','g','h','j','k','l',';'];
            const displayMap = {
                ';': ';',
                'space': '␣',
                'shift': '⇧'
            };

            const grid = document.createElement('div');
            grid.style.cssText = `
                display: grid;
                grid-template-columns: repeat(10, 40px);
                gap: 4px;
                justify-content: center;
            `;

            allKeys.forEach(key => {
                const keyEl = document.createElement('div');
                const isHighlighted = step.highlight.includes(key);
                keyEl.textContent = displayMap[key] || key.toUpperCase();
                keyEl.style.cssText = `
                    padding: 10px 0;
                    background: ${isHighlighted ? '#667eea' : '#e0e0e0'};
                    color: ${isHighlighted ? 'white' : '#666'};
                    border-radius: 6px;
                    text-align: center;
                    font-weight: 600;
                    font-size: 0.85em;
                    transition: all 0.3s;
                    border: ${isHighlighted ? '2px solid #5a67d8' : '2px solid #d0d0d0'};
                    transform: ${isHighlighted ? 'scale(1.05)' : 'scale(1)'};
                    box-shadow: ${isHighlighted ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none'};
                `;
                grid.appendChild(keyEl);
            });

            container.appendChild(grid);
        } else if (step.isFinal) {
            container.innerHTML = `
                <div style="font-size: 4em; margin-bottom: 10px;">🎉</div>
                <div style="color: #667eea; font-weight: 600; font-size: 1.2em;">
                    Удачи в тренировках!
                </div>
            `;
        } else {
            const icons = {
                '👋 Правильная поза': '🧘',
                '📍 Домашняя позиция (F и J)': '🎯',
                '🖐 Левая рука': '👈',
                '🖐 Правая рука': '👉',
                '👆 Зоны пальцев': '🗺️',
                '⚡️ Пробел и Shift': '⚡️'
            };
            container.innerHTML = `
                <div style="font-size: 3em;">${icons[step.title] || '⌨️'}</div>
                <div style="color: #999; font-size: 0.9em; margin-top: 10px;">
                    ${step.title.includes('Зоны') ? 'Каждый палец отвечает за свою зону' : ''}
                    ${step.title.includes('Пробел') ? 'Пробел — большим пальцем' : ''}
                </div>
            `;
        }
    }

    showKeyZones() {
        const zones = {
            'q': '#FF6B6B', 'w': '#FF6B6B', 'e': '#FF6B6B', 'r': '#FF6B6B', 't': '#FF6B6B',
            'y': '#4ECDC4', 'u': '#4ECDC4', 'i': '#4ECDC4', 'o': '#4ECDC4', 'p': '#4ECDC4',
            'a': '#FFE66D', 's': '#FFE66D', 'd': '#FFE66D', 'f': '#FFE66D',
            'h': '#FF9FF3', 'j': '#FF9FF3', 'k': '#FF9FF3', 'l': '#FF9FF3',
            'z': '#FF6B6B', 'x': '#FF6B6B', 'c': '#FF6B6B', 'v': '#FF6B6B', 'b': '#FF6B6B',
            'n': '#4ECDC4', 'm': '#4ECDC4'
        };

        if (window.keyboard) {
            Object.keys(zones).forEach(key => {
                const el = window.keyboard.keys.get(key);
                if (el) {
                    el.style.background = zones[key];
                    el.style.borderColor = zones[key];
                    el.style.color = 'white';
                    el.style.fontWeight = 'bold';
                }
            });
        }
    }

    show() {
        this.open();
    }
}