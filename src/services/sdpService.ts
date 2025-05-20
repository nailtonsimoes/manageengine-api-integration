import fetch from 'node-fetch';
import config from '../config/config';

/**
 * Exemplo de chamada à API autenticando com email e senha.
 * Ajuste conforme a API real do SDP/Zoho.
 */
export async function loginAndFetchData() {
  const url = `${config.sdp.apiUrl}/api/v3/requests`; // exemplo de endpoint

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'TECHNICIAN_KEY': config.sdp.userPassword // ou outro header/token se necessário
  };

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`Erro ao buscar dados do SDP: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Dados recebidos do SDP:', data);
    return data;
  } catch (error) {
    console.error('Erro ao fazer login/fetch no SDP:', error);
    throw error;
  }
}
