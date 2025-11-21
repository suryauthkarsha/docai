# Doctor AI - Health Document Analysis Platform

## Overview

Doctor AI is a fully functional healthcare analytics application that uses Google's Gemini AI to analyze health documents and blood test results. Users upload medical reports (PDF or images), which are processed by the AI to extract health metrics, calculate a "Life Score" (0-100), and generate personalized health insights and lifestyle recommendations. The platform provides a clean dashboard interface for tracking health trends over time.

## Project Status: ✅ COMPLETE & DEPLOYED

**Current State**: Fully functional production-ready application  
**GitHub**: https://github.com/suryauthkarsha/docai.git  
**Last Updated**: November 21, 2025

## User Preferences

Preferred communication style: Simple, everyday language.
Integration: GitHub repo connected and code pushed successfully

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, using Vite as the build tool and development server

**UI Component System**: 
- Shadcn UI component library (New York style) with Radix UI primitives
- Tailwind CSS for styling with custom theme system supporting light/dark modes
- Material Design principles adapted for healthcare context
- Design inspired by Apple Health (data visualization), Notion (information hierarchy), and Linear (dashboard patterns)

**State Management**:
- TanStack React Query (v5) for server state management and data fetching
- Query client configured with infinite stale time and disabled auto-refetch for predictable data behavior
- Polling mechanism for analysis status (3-second intervals until analysis completes)

**Routing**: Wouter for lightweight client-side routing with the following routes:
- `/` - Upload page
- `/dashboard` - Main dashboard with latest report and life score
- `/report/:id` - Detailed report view
- `/history` - Historical reports listing

**Key Frontend Patterns**:
- File upload with drag-and-drop using react-dropzone
- Real-time analysis status updates through polling
- Progressive disclosure of complex health data
- Responsive design with mobile-first approach

### Backend Architecture

**Runtime**: Node.js with Express.js framework

**Development vs Production**:
- Development: Hot module replacement via Vite middleware integration
- Production: Pre-built static assets served from `/dist/public`

**API Structure**: RESTful endpoints under `/api` namespace:
- `POST /api/reports/upload` - Handles multipart file uploads (PDF, JPEG, PNG up to 10MB)
- `GET /api/reports` - Retrieves all reports with their analyses
- `GET /api/reports/:id` - Retrieves specific report with analysis

**File Handling**:
- Multer middleware for multipart form data processing
- Files stored locally in `/uploads` directory with unique timestamps
- File validation for type (PDF, JPEG, PNG) and size (10MB limit)

**Data Layer Pattern**: Repository pattern via `IStorage` interface (DatabaseStorage implementation)
- Abstraction allows for easy database swapping
- Drizzle ORM for type-safe database operations
- All database operations return promises for async handling

### Database Schema

**ORM**: Drizzle ORM with PostgreSQL dialect (configured for Neon serverless)

**Tables**:

1. `health_reports`
   - Primary key: UUID (auto-generated)
   - Stores file metadata (name, type, path)
   - Upload timestamp tracking

2. `health_analyses`
   - Primary key: UUID (auto-generated)
   - Foreign key: `reportId` references health_reports (cascade delete)
   - Stores Life Score (integer 0-100)
   - JSONB columns for flexible data structures:
     - `metrics[]` - Array of health biomarkers with status, values, ranges
     - `insights[]` - Key health findings categorized by type
     - `recommendations[]` - Lifestyle suggestions by category (diet, exercise, sleep, stress)
   - Text summary field for overall analysis

**Design Rationale**:
- JSONB used for metrics/insights/recommendations to handle variable structure of health data
- Cascade delete ensures orphaned analyses are automatically removed
- Timestamps track when reports uploaded and analyses completed
- UUID primary keys for better distribution and security

### AI Integration

**Service**: Google Gemini AI via `@google/genai` SDK

**Analysis Process**:
1. Read uploaded file as binary buffer
2. Construct detailed medical analysis prompt with JSON response format
3. Send file + prompt to Gemini multimodal model
4. Parse JSON response extracting:
   - Health metrics with categorization (Blood Count, Lipid Profile, etc.)
   - Status classification (excellent/good/attention/critical)
   - Life Score calculation based on metric distribution
   - Key insights highlighting important findings
   - Personalized recommendations across 4 categories

**Prompt Engineering**:
- System prompt establishes AI as medical expert assistant
- User prompt provides detailed extraction and scoring guidelines
- Structured JSON schema ensures consistent response format
- Life Score bands: 80-100 (excellent), 60-79 (good), 40-59 (fair), 0-39 (needs attention)

**Error Handling**:
- Validates file existence before processing
- Checks for GEMINI_API_KEY environment variable
- Async analysis allows non-blocking upload flow

## External Dependencies

### Third-Party Services

**Google Gemini AI** (`@google/genai`)
- Purpose: Medical document analysis and health metric extraction
- Configuration: Requires `GEMINI_API_KEY` environment variable
- Usage: Multimodal analysis of PDF and image health documents

**Neon Database** (`@neondatabase/serverless`)
- Purpose: Serverless PostgreSQL hosting
- Configuration: Requires `DATABASE_URL` environment variable
- Features: WebSocket support for serverless environments

### UI Component Libraries

**Radix UI** (Multiple packages)
- Unstyled, accessible component primitives
- Used for: dialogs, dropdowns, accordions, popovers, tooltips, etc.
- Provides ARIA-compliant patterns for complex interactions

**Shadcn UI Configuration**
- Pre-styled Radix components with Tailwind CSS
- "New York" variant for modern, clean aesthetic
- Custom theme with healthcare-appropriate color palette

### Development Tools

**TypeScript**: Strict type checking across client, server, and shared code
- Shared schema types ensure client-server contract
- Path aliases for clean imports (`@/`, `@shared/`)

**Drizzle Kit**: Database migration management
- Schema-first approach with TypeScript definitions
- Migration files generated in `/migrations` directory

**Build Tools**:
- Vite for frontend bundling with React plugin
- esbuild for server-side production bundling
- PostCSS with Tailwind and Autoprefixer

### Validation & Forms

**Zod**: Runtime type validation
- Schema validation for database inserts
- Drizzle-Zod integration for automatic schema generation

**React Hook Form** with Hookform Resolvers
- Form state management
- Integration with Zod for validation

### Utility Libraries

- `date-fns`: Date formatting and manipulation
- `class-variance-authority`: Type-safe variant styling
- `clsx` & `tailwind-merge`: Conditional class composition
- `cmdk`: Command palette component
- `wouter`: Lightweight routing (~1.2KB)
- `multer`: Multipart form data parsing
- `nanoid`: Unique ID generation