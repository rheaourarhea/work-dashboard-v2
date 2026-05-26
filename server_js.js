const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 일일 결산 메일 발송 API
app.post('/api/send-daily-report', async (req, res) => {
  try {
    const { to, subject, html } = req.body;
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
    await transporter.sendMail({ from: process.env.GMAIL_USER, to, subject, html });
    res.json({ success: true, message: '메일 발송 완료' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// 헬스체크
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
