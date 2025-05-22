const fetch = require('node-fetch');
const tokenCache = require('../utils/tokenCache');
const { logTokenUsage } = require('../utils/logger');

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
                Accept: 'application/vnd.manageengine.sdp.v3+json',
                ContentType: 'application/x-www-form-urlencoded'
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro ao buscar dados do SDP');
        }

        logTokenUsage({
            token,
            action: 'buscar requisições',
            endpoint: '/requests'
        });

        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

module.exports = {
    getRequests,
};
