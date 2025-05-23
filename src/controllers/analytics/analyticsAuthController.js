const { generateAnalyticsAuthToken } = require('../../services/analyticsService');

async function generateAuthToken(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  try {
    const authToken = await generateAnalyticsAuthToken(email, password);
    return res.status(200).json({ authToken });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  generateAuthToken,
};
