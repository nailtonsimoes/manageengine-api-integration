const express = require('express');
const cors = require('cors');
const sdpAuthRoutes = require('./routes/sdpAuthRoutes');
const sdpDataRoutes = require('./routes/sdpDataRoutes');
const analyticsAuthRoutes = require('./routes/analyticsAuthRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', sdpAuthRoutes);
app.use('/sdp', sdpDataRoutes);
app.use('/authAnalytics', analyticsAuthRoutes);

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
