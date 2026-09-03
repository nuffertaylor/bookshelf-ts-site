# Frontend Refactor Plan

## Goals
- Remove hardcoded production URLs so the app runs locally out of the box
- Add proper environment variable support
- Clean up committed build artifacts

## Current Problems

| File | Line | Hardcoded value |
|---|---|---|
| `src/utils/utilities.ts` | 71, 83 | `https://vi64h2xk34.execute-api.us-east-1.amazonaws.com/alpha/` |
| `src/types/constants.ts` | 1 | `https://bookshelf-spines.s3.amazonaws.com/` |

Zero `process.env` references exist anywhere in the source. No `.env` files exist.
The `build/` directory is committed to the repo and should be gitignored.

---

## Changes

### 1. Extract hardcoded URLs to environment variables

CRA uses the `REACT_APP_` prefix for custom env vars (anything else is ignored at build time).

```ts
// src/utils/utilities.ts — before
const path = "https://vi64h2xk34.execute-api.us-east-1.amazonaws.com/alpha/" + method + "?" + querystr;

// after
const path = process.env.REACT_APP_API_URL + method + "?" + querystr;
```

```ts
// src/types/constants.ts — before
export const IMG_URL_PREFIX: string = "https://bookshelf-spines.s3.amazonaws.com/";

// after
export const IMG_URL_PREFIX: string = process.env.REACT_APP_IMG_URL_PREFIX!;
```

### 2. Add `.env` files

**`.env.development`** — checked into git, safe (points at local backend):
```
REACT_APP_API_URL=http://localhost:3001/
REACT_APP_IMG_URL_PREFIX=http://localhost:4566/bookshelf-spines/
```

`localhost:3001` assumes the backend is running via `sam local start-api` or a similar local server.
`localhost:4566` is LocalStack (S3 mock) from the backend's `docker-compose.yml`.

**`.env.production.example`** — checked into git, documents what prod deployment needs:
```
REACT_APP_API_URL=https://<your-api-gateway-id>.execute-api.us-east-1.amazonaws.com/alpha/
REACT_APP_IMG_URL_PREFIX=https://<your-s3-bucket>.s3.amazonaws.com/
```

**`.env.production`** — gitignored, contains real production values (copy from example and fill in):
```
REACT_APP_API_URL=https://vi64h2xk34.execute-api.us-east-1.amazonaws.com/alpha/
REACT_APP_IMG_URL_PREFIX=https://bookshelf-spines.s3.amazonaws.com/
```

### 3. Gitignore cleanup

Add to `.gitignore`:
```
build/
.env.production
.env.local
```

Remove the committed `build/` directory from git tracking:
```bash
git rm -r --cached build/
```

---

## Running Locally (after these changes)

```bash
npm install
npm start        # uses .env.development automatically, points at local backend
```

To point at production backend temporarily:
```bash
REACT_APP_API_URL=https://vi64h2xk34... npm start
```

---

## What Does NOT Need Changing

The following external URLs appear in the source but are legitimate page content — not backend calls:
- `goodreads.com` — external links
- `imgur.com` — external links
- `fonts.googleapis.com` — font loading
- `discord.gg` — community link
