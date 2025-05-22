const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

async function generateAccessToken({ client_id, client_secret, scope }) {
  const dataCenterUrl = 'https://accounts.zoho.com';

  const params = new URLSearchParams();
  params.append('client_id', client_id);
  params.append('client_secret', client_secret);
  params.append('grant_type', 'client_credentials');
  params.append('scope', scope);

  const response = await fetch(`${dataCenterUrl}/oauth/v2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Erro ao obter token');
  }

  return result;
}

module.exports = { generateAccessToken };
