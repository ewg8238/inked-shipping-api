// getUpsToken.js
const axios = require('axios');

const getUpsToken = async () => {
  const clientId = process.env.UPS_CLIENT_ID;
  const clientSecret = process.env.UPS_CLIENT_SECRET;

  try {
    const response = await axios.post(
      'https://wwwcie.ups.com/security/v1/oauth/token',
      new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
          username: clientId,
          password: clientSecret,
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('UPS OAuth error:', error.response?.data || error.message);
    return null;
  }
};

module.exports = getUpsToken;
