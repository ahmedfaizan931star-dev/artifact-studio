# Artifact Studio

**Deterministic design intelligence for posts and decks.**  
Better than Canva. Design-system native. Less AI dependency. More intelligence.

Built for the ArtifactLoop ecosystem.

## Stack

- Frontend: React 19 + TypeScript + Vite + Tailwind CSS v4
- Canvas: Konva + react-konva
- State: Zustand + Immer
- Auth & Backend: Supabase (Auth + Database)
- Hosting: Vercel
- PWA ready

## Quick Start

```bash
npm install
```

Create `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

```bash
npm run dev
```

## Deploy

Connected to Vercel via this repository. Add Supabase env vars in Vercel project settings.
