const { generateAccessToken } = require('../services/sdpService');
const tokenCache = require('../utils/tokenCache');

async function generateToken(req, res) {
  try {
    const { client_id, client_secret, scope } = req.body;
    
    if (!client_id || !client_secret || !scope) {
      return res.status(400).json({ error: 'Parâmetros obrigatórios ausentes.' });
    }
    const cachedToken = tokenCache.getToken();
    
    if (cachedToken) {
      return res.status(200).json({
        message: 'Token ainda válido.',
        access_token: cachedToken
      });
    }

    console.log('Token não encontrado ou expirado. Gerando novo token...');
    
    const tokenResponse = await generateAccessToken({ client_id, client_secret, scope });

    tokenCache.setToken(tokenResponse.access_token, tokenResponse.expires_in);

    return res.status(200).json(tokenResponse);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Erro ao gerar token' });
  }
}

module.exports = { generateToken };
