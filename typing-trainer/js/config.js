// Конфигурация приложения
const CONFIG = {
    // Наборы текстов для разных языков и сложностей
    texts: {
        ru: {
            easy: [
                'мама мыла раму',
                'кот и пес',
                'дом лес сад',
                'утро день вечер'
            ],
            medium: [
                'быстрое обучение печати на клавиатуре',
                'правильная техника набора текста',
                'скорость печати растет с практикой',
                'клавиатура раскладка русская'
            ],
            hard: [
                'экзистенциальный кризис современного программиста',
                'синхрофазатрон и квантовая запутанность сознания',
                'трансцендентальная медитация в эпоху цифровых технологий',
                'парадокс выбора в бесконечном потоке информации'
            ]
        },
        en: {
            easy: [
                'cat and dog',
                'sun moon star',
                'red blue green',
                'one two three'
            ],
            medium: [
                'quick brown fox jumps over the lazy dog',
                'practice makes perfect every day',
                'keyboard typing speed and accuracy',
                'learning to type without looking'
            ],
            hard: [
                'the quick brown fox jumps over the lazy dog',
                'programming requires patience and practice',
                'artificial intelligence is changing the world',
                'cryptocurrency and blockchain technology revolution'
            ]
        }
    },
    
    // Раскладка клавиатуры
    keyboardLayout: {
        ru: [
            ['ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace'],
            ['tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', 'enter'],
            ['caps', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', '\\'],
            ['shift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.', 'shift'],
            ['ctrl', 'win', 'alt', 'space', 'alt', 'win', 'ctrl']
        ],
        en: [
            ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace'],
            ['tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', 'enter'],
            ['caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", '\\'],
            ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'shift'],
            ['ctrl', 'win', 'alt', 'space', 'alt', 'win', 'ctrl']
        ]
    }
};