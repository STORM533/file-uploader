# File Uploader

A personal storage counter — check files in, claim them later, share with a ticket.

## Setup

1. Install dependencies: `npm install`
2. Ensure PostgreSQL is running
3. Run migrations: `npm run migrate`
4. Generate client: `npm run generate`
5. Start the server: `npm start`

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Secret for express-session |
| `CLOUDINARY_URL` | Cloudinary cloud URL for file storage |
| `MAX_FILE_SIZE_MB` | Max file upload size (default: 10) |
| `PORT` | Server port (default: 3000) |

## Cloud Storage

Cloudinary is used for cloud file storage. Set `CLOUDINARY_URL` in your `.env`.