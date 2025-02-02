# Next.js Monolithic Boilerplate

## Getting Started

First, create and modify your `.env` file. Note: the `.env.exmaple` file. _Note, `DATABASE_URL` and `REDIS_URL` point to local docker containers._

```bash
NODE_ENV=development
HOST_NAME=http://localhost:3000
NEXT_PUBLIC_ROOT_DOMAIN=localhost:3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/postgres
REDIS_URL=redis://:password@localhost:6379
RESEND_API_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
RESEND_EMAIL_FROM=email@provider.com
```

Next, run the following commands to start the server (docker compose commands optional):

```bash
docker compose build

docker compose start

npm install

npm run db:seed

npm run dev
```

Open the app at [http://localhost:3000](http://localhost:3000)

Two users are initially seeded with the `pnpm db:seed` command. Modify the `src\db\seed\users.ts` file to change them.

```bash
email: testing@example.com
password: password
```

To get an interactive view of the database:

```bash
npm run db:studio
```

Open the app at [https://local.drizzle.studio/](https://local.drizzle.studio/)
