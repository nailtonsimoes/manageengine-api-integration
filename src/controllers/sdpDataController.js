// src/controllers/sdpDataController.js
const fetch = require('node-fetch');
const tokenCache = require('../utils/tokenCache');

async function getRequests(req, res) {
   
    const token = tokenCache.getToken();

    if (!token) {
        return res.status(401).json({ error: 'Token não disponível. Gere um novo.' });
    }

    console.log(`Usando token válido: ${token}`);

    try {
        const response = await fetch(' https://sdpondemand.manageengine.com/api/v3/requests', {
            headers: {
                Authorization: `Zoho-oauthtoken ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro ao buscar dados do SDP');
        }

        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

module.exports = {
    getRequests,
};
