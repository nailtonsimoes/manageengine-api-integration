import { sdpService } from '../services/sdpService';
import { analyticsService } from '../services/analyticsService';
import { validateConfig } from '../config/config';

/**
 * Script para executar a integração completa entre ServiceDesk Plus e Analytics Plus
 */
async function runIntegration() {
  console.log('Iniciando integração ServiceDesk Plus -> Analytics Plus');
  
  // Validar configuração
  if (!validateConfig()) {
    console.error('Configuração inválida. Verifique o arquivo .env');
    process.exit(1);
  }
  
  try {
    // 1. Buscar dados do ServiceDesk Plus
    console.log('\nBuscando dados do ServiceDesk Plus...');
    
    const [requestsResponse, techniciansResponse, departmentsResponse] = await Promise.all([
      sdpService.getRequests(),
      sdpService.getTechnicians(),
      sdpService.getDepartments()
    ]);
    
    console.log(`Chamados: ${requestsResponse.data?.length || 0}`);
    console.log(`Técnicos: ${techniciansResponse.data?.length || 0}`);
    console.log(`Departamentos: ${departmentsResponse.data?.length || 0}`);
    
    // 2. Processar dados para formato adequado ao Analytics Plus
    console.log('\nProcessando dados...');
    
    // Processar chamados
    const processedRequests = requestsResponse.data?.map(request => ({
      id: request.id,
      subject: request.subject,
      status: request.status?.name || 'N/A',
      priority: request.priority?.name || 'N/A',
      requester: request.requester?.name || 'N/A',
      technician: request.technician?.name || 'N/A',
      created_time: request.created_time || 'N/A',
      department: request.department?.name || 'N/A',
      is_overdue: request.is_overdue ? 'Sim' : 'Não'
    })) || [];
    
    // 3. Criar workspace no Analytics Plus (se não existir)
    console.log('\nConfigurando workspace no Analytics Plus...');
    const workspaceName = 'SDPIntegration';
    
    try {
      await analyticsService.createWorkspace(
        workspaceName,
        'Integração ServiceDesk Plus - Analytics Plus'
      );
      console.log(`Workspace '${workspaceName}' criado com sucesso!`);
    } catch (error) {
      console.log(`Workspace '${workspaceName}' já existe ou ocorreu um erro.`);
    }
    
    // 4. Importar dados para o Analytics Plus
    console.log('\nImportando dados para o Analytics Plus...');
    
    // Converter para CSV
    const csvData = convertToCSV(processedRequests);
    
    // Importar para o Analytics Plus
    try {
      const importResult = await analyticsService.importData(
        workspaceName,
        'Requests',
        csvData,
        { createTable: true, truncate: true }
      );
      console.log('Dados importados com sucesso!');
    } catch (error) {
      console.error('Erro ao importar dados:', error);
    }
    
    console.log('\nIntegração concluída!');
    
  } catch (error) {
    console.error('Erro durante a integração:', error);
  }
}

/**
 * Função auxiliar para converter array de objetos para CSV
 */
function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [];
  
  // Adiciona o cabeçalho
  csvRows.push(headers.join(','));
  
  // Adiciona as linhas
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header] || '';
      // Escapa aspas duplas e envolve em aspas se contiver vírgula
      const escaped = String(value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}

// Executar o script
runIntegration().catch(console.error);
