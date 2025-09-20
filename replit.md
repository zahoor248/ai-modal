# Overview

StoryBuds is an AI-powered storytelling platform that enables users to create, read, and share personalized stories. The application generates stories based on user prompts, templates, and preferences, providing an interactive storytelling experience with multiple themes, text-to-speech capabilities, and community sharing features.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: Next.js 14 with App Router for server-side rendering and routing
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design
- **Styling**: Tailwind CSS with custom CSS variables for theming support
- **State Management**: React hooks (useState, useEffect) for local component state
- **Animations**: Framer Motion for smooth transitions and interactive elements
- **Fonts**: Custom Google Fonts integration (Poppins, Crimson Text, JetBrains Mono)

## Backend Architecture
- **Authentication**: Supabase Auth with middleware-based route protection
- **Database**: Supabase (PostgreSQL) for user data and story storage
- **API Routes**: Next.js API routes for server-side logic
- **Story Generation**: External LLM API (mlvoca.com) using Deepseek model
- **File Structure**: Organized with feature-based routing and component separation

## Data Storage
- **Primary Database**: Supabase PostgreSQL with tables for:
  - Stories (content, metadata, user relationships)
  - User profiles and authentication data
- **Schema Design**: Stories table includes fields for title, content, template type, prompts, length, and user associations
- **Real-time Features**: Supabase real-time subscriptions for live data updates

## Authentication & Authorization
- **Provider**: Supabase Auth with email/password authentication
- **Session Management**: Server-side session handling with middleware protection
- **Route Protection**: Middleware-based authentication checks for protected routes
- **User Context**: Client-side user state management through Supabase helpers

## Content Generation System
- **AI Integration**: External LLM API for story generation with streaming support
- **Template System**: Predefined story categories (kids, adventure, inspirational) with type variations
- **Prompt Engineering**: Structured prompt building with template, length, and user input parameters
- **Story Processing**: Content parsing and formatting for display and storage

## Theme System
- **Multi-theme Support**: 7+ predefined themes (warm, ocean, forest, sunset, midnight, etc.)
- **CSS Variables**: Theme-based color system using oklch color space
- **Dynamic Switching**: Real-time theme changes without page refresh
- **Theme Persistence**: Next-themes integration for theme state management

# External Dependencies

## Core Services
- **Supabase**: Authentication, database, and real-time subscriptions
- **Vercel**: Hosting and deployment platform
- **mlvoca.com API**: External LLM service for AI story generation

## Payment Integration
- **Paddle**: Payment processing for premium features (configured for sandbox)

## UI & Design Libraries
- **Radix UI**: Accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Framer Motion**: Animation library for interactive elements
- **Lucide React**: Icon library for consistent iconography

## Development Tools
- **TypeScript**: Type safety and developer experience
- **Next.js**: React framework with built-in optimizations
- **class-variance-authority**: Component variant management
- **clsx & tailwind-merge**: Conditional class name utilities

## Analytics & Monitoring
- **Vercel Analytics**: User behavior tracking and performance monitoring