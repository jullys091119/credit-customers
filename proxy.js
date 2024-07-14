const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Middleware para permitir CORS y manejar encabezados necesarios
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CSRF-Token');
    
    // Manejar solicitudes OPTIONS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    next();
});

// Ruta para manejar solicitudes GET en la raíz
app.get('/', (req, res) => {
    res.send('¡Hola desde el servidor proxy!');
});

// Middleware para redirigir las solicitudes a tu servidor de destino
app.use(
    '/api',
    createProxyMiddleware({
        target: 'https://elalfaylaomega.com/credit-customer', // URL de tu servidor de destino
        changeOrigin: true,
        pathRewrite: {
            '^/api': '', // Elimina '/api' de la ruta si es necesario
        },
        onProxyReq: (proxyReq, req, res) => {
            if (req.headers['x-csrf-token']) {
                proxyReq.setHeader('X-CSRF-Token', req.headers['x-csrf-token']);
            }
        }
    })
);

const PORT = 5000; // Puerto del servidor proxy
app.listen(PORT, () => {
    console.log(`Servidor proxy en ejecución en http://localhost:${PORT}`);
});
