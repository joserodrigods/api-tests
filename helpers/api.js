const axios = require('axios');

function getApiBaseUrl() {
  const raw = process.env.API_BASE_URL;
  if (!raw || !String(raw).trim()) {
    throw new Error('Set API_BASE_URL in .env (no trailing slash)');
  }
  return String(raw).trim().replace(/\/+$/, '');
}

function getAuthParams() {
  const key = process.env.API_KEY;
  const token = process.env.API_TOKEN;
  if (!key || !token) {
    throw new Error('Set API_KEY and API_TOKEN in .env');
  }
  return { key, token };
}

function createClient() {
  const http = axios.create({ baseURL: getApiBaseUrl() });

  return {
    async getAuthenticatedMember() {
      const { key, token } = getAuthParams();
      return http.get('/members/me', { params: { key, token } });
    },

    async getBoard(boardId = process.env.BOARD_ID) {
      if (!boardId) {
        throw new Error('Set BOARD_ID in .env');
      }
      const { key, token } = getAuthParams();
      return http.get(`/boards/${boardId}`, {
        params: { key, token, fields: 'id,name' },
      });
    },
  };
}

module.exports = { createClient, getAuthParams };
