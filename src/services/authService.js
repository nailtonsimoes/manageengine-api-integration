import fetch from 'node-fetch';
import config from '../config/config';

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type?: string;
  api_domain?: string;
}

export class AuthService {
  private readonly baseUrl = 'https://accounts.zoho.com/oauth/v2';
  private readonly clientId = config.zoho.clientId;
  private readonly clientSecret = config.zoho.clientSecret;
  private readonly redirectUri = config.zoho.redirectUri;

  generateAuthorizationUrl(scope: string): string {
    const url = new URL(`${this.baseUrl}/auth`);
    url.searchParams.set('client_id', this.clientId);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', scope);
    url.searchParams.set('redirect_uri', this.redirectUri);
    url.searchParams.set('access_type', 'offline');
    return url.toString();
  }

  async getAccessToken(code: string): Promise<TokenResponse> {
    const params = new URLSearchParams({
      code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      grant_type: 'authorization_code'
    });

    const response = await fetch(`${this.baseUrl}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    if (!response.ok) {
      throw new Error(`Erro ao obter access token: ${response.statusText}`);
    }

    return response.json();
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
    const params = new URLSearchParams({
      refresh_token: refreshToken,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'refresh_token'
    });

    const response = await fetch(`${this.baseUrl}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    if (!response.ok) {
      throw new Error(`Erro ao renovar token: ${response.statusText}`);
    }

    return response.json();
  }
}

export const authService = new AuthService();
