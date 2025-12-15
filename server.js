const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// РАСШИРЕННЫЕ настройки CORS - разрешаем запросы с твоего сайта
app.use(cors({
    origin: 'https://annkosterenko.github.io' // ЯВНО указываем твой домен
}));

// Читаем JSON и URL-encoded данные
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Переменные окружения
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// Обработчик формы
app.post('/send-message', async (req, res) => {
    console.log('=== НОВЫЙ ЗАПРОС ===');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    
    try {
        const { name, email, message } = req.body;
        
        // Проверка входящих данных
        if (!name || !email || !message) {
            console.log('Ошибка: не все поля заполнены');
            return res.status(400).json({ 
                success: false, 
                error: 'Все поля обязательны' 
            });
        }
        
        console.log('Данные для Telegram:', { name, email, message });
        
        // Формируем текст
        const text = `📨 НОВОЕ СООБЩЕНИЕ С САЙТА:\n\n👤 Имя: ${name}\n📧 Email: ${email}\n💬 Сообщение: ${message}`;
        
        // Отправляем в Telegram
        console.log('Отправляю в Telegram...');
        const response = await axios.post(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                chat_id: CHAT_ID,
                text: text,
                parse_mode: 'HTML'
            }
        );
        
        console.log('Telegram ответил:', response.data);
        res.json({ success: true });
        
    } catch (error) {
        console.error('ФАТАЛЬНАЯ ОШИБКА:');
        console.error('Сообщение:', error.message);
        console.error('Ответ Telegram:', error.response?.data);
        console.error('Статус:', error.response?.status);
        
        res.status(500).json({ 
            success: false, 
            error: 'Ошибка сервера',
            details: error.message 
        });
    }
});

// Тестовый маршрут
app.get('/', (req, res) => {
    res.send('Сервер работает! <a href="/health">Проверка здоровья</a>');
});

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на порту ${PORT}`);
    console.log(`✅ BOT_TOKEN: ${BOT_TOKEN ? 'Есть' : 'НЕТ!'}`);
    console.log(`✅ CHAT_ID: ${CHAT_ID ? CHAT_ID : 'НЕТ!'}`);
});
