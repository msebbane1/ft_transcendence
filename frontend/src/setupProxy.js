const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api', // Ajoutez ici le chemin de votre API backend si nécessaire
    createProxyMiddleware({
      target: 'https://localhost:3000',
      changeOrigin: true,
      secure: false,
    })
  );
};

