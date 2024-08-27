const express = require('express');
const { JWT } = require('google-auth-library');
const path = require('path');

// Configura la ruta al archivo de credenciales
const keyFilePath = path.join(__dirname, 'creditcustomers-9a40a-c131161085db.json');
const SCOPES = ['https://www.googleapis.com/auth/cloud-platform'];
let token = null;
let tokenExpiry = 0; // Tiempo en milisegundos cuando el token expira

async function getAccessToken() {
  if (!token || Date.now() > tokenExpiry) {
    try {
      const key = require(keyFilePath);
      const jwtClient = new JWT(
        key.client_email,
        null,
        key.private_key,
        SCOPES,
        null
      );
      const tokens = await jwtClient.authorize();
      
      // Calcula el tiempo de expiración del token
      token = tokens.access_token;
      tokenExpiry = Date.now() + (tokens.expires_in * 1000); // Expira en segundos, convertir a milisegundos
      
      console.log('Nuevo Access Token:', token);
      return token;
    } catch (error) {
      console.error('Error obteniendo el token de acceso:', error);
      throw error; // Lanza el error para manejarlo adecuadamente
    }
  }
  return token; // Retorna el token almacenado si es válido
}

// Configura el servidor Express
const app = express();
const port = 8082;

app.get('/api/token', async (req, res) => {
  try {
    const token = await getAccessToken();
    if (!token) {
      res.status(500).send('Error obteniendo el token');
    } else {
      res.status(200).json({ token });
    }
  } catch (error) {
    res.status(500).send('Error obteniendo el token');
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
