import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import https from 'https';

// Carrega as variáveis de ambiente
dotenv.config();

// Agente para permitir certificados autoassinados (útil em ambientes de desenvolvimento)
const agent = new https.Agent({
  rejectUnauthorized: false
});

/**
 * Gera token para o Analytics Plus usando email e senha
 */
async function generateAnalyticsToken() {
  const email = process.env.USER_EMAIL;
  const password = process.env.USER_PASSWORD;
  
  // Usa a URL específica fornecida pelo usuário
  const analyticsUrl = process.env.ANALYTICS_API_URL || 'https://analyticsplus.manageengine.com';
  const port = process.env.ANALYTICS_PORT || '8443';
  
  // Extrai o hostname da URL
  const hostname = analyticsUrl.replace(/^https?:\/\//, '').split('/')[0];
  
  if (!email || !password) {
    console.error('Erro: USER_EMAIL ou USER_PASSWORD não definidos no arquivo .env');
    return null;
  }
  
  const url = `https://${hostname}:${port}/iam/apiauthtoken/nb/create?SCOPE=ZROP/reportsapi&EMAIL_ID=${encodeURIComponent(email)}&PASSWORD=${encodeURIComponent(password)}`;
  
  try {
    console.log('Gerando token para Analytics Plus...');
    console.log(`URL: ${url}`);
    
    const response = await fetch(url, { 
      method: 'POST',
      agent 
    });
    
    const text = await response.text();
    console.log('Resposta bruta:', text);
    
    // O token vem em formato de texto com linhas como:
    // AUTHTOKEN=abc123def456
    // RESULT=TRUE
    const tokenMatch = text.match(/AUTHTOKEN=([^\n]+)/);
    const resultMatch = text.match(/RESULT=([^\n]+)/);
    
    if (tokenMatch && resultMatch && resultMatch[1] === 'TRUE') {
      const token = tokenMatch[1];
      console.log('Token do Analytics Plus gerado com sucesso!');
      return token;
    } else {
      console.error('Erro ao gerar token do Analytics Plus. Verifique as credenciais.');
      return null;
    }
  } catch (error) {
    console.error('Erro ao gerar token do Analytics Plus:', error);
    return null;
  }
}

/**
 * Gera token para o ServiceDesk Plus usando OAuth 2.0 conforme documentação
 */
async function generateSDPToken() {
  const email = process.env.USER_EMAIL;
  const password = process.env.USER_PASSWORD;
  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;
  const sdpUrl = process.env.SDP_API_URL;
  
  if (!email || !password) {
    console.error('Erro: USER_EMAIL ou USER_PASSWORD não definidos no arquivo .env');
    return null;
  }
  
  // Se não tiver client_id e client_secret, não pode gerar token OAuth
  if (!clientId || !clientSecret) {
    console.warn('Aviso: OAUTH_CLIENT_ID ou OAUTH_CLIENT_SECRET não definidos. Não é possível gerar token SDP.');
    console.warn('Você precisa registrar uma aplicação no console de desenvolvedor do Zoho para obter estas credenciais.');
    return null;
  }
  
  try {
    console.log('Gerando token para ServiceDesk Plus...');
    
    // Baseado na documentação: https://www.manageengine.com/products/service-desk/sdpod-v3-api/getting-started/oauth-2.0.html#api-example
    // Primeiro, precisamos obter um código de autorização (grant token)
    
    // Normalmente, este passo requer interação do usuário no navegador
    // Para fins de automação, vamos tentar o fluxo de senha (se disponível)
    
    // Extrai o datacenter da URL do SDP
    const datacenter = sdpUrl ? sdpUrl.match(/https:\/\/([^.]+)\./) : null;
    const datacenterId = datacenter ? datacenter[1] : 'accounts.zoho';
    
    const tokenUrl = `https://${datacenterId}.com/oauth/v2/token`;
    
    console.log(`Tentando obter token via ${tokenUrl}`);
    
    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('grant_type', 'password'); // Tenta usar o fluxo de senha (pode não ser suportado)
    params.append('username', email);
    params.append('password', password);
    
    const response = await fetch(tokenUrl, {
      method: 'POST',
      body: params as any,
      agent
    });
    
    const data = await response.json();
    
    if (data.access_token) {
      console.log('Token do ServiceDesk Plus gerado com sucesso!');
      return data.access_token;
    } else {
      console.error('Resposta não contém access_token:', data);
      console.log('\nO fluxo de senha pode não ser suportado. Tente usar o script oauthFlow.ts para o fluxo completo de OAuth.');
      return null;
    }
  } catch (error) {
    console.error('Erro ao gerar token do ServiceDesk Plus:', error);
    console.log('\nO ServiceDesk Plus geralmente requer um fluxo OAuth mais complexo.');
    console.log('Considere usar o script oauthFlow.ts para o fluxo completo de OAuth.');
    return null;
  }
}

/**
 * Atualiza o arquivo .env com os tokens gerados
 */
async function updateEnvFile(analyticsToken: string | null, sdpToken: string | null) {
  const envPath = path.resolve(process.cwd(), '.env');
  
  try {
    // Verifica se o arquivo .env existe
    if (!fs.existsSync(envPath)) {
      console.error('Arquivo .env não encontrado. Criando a partir do .env.example...');
      
      // Tenta copiar do .env.example se existir
      const examplePath = path.resolve(process.cwd(), '.env.example');
      if (fs.existsSync(examplePath)) {
        fs.copyFileSync(examplePath, envPath);
      } else {
        // Cria um arquivo .env básico
        fs.writeFileSync(envPath, `
# Credenciais de usuário
USER_EMAIL=
USER_PASSWORD=

# ServiceDesk Plus
SDP_API_URL=
SDP_TOKEN=

# OAuth 2.0 Configurações
OAUTH_CLIENT_ID=
OAUTH_CLIENT_SECRET=
OAUTH_REDIRECT_URI=http://localhost:3000/callback

# Analytics Plus
ANALYTICS_API_URL=https://analyticsplus.manageengine.com
ANALYTICS_PORT=8443
ANALYTICS_TOKEN=
        `);
      }
    }
    
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Atualiza o token do Analytics Plus
    if (analyticsToken) {
      if (envContent.includes('ANALYTICS_TOKEN=')) {
        envContent = envContent.replace(/ANALYTICS_TOKEN=.*$/m, `ANALYTICS_TOKEN=${analyticsToken}`);
      } else {
        envContent += `\nANALYTICS_TOKEN=${analyticsToken}`;
      }
    }
    
    // Atualiza o token do ServiceDesk Plus
    if (sdpToken) {
      if (envContent.includes('SDP_TOKEN=')) {
        envContent = envContent.replace(/SDP_TOKEN=.*$/m, `SDP_TOKEN=${sdpToken}`);
      } else {
        envContent += `\nSDP_TOKEN=${sdpToken}`;
      }
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log('Arquivo .env atualizado com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar arquivo .env:', error);
  }
}

/**
 * Função principal que executa o fluxo de geração de tokens
 */
async function main() {
  console.log('Iniciando geração de tokens...');
  
  // Gera token do Analytics Plus
  const analyticsToken = await generateAnalyticsToken();
  
  // Gera token do ServiceDesk Plus (pode não funcionar diretamente)
  const sdpToken = await generateSDPToken();
  
  // Atualiza o arquivo .env
  await updateEnvFile(analyticsToken, sdpToken);
  
  console.log('\nProcesso concluído!');
  
  if (analyticsToken) {
    console.log('Token do Analytics Plus:', analyticsToken);
  } else {
    console.log('Não foi possível gerar o token do Analytics Plus.');
    console.log('Verifique suas credenciais e a URL do Analytics Plus.');
  }
  
  if (sdpToken) {
    console.log('Token do ServiceDesk Plus:', sdpToken);
  } else {
    console.log('Não foi possível gerar o token do ServiceDesk Plus.');
    console.log('Nota: O ServiceDesk Plus geralmente requer um fluxo OAuth mais complexo.');
    console.log('Considere usar o script oauthFlow.ts para o fluxo completo de OAuth.');
  }
}

// Executa o script
main().catch(console.error);
