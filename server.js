const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// Разрешаем запросы с других сайтов
app.use(cors());
app.use(express.json());

// Берем данные из переменных окружения
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// Маршрут для отправки сообщения в Telegram
app.post('/send-message', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Проверяем, что есть токен и ID
        if (!BOT_TOKEN || !CHAT_ID) {
            return res.status(500).json({ 
                success: false, 
                error: 'Сервер не настроен. Отсутствует токен или Chat ID' 
            });
        }
        
        // Формируем текст для Telegram
        const text = `📨 НОВОЕ СООБЩЕНИЕ С САЙТА:\n\n👤 Имя: ${name}\n📧 Email: ${email}\n💬 Сообщение: ${message}`;
        
        // Отправляем в Telegram
        const response = await axios.post(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                chat_id: CHAT_ID,
                text: text,
                parse_mode: 'HTML'
            }
        );
        
        res.json({ success: true });
    } catch (error) {
        console.error('Ошибка отправки:', error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Не удалось отправить сообщение' 
        });
    }
});

// Главная страница
app.get('/', (req, res) => {
    res.send('Сервер для формы обратной связи работает!');
});

// Проверка здоровья (нужно для хостинга)
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
