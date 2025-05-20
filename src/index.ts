import { validateConfig } from './config/config';
import { loginAndFetchData } from './services/sdpService';

async function main() {
  console.log('Iniciando integração ServiceDesk Plus -> Analytics Plus');

  // Valida .env
  if (!validateConfig()) {
    process.exit(1);
  }

  try {
    const dados = await loginAndFetchData();
    console.log('Integração concluída com sucesso!');
    // Aqui você pode processar os dados recebidos, enviar para o Analytics, etc.
  } catch (error) {
    console.error('Falha na integração:', error);
    process.exit(1);
  }
}

main();
