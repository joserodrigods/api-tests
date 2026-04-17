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

  function safeJson(value) {
    if (value === undefined) {
      return 'undefined';
    }
    try {
      return JSON.stringify(value, null, 2);
    } catch (error) {
      return `[unserializable: ${error.message}]`;
    }
  }

  function maskSensitive(value) {
    if (!value || typeof value !== 'object') {
      return value;
    }
    const hiddenKeys = new Set(['key', 'token', 'apikey', 'api_key', 'authorization']);
    if (Array.isArray(value)) {
      return value.map(maskSensitive);
    }
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => {
        if (hiddenKeys.has(String(k).toLowerCase())) {
          return [k, '***'];
        }
        if (v && typeof v === 'object') {
          return [k, maskSensitive(v)];
        }
        return [k, v];
      })
    );
  }

  function fullUrlFromConfig(config) {
    try {
      return axios.getUri(config);
    } catch (error) {
      return `${config.baseURL || ''}${config.url || ''}`;
    }
  }

  http.interceptors.request.use((request) => {
    console.log(`
===== REQUEST =====
${String(request.method || 'GET').toUpperCase()} ${fullUrlFromConfig(request)}
Params: ${safeJson(maskSensitive(request.params))}
Body: ${safeJson(maskSensitive(request.data))}
===================
`);
    return request;
  });

  http.interceptors.response.use(
    (response) => {
      console.log(`
===== RESPONSE =====
Status: ${response.status}
URL: ${fullUrlFromConfig(response.config)}
Body: ${safeJson(maskSensitive(response.data))}
====================
`);
      return response;
    },
    (error) => {
      const status = error?.response?.status ?? 'NO_RESPONSE';
      const url = error?.config ? fullUrlFromConfig(error.config) : 'unknown-url';
      const body = error?.response?.data ?? error?.message;
      console.log(`
===== RESPONSE ERROR =====
Status: ${status}
URL: ${url}
Body: ${safeJson(maskSensitive(body))}
==========================
`);
      return Promise.reject(error);
    }
  );

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

    async createCardWithJson(name, idList, description) {
      if (!idList) {
        throw new Error('Set LIST_TODO_ID in .env or pass idList');
      }
      if (!name) {
        throw new Error('Card name is required');
      }
      const { key, token } = getAuthParams();
      const body = { name, idList };
      if (description !== undefined && description !== null && String(description).length > 0) {
        body.desc = description;
      }
      return http.post('/cards', body, {
        params: { key, token },
        headers: { 'Content-Type': 'application/json' },
      });
    },

    async getBoardLabels(boardId = process.env.BOARD_ID) {
      if (!boardId) {
        throw new Error('Set BOARD_ID in .env');
      }
      const { key, token } = getAuthParams();
      return http.get(`/boards/${boardId}/labels`, {
        params: { key, token, fields: 'id,color,name' },
      });
    },

    async getCard(cardId) {
      if (!cardId) {
        throw new Error('Card id is required');
      }
      const { key, token } = getAuthParams();
      return http.get(`/cards/${cardId}`, {
        params: {
          key,
          token,
          fields: 'id,name,desc,due,dueComplete,closed,pos,idLabels,idMembers,idList,idBoard,dateLastActivity',
        },
      });
    },

    async moveCardToList(cardId, listId) {
      if (!cardId) {
        throw new Error('Card id is required');
      }
      if (!listId) {
        throw new Error('List id is required');
      }
      const { key, token } = getAuthParams();
      return http.put(`/cards/${cardId}`, { idList: listId }, {
        params: { key, token },
        headers: { 'Content-Type': 'application/json' },
      });
    },

    async moveCardToListWithoutAuth(cardId, listId) {
      if (!cardId) {
        throw new Error('Card id is required');
      }
      if (!listId) {
        throw new Error('List id is required');
      }
      return http.put(`/cards/${cardId}`, { idList: listId }, {
        headers: { 'Content-Type': 'application/json' },
      });
    },

    async updateCardName(cardId, name) {
      if (!cardId) {
        throw new Error('Card id is required');
      }
      if (!name) {
        throw new Error('Card name is required');
      }
      const { key, token } = getAuthParams();
      return http.put(`/cards/${cardId}`, null, {
        params: { key, token, name },
      });
    },

    async updateCardDescription(cardId, description) {
      if (!cardId) {
        throw new Error('Card id is required');
      }
      const { key, token } = getAuthParams();
      return http.put(`/cards/${cardId}`, null, {
        params: { key, token, desc: description || '' },
      });
    },

    async updateCardDueDate(cardId, dueDateIso) {
      if (!cardId) {
        throw new Error('Card id is required');
      }
      if (!dueDateIso) {
        throw new Error('Due date is required');
      }
      const { key, token } = getAuthParams();
      return http.put(`/cards/${cardId}`, null, {
        params: { key, token, due: dueDateIso },
      });
    },

    async markCardDueComplete(cardId, dueComplete = true) {
      if (!cardId) {
        throw new Error('Card id is required');
      }
      const { key, token } = getAuthParams();
      return http.put(`/cards/${cardId}`, null, {
        params: { key, token, dueComplete },
      });
    },

    async addLabelToCard(cardId, labelId) {
      if (!cardId) {
        throw new Error('Card id is required');
      }
      if (!labelId) {
        throw new Error('Label id is required');
      }
      const { key, token } = getAuthParams();
      return http.put(`/cards/${cardId}/idLabels`, { value: labelId }, {
        params: { key, token },
      });
    },

    async addMemberToCard(cardId, memberId) {
      if (!cardId) {
        throw new Error('Card id is required');
      }
      if (!memberId) {
        throw new Error('Member id is required');
      }
      const { key, token } = getAuthParams();
      return http.put(`/cards/${cardId}/idMembers`, { value: memberId }, {
        params: { key, token },
      });
    },

    async updateCardPosition(cardId, position) {
      if (!cardId) {
        throw new Error('Card id is required');
      }
      if (!position) {
        throw new Error('Position is required');
      }
      const { key, token } = getAuthParams();
      return http.put(`/cards/${cardId}`, null, {
        params: { key, token, pos: position },
      });
    },

    async archiveCard(cardId) {
      if (!cardId) {
        throw new Error('Card id is required');
      }
      const { key, token } = getAuthParams();
      return http.put(`/cards/${cardId}`, null, {
        params: { key, token, closed: true },
      });
    },

    async updateCardNameWithoutAuth(cardId, name = 'Teste') {
      if (!cardId) {
        throw new Error('Card id is required');
      }
      return http.put(`/cards/${cardId}`, null, {
        params: { name },
      });
    },

    async deleteCard(cardId) {
      if (!cardId) {
        throw new Error('Card id is required');
      }
      const { key, token } = getAuthParams();
      return http.delete(`/cards/${cardId}`, {
        params: { key, token },
      });
    },

    async deleteCardWithoutAuth(cardId) {
      if (!cardId) {
        throw new Error('Card id is required');
      }
      return http.delete(`/cards/${cardId}`);
    },
  };
}

module.exports = { createClient, getAuthParams };
