const path = require('path');
const axios = require('axios');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

function requireEnv(name) {
  const v = process.env[name];
  if (!v || !String(v).trim()) {
    throw new Error(`Missing ${name} in .env`);
  }
  return String(v).trim();
}

async function main() {
  const baseURL = requireEnv('API_BASE_URL').replace(/\/+$/, '');
  const key = requireEnv('API_KEY');
  const token = requireEnv('API_TOKEN');
  const boardId = requireEnv('BOARD_ID');

  const http = axios.create({
    baseURL,
    validateStatus() {
      return true;
    },
  });

  const listRes = await http.get(`/boards/${boardId}/cards`, {
    params: { key, token, filter: 'all' },
  });

  if (listRes.status !== 200) {
    throw new Error(`Failed to list board cards: HTTP ${listRes.status} ${JSON.stringify(listRes.data)}`);
  }

  const cards = Array.isArray(listRes.data) ? listRes.data : [];
  let deleted = 0;
  let failed = 0;

  for (const card of cards) {
    if (!card || !card.id) {
      continue;
    }
    const delRes = await http.delete(`/cards/${card.id}`, {
      params: { key, token },
    });
    if (delRes.status === 200) {
      deleted += 1;
    } else {
      failed += 1;
      process.stderr.write(`WARN: DELETE ${card.id} (${card.name || 'no name'}) -> HTTP ${delRes.status}\n`);
    }
    await new Promise((r) => setTimeout(r, 50));
  }

  process.stdout.write(`Board ${boardId}: listed ${cards.length} cards, deleted ${deleted}, failed ${failed}\n`);
}

main().catch((err) => {
  process.stderr.write(`${err.stack || err}\n`);
  process.exit(1);
});
