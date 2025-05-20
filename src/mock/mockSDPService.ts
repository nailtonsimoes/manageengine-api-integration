import { SDPService } from '../services/sdpService';
import { mockRequests, mockTechnicians, mockDepartments, mockAssets, createMockResponse } from '../mock/sdpData';
import { SDPResponse, SDPRequest, SDPTechnician, SDPDepartment, SDPAsset } from '../types/sdp';

/**
 * Versão modificada do SDPService que usa dados simulados
 * para desenvolvimento e testes sem acesso à API real
 */
export class MockSDPService extends SDPService {
  /**
   * Sobrescreve o método de busca de chamados para usar dados simulados
   */
  async getRequests(params: Record<string, string> = {}): Promise<SDPResponse<SDPRequest[]>> {
    console.log('Usando dados simulados para chamados');
    return createMockResponse(mockRequests);
  }

  /**
   * Sobrescreve o método de busca de chamado por ID para usar dados simulados
   */
  async getRequestById(id: string): Promise<SDPResponse<SDPRequest>> {
    console.log(`Buscando chamado simulado com ID: ${id}`);
    const request = mockRequests.find(req => req.id === id);
    
    if (request) {
      return createMockResponse(request);
    }
    
    return {
      response_status: {
        status_code: 404,
        status: "error",
        message: "Chamado não encontrado"
      }
    };
  }

  /**
   * Sobrescreve o método de busca de técnicos para usar dados simulados
   */
  async getTechnicians(): Promise<SDPResponse<SDPTechnician[]>> {
    console.log('Usando dados simulados para técnicos');
    return createMockResponse(mockTechnicians);
  }

  /**
   * Sobrescreve o método de busca de departamentos para usar dados simulados
   */
  async getDepartments(): Promise<SDPResponse<SDPDepartment[]>> {
    console.log('Usando dados simulados para departamentos');
    return createMockResponse(mockDepartments);
  }

  /**
   * Sobrescreve o método de busca de ativos para usar dados simulados
   */
  async getAssets(params: Record<string, string> = {}): Promise<SDPResponse<SDPAsset[]>> {
    console.log('Usando dados simulados para ativos');
    return createMockResponse(mockAssets);
  }
}

// Exporta uma instância única do serviço simulado
export const mockSdpService = new MockSDPService();

export default mockSdpService;
