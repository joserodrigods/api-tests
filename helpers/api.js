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
  const http = axios.create({
    baseURL: getApiBaseUrl(),
    validateStatus() {
      return true;
    },
  });

  return {
    async getAuthenticatedMember() {
      const { key, token } = getAuthParams();
      return http.get('/members/me', { params: { key, token } });
    },

    async getAuthenticatedMemberWithoutApiKey() {
      const token = process.env.API_TOKEN;
      if (!token) {
        throw new Error('Set API_TOKEN in .env');
      }
      return http.get('/members/me', { params: { token } });
    },

    async getAuthenticatedMemberWithInvalidToken() {
      const key = process.env.API_KEY;
      if (!key) {
        throw new Error('Set API_KEY in .env');
      }
      return http.get('/members/me', { params: { key, token: 'tokeninvalidoaqui123' } });
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

    async createCard(name, listId = process.env.LIST_TODO_ID) {
      if (!listId) {
        throw new Error('Set LIST_TODO_ID in .env or pass listId');
      }
      if (!name) {
        throw new Error('Card name is required');
      }
      const { key, token } = getAuthParams();
      return http.post('/cards', null, {
        params: { key, token, idList: listId, name },
      });
    },

    async createCardWithoutName(listId = process.env.LIST_TODO_ID) {
      if (!listId) {
        throw new Error('Set LIST_TODO_ID in .env or pass listId');
      }
      const { key, token } = getAuthParams();
      return http.post('/cards', null, {
        params: { key, token, idList: listId },
      });
    },

    async createCardWithoutAuth(name = 'Card Teste', listId = process.env.LIST_TODO_ID) {
      if (!listId) {
        throw new Error('Set LIST_TODO_ID in .env or pass listId');
      }
      return http.post('/cards', null, {
        params: { idList: listId, name },
      });
    },
  };
}

module.exports = { createClient, getAuthParams };
