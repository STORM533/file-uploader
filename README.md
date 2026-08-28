# Left-Luggage Depot — File Uploader

A personal storage counter built on Express + Prisma 7 (PostgreSQL). Check files in
as _parcels_, file them on _shelves_ (folders), claim them later, and hand a stranger
a numbered _claim stub_ (share link) that expires on its own.

Backend-only API with EJS views styled like an old train-station left-luggage office:
flat kraft-paper ticket stubs, dashed perforation lines, punch-hole notches, and an
oxblood "EXPIRED" stamp for lapsed share links.

## Stack

- **Node.js + Express 5** (ESM, `"type": "module"`)
- **Prisma 7** ORM with the `@prisma/adapter-pg` driver adapter, PostgreSQL backend
- **Passport** (`passport-local`) + `express-session`, session store persisted in the
  same Postgres DB via `@quixo3/prisma-session-store` (requires the `Session` model)
- **bcryptjs** for password hashing
- **multer** for file uploads (local disk first, cloud optional)
- **Cloudinary** for cloud file storage (toggle via `CLOUDINARY_URL`)
- **express-validator** for input validation

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a Postgres database and set `DATABASE_URL` in `.env`.
3. Apply the schema and generate the client:
   ```bash
   npm run migrate   # npx prisma migrate dev
   npm run generate  # npx prisma generate
   ```
4. Start the server:
   ```bash
   npm start         # node app.js
   ```

The Prisma Client is generated into `generated/prisma/` (gitignored). Sessions are
stored in the `Session` table managed by the migration.

## Environment Variables

| Variable           | Description                                                         |
| ------------------ | ------------------------------------------------------------------- |
| `DATABASE_URL`     | PostgreSQL connection string                                        |
| `SESSION_SECRET`   | Secret used to sign the session cookie                              |
| `CLOUDINARY_URL`   | Cloudinary cloud URL. Leave empty to store files on local disk only |
| `MAX_FILE_SIZE_MB` | Max upload size per file (default `10`)                             |
| `PORT`             | Server port (default `3000`)                                        |

## Project structure

```bash
file-uploader/
├── prisma/            schema + migrations
├── lib/prisma.js      single PrismaClient (adapter) instance
├── controllers/       auth, folder, file, share
├── middleware/        passport, isAuthenticated, upload, validator
├── routes/            auth, folder, file, share
├── views/            EJS (depot theme)
├── public/styles/     common.css, home.css
├── uploads/           local disk storage (gitignored)
├── utils/cloudinary.js
├── app.js
└── script.js          Prisma smoke test
```
