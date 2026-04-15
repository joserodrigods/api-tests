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
│   └── test-env.sh
├── docs
├── cucumber.js
├── .env.example
├── package.json
└── README.md
```

## Running tests

```bash
# All scenarios (default profile excludes @template features)
npm test

# Auth-related scenarios only
npm run test:auth

# Smoke-check .env and perform sample GET requests (curl)
npm run test:env
```

## Environment variables

See `.env.example`. Do not commit `.env` (it is in `.gitignore`).
