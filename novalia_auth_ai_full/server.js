
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const app = express();
dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/register', (_, res) => res.sendFile(path.join(__dirname, 'register.html')));
app.get('/login', (_, res) => res.sendFile(path.join(__dirname, 'login.html')));
app.get('/dashboard', (_, res) => res.sendFile(path.join(__dirname, 'dashboard.html')));

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    await User.create({ name, email, password: hashed });
    res.redirect('/login');
  } catch (e) {
    res.send('Kayıt başarısız veya kullanıcı zaten var.');
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.send('Hatalı giriş.');
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.cookie('token', token, { httpOnly: true });
  res.redirect('/dashboard');
});

app.post('/ask', async (req, res) => {
  const prompt = req.body.prompt;
  const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await openaiRes.json();
  res.json({ response: data.choices?.[0]?.message?.content });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('✅ Novalia Auth+AI server aktif');
});
