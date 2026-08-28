# Left-Luggage Depot — File Uploader

A personal storage counter built on Express + Prisma 7 (PostgreSQL). Check files in
as *parcels*, file them on *shelves* (folders), claim them later, and hand a stranger
a numbered *claim stub* (share link) that expires on its own.

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

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Secret used to sign the session cookie |
| `CLOUDINARY_URL` | Cloudinary cloud URL. Leave empty to store files on local disk only |
| `MAX_FILE_SIZE_MB` | Max upload size per file (default `10`) |
| `PORT` | Server port (default `3000`) |

## Cloud Storage — Cloudinary

Cloud storage uses **Cloudinary**. When `CLOUDINARY_URL` is set, every checked-in
parcel is also uploaded to Cloudinary and the returned secure URL is stored in
`File.url`. Downloads prefer `File.url` and fall back to the local `File.localPath`
otherwise. The cloud step is a clearly separated function (`utils/cloudinary.js`,
`uploadToCloudinary`) so it is easy to toggle, and the local-disk copy is always kept
during development.

## API / Page Endpoints

All routes below render EJS views. Auth-guarded routes redirect to `/log-in` when
unauthenticated.

### Auth
| Method | Path | Description |
|---|---|---|
| GET | `/sign-up` | Registration card |
| POST | `/sign-up` | Create account (email + password + confirm) |
| GET | `/log-in` | Check-in card |
| POST | `/log-in` | Authenticate (LocalStrategy) |
| GET | `/log-out` | Destroy session |

### Folders (shelves)
| Method | Path | Description |
|---|---|---|
| GET | `/folders` | List your top-level shelves |
| GET | `/folders/new` | New-shelf form |
| POST | `/folders` | Create shelf (optional `parentId` for nesting) |
| GET | `/folders/:id` | Open a shelf (parcels + sub-shelves) |
| GET | `/folders/:id/rename` | Manage-shelf form |
| POST | `/folders/:id/rename` | Rename shelf |
| POST | `/folders/:id/delete` | Delete shelf |

### Files (parcels)
| Method | Path | Description |
|---|---|---|
| GET | `/files` | Ledger of all your parcels |
| GET | `/files/upload` | Check-in form (optional `?folderId=`) |
| POST | `/files/upload` | Upload a file (`multipart/form-data`, field `file`) |
| GET | `/files/:id` | Parcel details (human-readable size, type, time) |
| GET | `/files/:id/download` | Claim — redirects to `File.url` or sends `localPath` |

Allowed MIME types: images (jpeg/png/gif/webp), PDF, plain text, common Office docs
(word/excel), and zip. Other types are rejected with a `400` message. Max size is
`MAX_FILE_SIZE_MB`.

### Share links (extra credit)
| Method | Path | Description |
|---|---|---|
| POST | `/folders/:id/share` | Owner-only. Body `duration` (`1h`/`1d`/`7d`/`10d`/`30d`). Returns the claim URL |
| GET | `/share/:id` | Public. Read-only view of the shelf; `410` if expired, `404` if unknown |

## Folder-delete decision

Deleting a folder **blocks** if it still contains parcels or sub-shelves — the request
returns `400` with a plain ledger-voice message ("Shelf not empty…") and renders the
shelf view rather than deleting anything. This is a deliberate, documented choice: the
counter never silently discards a parcel. To clear a shelf, first remove (or move) its
parcels and sub-shelves, then delete it.

## Design notes

- Shared CSS tokens and reusable classes (`.ticket`, `.perforation`, `.stamp-void`) live
  in `public/styles/common.css`; page-specific layout tweaks are in `public/styles/home.css`.
- All interactive elements have visible keyboard focus states.
- The slide-in / punch-pop animations are disabled under `prefers-reduced-motion`.

## Project structure

```
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
