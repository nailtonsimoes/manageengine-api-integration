import fetch from 'node-fetch';
import { config } from '../config/config';

/**
 * Interface para resposta de token OAuth
 */
export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type?: string;
}

/**
 * Classe de serviço para autenticação OAuth 2.0 com ServiceDesk Plus
 */
export class AuthService {
  // Tornando as propriedades públicas para permitir acesso direto
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  
  constructor(clientId?: string, clientSecret?: string, redirectUri?: string) {
    // Usa valores do config ou os fornecidos no construtor
    this.clientId = clientId || 'seu_client_id';
    this.clientSecret = clientSecret || 'seu_client_secret';
    this.redirectUri = redirectUri || 'sua_redirect_uri';
  }
  
  /**
   * Obtém um access token usando um código de autorização
   */
  async getAccessToken(code: string): Promise<TokenResponse> {
    const url = 'https://accounts.zoho.com/oauth/v2/token';
    
    const params = new URLSearchParams();
    params.append('code', code);
    params.append('client_id', this.clientId);
    params.append('client_secret', this.clientSecret);
    params.append('redirect_uri', this.redirectUri);
    params.append('grant_type', 'authorization_code');
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: params as any
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao obter token: ${response.status} ${response.statusText}`);
      }
      
      return await response.json() as TokenResponse;
    } catch (error) {
      console.error('Erro ao obter access token:', error);
      throw error;
    }
  }
  
  /**
   * Renova um access token usando um refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
    const url = 'https://accounts.zoho.com/oauth/v2/token';
    
    const params = new URLSearchParams();
    params.append('refresh_token', refreshToken);
    params.append('client_id', this.clientId);
    params.append('client_secret', this.clientSecret);
    params.append('grant_type', 'refresh_token');
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: params as any
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao renovar token: ${response.status} ${response.statusText}`);
      }
      
      return await response.json() as TokenResponse;
    } catch (error) {
      console.error('Erro ao renovar access token:', error);
      throw error;
    }
  }
  
  /**
   * Gera a URL de autorização para obter o código de autorização
   */
  generateAuthorizationUrl(scope: string): string {
    const baseUrl = 'https://accounts.zoho.com/oauth/v2/auth';
    
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      scope,
      redirect_uri: this.redirectUri,
      access_type: 'offline'
    });
    
    return `${baseUrl}?${params.toString()}`;
  }
}

// Exporta uma instância única do serviço
export const authService = new AuthService();

export default authService;
