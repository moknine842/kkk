# Secret Missions Multiplayer

## Overview

Secret Missions Multiplayer is a social party game built as a modern web application where players complete secret missions while trying to identify other players' missions. The game supports both local (shared device) and online multiplayer modes, designed for 4+ players per session. Players receive hidden objectives that must be completed discretely while simultaneously attempting to guess other participants' missions to eliminate them from the game.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Build System**: Vite for fast development and optimized production builds
- **UI Framework**: Shadcn/ui components built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom gaming theme variables and dark/light mode support
- **State Management**: TanStack Query for server state management, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion for smooth transitions and gaming feel

### Backend Architecture
- **Runtime**: Node.js with Express.js for RESTful API endpoints
- **Type Safety**: TypeScript throughout the entire stack with shared types
- **Build Process**: ESBuild for server bundling with external package handling
- **Development**: Hot module replacement and runtime error overlays for development efficiency

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Connection**: Neon Database serverless PostgreSQL for cloud deployment
- **Session Storage**: Connect-pg-simple for PostgreSQL-backed session management
- **Schema**: Shared type definitions between client and server using Drizzle-Zod

### Design System
- **Component Library**: Custom components following gaming UI patterns inspired by Discord and Among Us
- **Color Palette**: Gaming-focused theme with vibrant purple accents, dark navy backgrounds, and status-specific colors
- **Typography**: Inter for readability with Orbitron accent font for gaming headers
- **Layout**: Card-based interfaces with consistent spacing using Tailwind utilities
- **Responsive**: Mobile-first design with adaptive layouts for various screen sizes

### Game Logic Architecture
- **Game States**: Centralized state management for game phases (mode selection, online flow selection, lobby creation/joining, gameplay, results)
- **Online Mode Flow**: Two-step process - first select create or join, then proceed to respective screens
- **Real-time Features**: Prepared for WebSocket integration for live multiplayer functionality
- **Mission System**: Modular mission assignment with difficulty levels and categories
- **Timer Management**: Configurable game timers with warning thresholds and visual feedback
- **Player Management**: Comprehensive player status tracking (active, eliminated, completed, host)
- **Avatar System**: Full avatar customization for online mode with 4 options (upload, camera, custom builder, initials), available before create/join and editable in lobby

## External Dependencies

### UI and Styling
- **@radix-ui/react-***: Comprehensive accessible component primitives for complex UI elements
- **tailwindcss**: Utility-first CSS framework with custom gaming theme configuration
- **class-variance-authority**: Type-safe variant API for component styling
- **framer-motion**: Animation library for smooth transitions and gaming effects

### Database and Backend
- **@neondatabase/serverless**: Serverless PostgreSQL driver optimized for edge deployments
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect support
- **drizzle-zod**: Schema validation bridge between Drizzle and Zod
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### Development Tools
- **@tanstack/react-query**: Powerful data synchronization for server state management
- **@hookform/resolvers**: Form validation with React Hook Form integration
- **react-hook-form**: Performant forms with minimal re-renders
- **zod**: Runtime type validation for API endpoints and form schemas

### Game-Specific Libraries
- **date-fns**: Date manipulation for game timers and session management
- **lucide-react**: Consistent icon library for gaming UI elements
- **embla-carousel-react**: Touch-friendly carousels for game mode selection
- **cmdk**: Command palette component for quick actions

### Development Infrastructure
- **@replit/vite-plugin-***: Replit-specific development tools for error handling and debugging
- **tsx**: TypeScript execution for development server
- **nanoid**: Secure unique ID generation for game sessions and players

## Recent Changes

### October 7, 2025 - Complete Multiplayer Implementation
- ✅ **Database Schema**: Created tables for games, players, and missions with proper relationships
  - Games table: 6-digit room codes, timer management, game status tracking
  - Players table: avatars, lives (3 per player), points, elimination status, host flag
  - Missions table: mission text, assignment tracking, reveal status
- ✅ **Backend API & WebSocket Server**:
  - POST `/api/games/create` - Create game room with 6-digit code
  - POST `/api/games/join` - Join existing game with room code
  - GET `/api/games/:gameId` - Get game state with all players and missions
  - POST `/api/missions/submit` - Submit missions with automatic shuffle & redistribution
  - POST `/api/players/:playerId/action` - Host controls (eliminate, subtract life, mission completed)
  - POST `/api/games/:gameId/end` - End game and show results
  - WebSocket path `/ws` for real-time multiplayer synchronization
- ✅ **Mission Distribution System**: Shuffle algorithm ensures players never get their own missions
- ✅ **Online Game Flow**:
  - Create lobby with 6-digit room code, player name, and avatar selection
  - Join lobby using room code from any device
  - Real-time player list updates via WebSocket
  - Mission entry interface with tips and character counter
  - Automatic game start when all missions submitted
- ✅ **Gameplay Features**:
  - Timer countdown with visual warnings
  - Hidden missions with reveal button (local mode privacy)
  - Host control panel for player actions
  - Eliminate player with guesser selection popup
  - Subtract life (auto-eliminate at 0 lives)
  - Award mission completed points
  - Real-time game state synchronization
- ✅ **Game End Conditions**:
  - Timer expires OR all but one player eliminated
  - Results screen with player rankings by points
  - Visual indicators for 1st/2nd/3rd place (gold/silver/bronze)
- ✅ **Routing**: All pages integrated (/, /online/create, /online/join, /game/:id/missions, /game/:id/play, /game/:id/results)
- ✅ **WebSocket Integration**: Custom React hook for real-time game events

### October 7, 2025 - GitHub Import & Replit Environment Setup
- ✅ Successfully imported GitHub repository to Replit
- ✅ Installed all project dependencies via npm (479 packages)
- ✅ Configured PostgreSQL database connection using existing DATABASE_URL secret
- ✅ Pushed database schema to PostgreSQL using Drizzle Kit (games, players, missions tables)
- ✅ Vite configuration already properly set up for Replit proxy (host: 0.0.0.0, allowedHosts: true)
- ✅ Set up development workflow to run on port 5000 with webview output
- ✅ Configured deployment settings for production (autoscale target, build + start scripts)
- ✅ Verified application is fully functional - home page loads with Local/Online mode selection
- ✅ WebSocket server running on /ws path for real-time multiplayer
- ✅ All game routes accessible and working

## Replit Configuration

### Development Environment
- **Port**: 5000 (frontend and backend served together)
- **Host**: 0.0.0.0 for frontend server
- **Database**: PostgreSQL (Helium) with connection via DATABASE_URL
- **Workflow**: `npm run dev` - runs Express server with Vite HMR integration

### Deployment Configuration
- **Target**: Autoscale (stateless web application)
- **Build**: `npm run build` - builds both frontend and backend
- **Run**: `npm run start` - runs production server on port 5000

### Database Schema
- **Users table**: Stores user authentication data with UUID primary keys
- Schema managed through Drizzle ORM with type-safe operations
- Currently using in-memory storage (MemStorage) as default, ready for PostgreSQL integration