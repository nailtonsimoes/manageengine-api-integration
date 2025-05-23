process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const sdpAuthRoutes = require('./routes/sdp/sdpAuthRoutes');
const sdpDataRoutes = require('./routes/sdp/sdpDataRoutes');
const analyticsAuthRoutes = require('./routes/analytics/analyticsAuthRoutes');
const analyticsRoutes = require('./routes/analytics/analyticsRpaRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', sdpAuthRoutes);
app.use('/sdp', sdpDataRoutes);
app.use('/authAnalytics', analyticsAuthRoutes);
app.use('/rpa', analyticsRoutes);

// Substitua pelos caminhos corretos dos seus arquivos de certificado e chave
const sslOptions = {
  key: fs.readFileSync('./ssl/server.key'),
  cert: fs.readFileSync('./ssl/server.crt')
};

https.createServer(sslOptions, app).listen(3000, () => {
  console.log('Servidor HTTPS rodando na porta 3000');
});