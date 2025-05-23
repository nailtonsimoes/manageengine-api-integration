const { chromium } = require('playwright');

(async () => {
  const email = 'simoesxnailton@gmail.com';
  const password = 'Morgan@07';

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Acesse a página inicial do Analytics Plus Cloud
    await page.goto('https://analyticsplus.manageengine.com');
    await page.waitForLoadState('domcontentloaded');

    
    // Simula o login
    await page.fill('input[name="LOGIN_ID"]', email);
    await page.getByRole('button', { name: 'Próximo' }).click();
    await page.waitForLoadState('domcontentloaded');
    
    
    // Aguarde o campo de senha aparecer e preencha
    await page.waitForSelector('input[type="password"]');
    await page.fill('input[type="password"]', password);
    await page.getByRole('button', { name: 'Fazer login' }).click();
    await page.waitForLoadState('domcontentloaded');
    
    // Aguarde o redirecionamento ou dashboard carregar
    await page.waitForLoadState('networkidle');
    
    await page.pause();
    // Simula navegação para a área de relatórios (ajuste o seletor conforme necessário)
    await page.goto('https://analyticsplus.manageengine.com/app/<portal>/reports');
    
    // Aguarde algo que confirme que a página de relatórios carregou
    await page.waitForSelector('text=Relatórios');

    console.log('Login e navegação realizados com sucesso.');
  } catch (error) {
    console.error('Erro durante automação:', error.message);
  } finally {
    await browser.close();
  }
})();