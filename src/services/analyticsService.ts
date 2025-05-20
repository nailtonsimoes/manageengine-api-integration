import fetch from 'node-fetch';
import { config } from '../config/config';

/**
 * Interface para respostas da API do Analytics Plus
 */
export interface AnalyticsResponse<T> {
  response_status?: {
    status_code: number;
    status: string;
    message?: string;
  };
  response?: T;
}

/**
 * Classe de serviço para interação com a API do Analytics Plus
 */
export class AnalyticsService {
  private baseUrl: string;
  private token: string;

  constructor() {
    this.baseUrl = config.analytics.apiUrl;
    this.token = config.analytics.token;
  }

  /**
   * Método genérico para fazer requisições à API do Analytics Plus
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<AnalyticsResponse<T>> {
    // Adiciona o token de autenticação à URL
    const authParam = `authtoken=${this.token}`;
    const separator = endpoint.includes('?') ? '&' : '?';
    const url = `${this.baseUrl}${endpoint}${separator}${authParam}`;
    
    // Cria um novo objeto de opções para evitar problemas de tipo
    const fetchOptions: any = {
      ...options,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...(options.headers || {})
      }
    };
    
    try {
      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
      }

      return await response.json() as AnalyticsResponse<T>;
    } catch (error) {
      console.error(`Erro ao acessar ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Cria um workspace no Analytics Plus
   */
  async createWorkspace(name: string, description: string): Promise<AnalyticsResponse<{ workspace_id: string }>> {
    const endpoint = `/workspace?ZOHO_ACTION=ADDWORKSPACE&ZOHO_OUTPUT_FORMAT=JSON&ZOHO_ERROR_FORMAT=JSON&ZOHO_API_VERSION=1.0`;
    
    const formData = new URLSearchParams();
    formData.append('WORKSPACE_NAME', name);
    formData.append('WORKSPACE_DESC', description);
    
    return this.request<{ workspace_id: string }>(endpoint, {
      method: 'POST',
      body: formData as any // Casting para evitar erro de tipo
    });
  }

  /**
   * Importa dados para uma tabela no Analytics Plus
   */
  async importData(
    workspaceName: string, 
    tableName: string, 
    data: string, 
    options: { createTable?: boolean, truncate?: boolean } = {}
  ): Promise<AnalyticsResponse<{ table_id: string }>> {
    const createTable = options.createTable ? 'TRUE' : 'FALSE';
    const importType = options.truncate ? 'TRUNCATEADD' : 'APPEND';
    
    const endpoint = `/${workspaceName}/${tableName}?ZOHO_ACTION=IMPORT&ZOHO_OUTPUT_FORMAT=JSON&ZOHO_ERROR_FORMAT=JSON&ZOHO_API_VERSION=1.0&ZOHO_IMPORT_TYPE=${importType}&ZOHO_ON_IMPORT_ERROR=ABORT&ZOHO_CREATE_TABLE=${createTable}`;
    
    const formData = new URLSearchParams();
    formData.append('ZOHO_FILE', data);
    
    return this.request<{ table_id: string }>(endpoint, {
      method: 'POST',
      body: formData as any // Casting para evitar erro de tipo
    });
  }

  /**
   * Cria um dashboard no Analytics Plus
   */
  async createDashboard(
    workspaceName: string, 
    dashboardName: string, 
    description: string
  ): Promise<AnalyticsResponse<{ dashboard_id: string }>> {
    const endpoint = `/${workspaceName}?ZOHO_ACTION=ADDDASHBOARD&ZOHO_OUTPUT_FORMAT=JSON&ZOHO_ERROR_FORMAT=JSON&ZOHO_API_VERSION=1.0`;
    
    const formData = new URLSearchParams();
    formData.append('DASHBOARD_NAME', dashboardName);
    formData.append('DASHBOARD_DESC', description);
    
    return this.request<{ dashboard_id: string }>(endpoint, {
      method: 'POST',
      body: formData as any // Casting para evitar erro de tipo
    });
  }
}

// Exporta uma instância única do serviço
export const analyticsService = new AnalyticsService();

export default analyticsService;
