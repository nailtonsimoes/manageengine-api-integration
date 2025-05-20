// Tipos para as respostas da API do ServiceDesk Plus
export interface SDPResponse<T> {
  response_status: {
    status_code: number;
    status: string;
    message?: string;
  };
  data?: T;
}

// Interface para um chamado (request) no ServiceDesk Plus
export interface SDPRequest {
  id: string;
  subject: string;
  description?: string;
  requester?: {
    id: string;
    name: string;
    email?: string;
  };
  technician?: {
    id: string;
    name: string;
  };
  status?: {
    id: string;
    name: string;
  };
  priority?: {
    id: string;
    name: string;
  };
  created_time?: string;
  due_by_time?: string;
  department?: {
    id: string;
    name: string;
  };
  category?: {
    id: string;
    name: string;
  };
  is_overdue?: boolean;
}

// Interface para um técnico no ServiceDesk Plus
export interface SDPTechnician {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  department?: {
    id: string;
    name: string;
  };
  is_active?: boolean;
}

// Interface para um departamento no ServiceDesk Plus
export interface SDPDepartment {
  id: string;
  name: string;
  description?: string;
}

// Interface para um ativo no ServiceDesk Plus
export interface SDPAsset {
  id: string;
  name: string;
  asset_type?: {
    id: string;
    name: string;
  };
  product?: {
    id: string;
    name: string;
  };
  assigned_to?: {
    id: string;
    name: string;
  };
  department?: {
    id: string;
    name: string;
  };
  location?: {
    id: string;
    name: string;
  };
  status?: {
    id: string;
    name: string;
  };
}
