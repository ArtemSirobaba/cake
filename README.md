# Cake

Cake is a modern web application built with Remix.js.

## New Features

- Added new feature demonstration file
- Updated documentation to reflect recent changes

## Technologies Used

- **Frontend Framework**: Remix.js (v2.15.0)
- **Language**: TypeScript
- **UI Components**:
  - Radix UI
  - Tailwind CSS
  - Shadcn UI components
- **Database**: SQLite (better-sqlite3)
- **Authentication**: Better Auth
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: SWR
- **Styling**: Tailwind CSS with PostCSS
- **Build Tool**: Vite

## Project Structure

```
├── app/                 # Main application code
├── public/             # Static assets
├── better-auth_migrations/  # Database migrations
├── node_modules/       # Dependencies
├── .env                # Environment variables
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
├── tailwind.config.ts  # Tailwind CSS configuration
└── vite.config.ts      # Vite configuration
```

## Prerequisites

- Node.js >= 20.0.0
- npm or yarn package manager

## Setup and Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd [project-directory]
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL=file:./sqlite.db
```

4. Run database migrations:

```bash
npm run auth:migrate
# or
yarn auth:migrate
```

5. Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Run production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run auth:migrate` - Run database migrations

## Security

- Environment variables are properly ignored in `.gitignore`
- Sensitive files and build artifacts are excluded from version control
- Database migrations are managed through Better Auth CLI

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request
