# Social App

A modern, Instagram-inspired social media platform built with Next.js, TypeScript, and Tailwind CSS. Share photos, connect with friends, and engage with a community through likes, comments, and follows.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **UI** | [React 19](https://react.dev/) with React Compiler |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **ORM** | [Prisma](https://www.prisma.io/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) |
| **Linting** | [ESLint 9](https://eslint.org/) (flat config) |

## Features

- **Authentication** — Secure sign-up, login, and session management
- **User Profiles** — Customizable profiles with avatar, bio, and post grid
- **Image Posts** — Upload and share photos with captions
- **Likes** — Like and unlike posts
- **Comments** — Comment on posts and view comment threads
- **Follow System** — Follow/unfollow users and see follower/following counts
- **Feed** — Personalized feed of posts from followed users

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18.18 or later
- [PostgreSQL](https://www.postgresql.org/) running locally or a hosted instance
- npm (included with Node.js)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Joel-Romail/social-app.git
   cd social-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the project root:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/social_app"
   ```

   Replace `USER` and `PASSWORD` with your PostgreSQL credentials.

4. **Initialize the database**

   ```bash
   npx prisma migrate dev
   ```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

## Project Structure

```
src/
  app/              # Next.js App Router — pages, layouts, and API routes
    layout.tsx      # Root layout (fonts, metadata, providers)
    page.tsx        # Home page
    globals.css     # Global styles and Tailwind theme
public/             # Static assets (images, icons)
prisma/             # Prisma schema and migrations
```

## Deployment

The recommended deployment target is [Vercel](https://vercel.com/):

1. Push your repository to GitHub
2. Import the project in the [Vercel dashboard](https://vercel.com/new)
3. Add your environment variables (`DATABASE_URL`, etc.) in the Vercel project settings
4. Deploy — Vercel detects Next.js automatically

For other platforms, run `npm run build` and serve the `.next` output with `npm run start` or a Node.js process manager.

## License

This project is licensed under the [MIT License](LICENSE).
