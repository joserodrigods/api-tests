# API BDD example

Small **Cucumber.js** + **Axios** project for black-box checks against an HTTP API that uses query-string authentication and board-scoped resources.

This repository is intentionally generic in naming and documentation. Point `API_BASE_URL` and credentials in `.env` at whatever REST host you use for your own runs.

## Prerequisites

- Node.js (compatible with `package.json` dependencies)
- API credentials and resource IDs configured in `.env` (see `.env.example`)

## Setup

```bash
npm install
```

Copy `.env.example` to `.env` and fill in real values.

If you previously used older variable names in a private fork, rename them to match `.env.example` (`API_BASE_URL`, `API_KEY`, `API_TOKEN`, `BOARD_ID`, …).

## Layout

```text
.
├── features
│   ├── 01_authentication.feature
│   └── 07_complete_template.feature   # reference / examples (@template, excluded from default run)
├── helpers
│   ├── api.js
│   └── assertions.js
├── step_definitions
│   └── auth.steps.js
├── support
│   ├── hooks.js
│   └── world.js
├── scripts
│   ├── test-env.sh
│   └── cleanup-trello-board-cards.js   # npm run cleanup:trello — deletes all cards on BOARD_ID
├── docs
├── cucumber.js
├── .env.example
├── package.json
└── README.md
```

## Running tests

```bash
# Full Cucumber suite (default profile excludes @template)
npm test

# Authentication scenarios only (@auth)
npm run test:auth

# End-to-end challenge scenario only (@e2e)
npm run test:e2e

# Smoke-check .env and perform sample GET requests (curl)
npm run test:env
```

## Cleaning up Trello test data

If automation left many cards on the board configured in `.env`, you can remove **all** cards on that board (open and archived):

```bash
npm run cleanup:trello
```

**Warning:** this uses `BOARD_ID` from `.env` and deletes every card returned by the Trello API for that board. Use only on a **dedicated test board**.

## Environment variables

See `.env.example`. Do not commit `.env` (it is in `.gitignore`).
