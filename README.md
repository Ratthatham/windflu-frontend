# Next.js Supabase Radix Boilerplate

A production-ready Next.js boilerplate with Supabase for authentication and database, Radix UI for accessible components, and Tailwind CSS for styling.

## Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Auth & Database**: [Supabase](https://supabase.com/)
- **UI Primitives**: [Radix UI](https://www.radix-ui.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## Getting Started

### 1. Clone and Install

```bash
cd my-app
npm install
```

### 2. Set up Supabase

Create a new project on [Supabase](https://supabase.com/) and get your Project URL and Anon Key.

### 3. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Project Structure

- `app/`: Next.js App Router (pages and layouts)
- `components/`: Reusable UI components and feature-specific components
- `lib/`: Utility functions and Supabase client/middleware configuration
- `middleware.ts`: Supabase session management and route protection

## Features

- ✅ **Authentication**: Email/Password login and registration flow.
- ✅ **Protected Routes**: Middleware-based session handling and server-side protection.
- ✅ **Responsive Design**: Mobile-first layouts with Tailwind CSS.
- ✅ **Accessible UI**: Radix UI primitives for high-quality, accessible components.
- ✅ **Type Safety**: Full TypeScript support.
# nextjs-superbase-boilerplate
