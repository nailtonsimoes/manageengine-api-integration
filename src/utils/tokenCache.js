let tokenData = null;

function setToken(accessToken, expiresInSeconds) {
  tokenData = {
    access_token: accessToken,
    expires_at: Date.now() + expiresInSeconds * 1000
  };
}

function getToken() {
  if (tokenData && Date.now() < tokenData.expires_at) {
    return tokenData.access_token;
  }
  return null;
}

module.exports = {
  setToken,
  getToken,
};
