import { authService } from '../services/authService';
import { sdpService } from '../services/sdpService';
import { config } from '../config/config';

/**
 * Script para demonstrar o fluxo completo de OAuth 2.0
 */
async function demonstrateOAuthFlow() {
  // 1. Usar a instância existente do authService e configurar com valores do config
  const auth = authService;
  
  // Configurar as credenciais a partir do config
  if (config.oauth) {
    auth.clientId = config.oauth.clientId;
    auth.clientSecret = config.oauth.clientSecret;
    auth.redirectUri = config.oauth.redirectUri;
  }
  
  // 2. Gerar URL de autorização
  const scope = 'SDPOnDemand.requests.ALL,SDPOnDemand.assets.READ';
  const authUrl = auth.generateAuthorizationUrl(scope);
  console.log(`\n1. Acesse esta URL para autorizar:`);
  console.log(authUrl);
  console.log('\n2. Após autorizar, você será redirecionado para sua redirect_uri com um código.');
  console.log('   Copie o parâmetro "code" da URL e execute este script novamente com:');
  console.log('   npx ts-node src/scripts/oauthFlow.ts CÓDIGO_AQUI\n');
  
  // 3. Se um código foi fornecido como argumento, obter tokens
  const authCode = process.argv[2];
  if (authCode) {
    try {
      console.log(`Obtendo tokens com o código: ${authCode}`);
      const tokenResponse = await auth.getAccessToken(authCode);
      
      console.log('\nTokens obtidos com sucesso:');
      console.log('Access Token:', tokenResponse.access_token);
      console.log('Refresh Token:', tokenResponse.refresh_token);
      console.log('Expira em:', tokenResponse.expires_in, 'segundos');
      
      // 4. Usar o token para fazer uma chamada à API
      console.log('\nTestando o token com uma chamada à API...');
      sdpService.setToken(tokenResponse.access_token);
      
      const requests = await sdpService.getRequests();
      console.log(`Chamados encontrados: ${requests.data?.length || 0}`);
      
      // 5. Salvar tokens para uso futuro
      console.log('\nSalve estes tokens em seu .env:');
      console.log(`SDP_TOKEN=${tokenResponse.access_token}`);
      console.log('\nGuarde o refresh token para renovar o access token quando expirar:');
      console.log(`REFRESH_TOKEN=${tokenResponse.refresh_token}`);
    } catch (error) {
      console.error('Erro no fluxo OAuth:', error);
    }
  }
}

// Executar o script
demonstrateOAuthFlow().catch(console.error);
