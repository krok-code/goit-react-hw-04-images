const express = require('express');
const os = require('os');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Шлях до файлу логів
const logFilePath = path.join(__dirname, 'search_history.txt');

// 1. Отримання системної інформації (Взаємодія з ОС та залізом)
app.get('/api/system', (req, res) => {
  const systemData = {
    platform: os.platform(), // ОС
    cpus: os.cpus().length, // Кількість ядер (залізо)
    totalMem: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + ' GB', // Оперативка
    freeMem: (os.freemem() / 1024 / 1024 / 1024).toFixed(2) + ' GB',
    uptime: (os.uptime() / 3600).toFixed(2) + ' hours', // Час роботи системи
  };
  res.json(systemData);
});

// 2. Логування пошукових запитів (Взаємодія з файловою системою)
app.post('/api/log', (req, res) => {
  const { query } = req.body;
  const logEntry = `[${new Date().toLocaleString()}] Search query: "${query}"\n`;

  // Додаємо запис у файл (якщо файлу немає, він створиться)
  fs.appendFile(logFilePath, logEntry, err => {
    if (err) {
      console.error('Failed to write log', err);
      return res.status(500).send('Error writing to file');
    }
    console.log(`Logged: ${query}`);
    res.send({ status: 'success' });
  });
});

app.listen(PORT, () => {
  console.log(`System Backend server is running on http://localhost:${PORT}`);
});
