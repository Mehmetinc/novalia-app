
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin_marketplace.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Novalia app running on port ${PORT}`);
});
