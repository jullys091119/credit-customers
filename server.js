const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

// Almacena los tokens de los dispositivos (en un entorno real, deberías usar una base de datos)
let expoPushTokens = [];

// Endpoint para registrar el token del dispositivo
app.post('/register', (req, res) => {
  const { token } = req.body;
  if (token && !expoPushTokens.includes(token)) {
    expoPushTokens.push(token);
  }
  res.sendStatus(200);
});

// Endpoint para enviar una notificación
app.post('/send-notification', async (req, res) => {
  const { title, body, data } = req.body;

  const messages = expoPushTokens.map(token => ({
    to: token,
    sound: 'default',
    title,
    body,
    data,
  }));

  try {
    await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    });
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
