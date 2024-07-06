const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:4000',  // Replace with your Node.js server URL
      changeOrigin: true,
    })
  );
};
