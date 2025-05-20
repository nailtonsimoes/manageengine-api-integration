import { validateConfig } from '../config/config';
import { sdpService } from '../services/sdpService';
import { SDPRequest } from '../types/sdp';

/**
 * Função simples para testar a conexão com o ServiceDesk Plus
 */
async function testSDPConnection() {
  console.log('Testando conexão com ServiceDesk Plus...');
  
  try {
    const requestsResponse = await sdpService.getRequests();
    console.log('Resposta da API:', JSON.stringify(requestsResponse, null, 2));
    console.log(`Total de chamados: ${requestsResponse.data?.length || 0}`);
    
    // Se houver dados, exibe os primeiros 2 chamados
    if (requestsResponse.data && requestsResponse.data.length > 0) {
      console.log('\nDetalhes dos primeiros chamados:');
      requestsResponse.data.slice(0, 2).forEach((request: SDPRequest, index: number) => {
        console.log(`\nChamado #${index + 1}:`);
        console.log(`ID: ${request.id}`);
        console.log(`Assunto: ${request.subject}`);
        console.log(`Status: ${request.status?.name || 'N/A'}`);
        console.log(`Solicitante: ${request.requester?.name || 'N/A'}`);
        console.log(`Técnico: ${request.technician?.name || 'N/A'}`);
      });
    }
  } catch (error) {
    console.error('Erro ao conectar com ServiceDesk Plus:', error);
  }
}

// Valida configuração e executa o teste
if (validateConfig()) {
  testSDPConnection();
} else {
  console.error('Configuração inválida. Verifique o arquivo .env');
}
