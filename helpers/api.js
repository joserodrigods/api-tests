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
          fields: 'id,name,desc,due,dueComplete,closed,pos,idLabels,idMembers',
        },
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
  };
}

module.exports = { createClient, getAuthParams };
