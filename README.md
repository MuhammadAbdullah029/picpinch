# PicPinch

A small image compression and management app built with Express, EJS and MongoDB.

## Features

- User registration and login (JWT cookies)
- Upload and compress images using `sharp`
- Simple UI rendered with EJS

## Requirements

- Node.js 18+ (recommended)
- MongoDB running locally or accessible through `MONGO_URI`

## Quick start

1. Install dependencies

```bash
npm install
```

2. Copy environment variables

```bash
cp .env .env.local
# Edit .env.local and fill required values
```

3. Run in development

```bash
npm run dev
```

4. Open the app

Visit `http://localhost:3000/picpinch` in your browser.

## Project structure

- `src/` — application source
- `public/` — static assets and uploads
- `server.js` — app entry

