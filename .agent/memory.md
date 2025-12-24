# Antigravity Memory

This file serves as a memory bank for the Antigravity AI agent. It contains project context, key decisions, and user preferences to ensure consistency across sessions.

## Project Overview

- **Name:** sumit-mitra (Personal Portfolio & Blog)
- **User:** Sumit Mitra, Senior Software Engineer based in Bengaluru.
- **Tech Stack:** Vite, React 19, TypeScript, shadcn-ui, Tailwind CSS, TanStack Query, React Router Dom 6.
- **Deployment:** GitHub Pages (configured with `basename: "/sumit-mitra"`).

## Architecture & Structure

- **Data-Driven Design:** The application's content is primarily driven by JSON files located in `src/data/`:
  - `portfolio.json`: Contains profile info, experience, skills, education, and projects.
  - `blogData.json`: Contains blog post metadata and content.
- **Component Strategy:**
  - Uses **Shadcn UI** (built on Radix UI) for modular and accessible UI components.
  - Custom components for portfolio sections: `Hero`, `About`, `Experience`, `Projects`, `Skills`, `Contact`.
  - Includes a `Snake.js` mini-game component for interactivity.
- **Routing:**
  - `/`: Home/Portfolio page.
  - `/blog`: Blog listing page.
  - `/blogs/:slug`: Individual blog post pages.
- **State & Data Fetching:** Uses `TanStack Query` for potential data fetching (though current data is local JSON).
- **Theme Management:** Custom `ThemeProvider` for light/dark mode support.

## Key Decisions

- **2024-12-24:** Upgraded React and React-DOM from `19.0.0-rc.1` to stable `19.0.0` to resolve peer dependency conflicts with `@tanstack/react-query` and other modern libraries.
- **Dependency Management:** Opted for stable React 19 to ensure compatibility across the Shadcn/Radix ecosystem.
- **Base URL:** Configured `BrowserRouter` with `basename="/sumit-mitra"` to align with GitHub Pages hosting requirements.

## User Preferences

- **Code Style:** Clean, modular React components with TypeScript for type safety.
- **UI Consistency:** Strict adherence to the Shadcn UI design system.

## Recent Activity

- **2025-12-24:** Resolved `ERESOLVE` npm errors by updating React to stable v19 and fixing type definitions.
- **2025-12-24:** Performed project traversal and populated Memory Bank with architectural details.
