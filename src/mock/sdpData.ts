/**
 * Dados simulados para desenvolvimento e testes
 * Use estes dados quando não tiver acesso à API real do ServiceDesk Plus
 */

import { SDPRequest, SDPTechnician, SDPDepartment, SDPAsset } from '../types/sdp';

/**
 * Chamados simulados
 */
export const mockRequests: SDPRequest[] = [
  {
    id: "1001",
    subject: "Problema com login no sistema",
    description: "Não consigo acessar o sistema após atualização",
    status: { id: "1", name: "Aberto" },
    priority: { id: "2", name: "Alta" },
    requester: { id: "101", name: "João Silva", email: "joao@exemplo.com" },
    technician: { id: "201", name: "Ana Técnica" },
    created_time: "2025-05-15T10:30:00Z",
    due_by_time: "2025-05-16T10:30:00Z",
    department: { id: "301", name: "TI" },
    category: { id: "401", name: "Software" },
    is_overdue: false
  },
  {
    id: "1002",
    subject: "Impressora não funciona",
    description: "A impressora do departamento administrativo não está imprimindo",
    status: { id: "2", name: "Em andamento" },
    priority: { id: "3", name: "Média" },
    requester: { id: "102", name: "Maria Oliveira", email: "maria@exemplo.com" },
    technician: { id: "202", name: "Carlos Suporte" },
    created_time: "2025-05-16T09:15:00Z",
    due_by_time: "2025-05-17T09:15:00Z",
    department: { id: "302", name: "Administrativo" },
    category: { id: "402", name: "Hardware" },
    is_overdue: true
  },
  {
    id: "1003",
    subject: "Solicitação de novo laptop",
    description: "Preciso de um novo laptop para o novo funcionário",
    status: { id: "3", name: "Pendente" },
    priority: { id: "4", name: "Baixa" },
    requester: { id: "103", name: "Pedro Santos", email: "pedro@exemplo.com" },
    technician: { id: "201", name: "Ana Técnica" },
    created_time: "2025-05-17T14:20:00Z",
    due_by_time: "2025-05-20T14:20:00Z",
    department: { id: "303", name: "Vendas" },
    category: { id: "403", name: "Solicitação" },
    is_overdue: false
  },
  {
    id: "1004",
    subject: "Erro no sistema financeiro",
    description: "O sistema financeiro está apresentando erro ao gerar relatórios",
    status: { id: "4", name: "Resolvido" },
    priority: { id: "2", name: "Alta" },
    requester: { id: "104", name: "Carla Finanças", email: "carla@exemplo.com" },
    technician: { id: "203", name: "Roberto Especialista" },
    created_time: "2025-05-14T08:45:00Z",
    due_by_time: "2025-05-15T08:45:00Z",
    department: { id: "304", name: "Financeiro" },
    category: { id: "401", name: "Software" },
    is_overdue: false
  },
  {
    id: "1005",
    subject: "Acesso ao sistema de RH",
    description: "Preciso de acesso ao sistema de RH para cadastrar novos funcionários",
    status: { id: "1", name: "Aberto" },
    priority: { id: "3", name: "Média" },
    requester: { id: "105", name: "Juliana RH", email: "juliana@exemplo.com" },
    technician: { id: "202", name: "Carlos Suporte" },
    created_time: "2025-05-18T11:10:00Z",
    due_by_time: "2025-05-19T11:10:00Z",
    department: { id: "305", name: "Recursos Humanos" },
    category: { id: "404", name: "Acesso" },
    is_overdue: true
  }
];

/**
 * Técnicos simulados
 */
export const mockTechnicians: SDPTechnician[] = [
  {
    id: "201",
    name: "Ana Técnica",
    email: "ana@exemplo.com",
    phone: "11 98765-4321",
    department: { id: "301", name: "TI" },
    is_active: true
  },
  {
    id: "202",
    name: "Carlos Suporte",
    email: "carlos@exemplo.com",
    phone: "11 91234-5678",
    department: { id: "301", name: "TI" },
    is_active: true
  },
  {
    id: "203",
    name: "Roberto Especialista",
    email: "roberto@exemplo.com",
    phone: "11 99876-5432",
    department: { id: "301", name: "TI" },
    is_active: true
  },
  {
    id: "204",
    name: "Fernanda Analista",
    email: "fernanda@exemplo.com",
    phone: "11 95555-4444",
    department: { id: "301", name: "TI" },
    is_active: false
  }
];

/**
 * Departamentos simulados
 */
export const mockDepartments: SDPDepartment[] = [
  {
    id: "301",
    name: "TI",
    description: "Departamento de Tecnologia da Informação"
  },
  {
    id: "302",
    name: "Administrativo",
    description: "Departamento Administrativo"
  },
  {
    id: "303",
    name: "Vendas",
    description: "Departamento de Vendas"
  },
  {
    id: "304",
    name: "Financeiro",
    description: "Departamento Financeiro"
  },
  {
    id: "305",
    name: "Recursos Humanos",
    description: "Departamento de Recursos Humanos"
  }
];

/**
 * Ativos simulados
 */
export const mockAssets: SDPAsset[] = [
  {
    id: "501",
    name: "Laptop Dell XPS 13",
    asset_type: { id: "601", name: "Laptop" },
    product: { id: "701", name: "Dell XPS 13" },
    assigned_to: { id: "101", name: "João Silva" },
    department: { id: "301", name: "TI" },
    location: { id: "801", name: "Sede Principal" },
    status: { id: "901", name: "Em uso" }
  },
  {
    id: "502",
    name: "Impressora HP LaserJet",
    asset_type: { id: "602", name: "Impressora" },
    product: { id: "702", name: "HP LaserJet Pro" },
    assigned_to: { id: "102", name: "Maria Oliveira" },
    department: { id: "302", name: "Administrativo" },
    location: { id: "801", name: "Sede Principal" },
    status: { id: "902", name: "Em manutenção" }
  },
  {
    id: "503",
    name: "Monitor LG 27\"",
    asset_type: { id: "603", name: "Monitor" },
    product: { id: "703", name: "LG UltraGear" },
    assigned_to: { id: "103", name: "Pedro Santos" },
    department: { id: "303", name: "Vendas" },
    location: { id: "802", name: "Filial Sul" },
    status: { id: "901", name: "Em uso" }
  },
  {
    id: "504",
    name: "Servidor Dell PowerEdge",
    asset_type: { id: "604", name: "Servidor" },
    product: { id: "704", name: "Dell PowerEdge R740" },
    department: { id: "301", name: "TI" },
    location: { id: "803", name: "Data Center" },
    status: { id: "901", name: "Em uso" }
  },
  {
    id: "505",
    name: "iPhone 13 Pro",
    asset_type: { id: "605", name: "Smartphone" },
    product: { id: "705", name: "Apple iPhone 13 Pro" },
    assigned_to: { id: "104", name: "Carla Finanças" },
    department: { id: "304", name: "Financeiro" },
    location: { id: "801", name: "Sede Principal" },
    status: { id: "901", name: "Em uso" }
  }
];

/**
 * Função para simular resposta da API
 */
export function createMockResponse<T>(data: T): { response_status: { status_code: number; status: string }; data: T } {
  return {
    response_status: {
      status_code: 200,
      status: "success"
    },
    data
  };
}
