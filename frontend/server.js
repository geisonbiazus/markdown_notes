const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3000;
const MONITORING_PORT = process.env.MONITORING_PORT || 3001;

if (!(PORT && MONITORING_PORT)) {
  throw new Error('Please define PORT and MONITORING_PORT to run prod-server');
}

const monitoringApp = express();
monitoringApp.get('/healthz', function (_, res) {
  res.status(200).send('OK');
});
monitoringApp.listen(MONITORING_PORT, '0.0.0.0', () => {
  console.log(`App (monitoring) running on port ${MONITORING_PORT} 🚀`);
});

/**
 * !! IMPORTANT !!
 * this has to correspond to src/AppConfig#AppConfig
 * !! IMPORTANT !!
 */
const appConfig = JSON.stringify({
  apiURL: process.env.REACT_APP_API_URL || 'http://localhost:4000',
  appEnv: process.env.REACT_APP_APP_ENV || 'production',
});

const app = express();
app.get('/config.js', (_, res) => {
  res.contentType('application/javascript').send(`window.__APP__CONFIG__ = ${appConfig};`);
});
app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', (_, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(PORT, '0.0.0.0', () => {
  console.log(`App running on port ${PORT} 🚀`);
});
