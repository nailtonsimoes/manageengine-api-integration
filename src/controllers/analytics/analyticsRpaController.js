const { runAnalyticsRPA } = require('../../services/analyticsRpaService');

async function executeRPA(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  const result = await runAnalyticsRPA({ email, password });
  return res.status(result.success ? 200 : 500).json(result);
}

module.exports = { executeRPA };
