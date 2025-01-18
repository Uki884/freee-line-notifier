# Next.js Hono Template

A full-stack TypeScript template combining Next.js for the frontend and Hono for the backend, with built-in authentication and PostgreSQL database support.

## Features

- 🚀 **Frontend**: Next.js 15 with App Router
- 🛠️ **Backend**: Hono framework with TypeScript
- 🔐 **Authentication**: Built-in auth system using @hono/auth-js
- 🗄️ **Database**: PostgreSQL with Prisma ORM
- 📦 **Package Management**: pnpm workspace for monorepo
- 🔍 **Code Quality**: Biome for linting and formatting
- 🐳 **Development**: Docker Compose for local database

## Prerequisites

- Node.js 22.12.0
- pnpm 9.13.2
- Docker and Docker Compose

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd nextjs-hono-template
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the PostgreSQL database:
```bash
docker compose up -d
```

4. Set up your environment variables:
```bash
cp .env.example .env
```

5. Run database migrations:
```bash
pnpm -F @app/server prisma:migrate:dev
```

6. Start the development server:
```bash
pnpm dev
```

The application will be available at:
- Frontend: http://localhost:3000
- API: http://localhost:3000/api

## Project Structure

```
apps/
  ├── client/          # Next.js frontend application
  └── server/          # Hono backend application
```

## Available Scripts

- `pnpm dev` - Start development servers
- `pnpm lint` - Run Biome linter
- `pnpm format` - Format code using Biome
- `pnpm check` - Run Biome checks

## Authentication

The template includes a built-in authentication system using @hono/auth-js with:
- Email/Password authentication
- Session management
- Protected routes
- User registration

## Database

PostgreSQL is used as the database with Prisma as the ORM. The database schema includes:
- User management
- Session handling
- Account linking

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is open-source and available under the MIT License.