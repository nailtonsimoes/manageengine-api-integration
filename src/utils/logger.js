function logTokenUsage({ token, action, endpoint }) {
  const time = new Date().toISOString();
  console.log(`[${time}] Token usado para ${action} em ${endpoint}`);
}

module.exports = { logTokenUsage };