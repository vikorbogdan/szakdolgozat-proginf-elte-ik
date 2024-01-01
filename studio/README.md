# Studio

## Demo: [studio](http://studio-pearl.vercel.app)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app), designed to provide an educational web application with a focus on [brief description of your app's purpose and features].

## Getting Started

Before you begin, ensure you have [Node.js](https://nodejs.org/en/) installed on your machine.

### Installation

Clone the repository and install dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
# or
bun install
```

### Environment Variables

Set up the necessary environment variables:

1. Create a `.env.local` file in the root directory of your project.
2. Add the following environment variables:

   ```env
   NEXTAUTH_URL = "http://localhost:3000"
   NEXTAUTH_SECRET = [Your NextAuth Secret]

   GITHUB_ID = [Your GitHub Client ID]
   GITHUB_SECRET = [Your GitHub Client Secret]

   EDGE_STORE_ACCESS_KEY = [Your Edge Store Access Key]
   EDGE_STORE_SECRET_KEY = [Your Edge Store Secret Key]


   DATABASE_URL = [Your Database URL]
   ```

   Replace the placeholders with your actual credentials.

### Running the Development Server

To start the development server, run:

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

## Additional Information

- This project uses Next.js (v13.5.4), Zustand (v4.4.4), React Query (v4.36.1), Prisma (v5.5.2), Tailwind CSS (v3), and other technologies.
- For authentication, it utilizes Next-Auth (v4.24.3) and for API and server-side operations, it leverages tRPC (v10.43.0).
- Detailed documentation for each technology can be found at their respective official websites.
