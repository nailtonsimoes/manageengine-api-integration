const fetch = require('node-fetch');

async function generateAnalyticsAuthToken(email, password) {
    const hostName = '45.170.94.248';
    const port = '8443';
    const baseUrl = `https://${hostName}:${port}`;
    const scope = 'ZROP/reportsapi';

    const url = `${baseUrl}/iam/apiauthtoken/nb/create?SCOPE=${scope}&EMAIL_ID=${encodeURIComponent(email)}&PASSWORD=${encodeURIComponent(password)}`;

    const response = await fetch(url, { method: 'POST' });
    const text = await response.text();

    const lines = text.split('\n');
    const result = {};
    for (const line of lines) {
        if (line.includes('=')) {
            const [key, value] = line.split('=');
            result[key.trim()] = value.trim();
        }
    }

    if (result.RESULT !== 'TRUE') {
        throw new Error('Falha ao gerar Auth Token do Analytics Plus');
    }

    return result.AUTHTOKEN;
}

module.exports = { generateAnalyticsAuthToken };
