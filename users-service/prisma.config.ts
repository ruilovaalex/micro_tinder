import path from 'node:path';
import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';

config();

export default defineConfig({
  schema: path.join(import.meta.dirname, 'prisma/schema.prisma'),
  migrations: {
    path: path.join(import.meta.dirname, 'prisma/migrations'),
  },
  datasource: {
    url: process.env.USERS_DATABASE_URL,
  },
});
