import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export interface Config {
  sdp: {
    apiUrl: string;
    userEmail: string;
    userPassword: string;
  };
  analytics: {
    apiUrl: string;
  };
}

export const config: Config = {
  sdp: {
    apiUrl: process.env.SDP_API_URL || '',
    userEmail: process.env.USER_EMAIL || '',
    userPassword: process.env.USER_PASSWORD || '',
  },
  analytics: {
    apiUrl: process.env.ANALYTICS_API_URL || '',
  }
};

export function validateConfig(): boolean {
  if (!config.sdp.apiUrl) {
    console.error('Erro: SDP_API_URL não definido no arquivo .env');
    return false;
  }

  if (!config.sdp.userEmail || !config.sdp.userPassword) {
    console.error('Erro: USER_EMAIL e USER_PASSWORD não definidos no .env');
    return false;
  }

  if (!config.analytics.apiUrl) {
    console.error('Erro: ANALYTICS_API_URL não definido no arquivo .env');
    return false;
  }

  return true;
}

export default config;
