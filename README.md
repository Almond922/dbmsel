This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Auth setup

- Install new dependencies: `npm install`
- Run the migration `init/02_add_auth.sql` against your database (adds `password_hash`).
- Create a user with: `POST /api/auth/register` JSON body: `{ name, email, password, role_id }`.
- Visit `http://localhost:3000/` — unauthenticated visitors will be redirected to `/login`.

Dev quick-login: the project includes a development-only bypass so you can sign in without creating a DB user. It is enabled by default in development via `.env` values:

- `DEV_AUTH=true`
- `DEV_ADMIN_EMAIL=admin@example.com`
- `DEV_ADMIN_PASSWORD=Test1234!`

**Important:** This bypass is only for local development and testing. Do NOT enable `DEV_AUTH` in production. For production, set `JWT_SECRET` in your environment and use HTTPS.  
