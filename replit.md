# ManHUB Manufacturing Platform

## Overview

ManHUB is a B2B manufacturing quote platform that connects customers with manufacturing services including CNC machining, laser cutting, 3D printing, sheet metal forming, injection molding, and welded fabrication (with specialized welding methods: TIG, MIG-MAG, LASER, SPOT, and ARC welding). The platform enables users to upload CAD files, request quotes, and track orders through a complete manufacturing lifecycle from quote request to delivery.

The application follows a modern full-stack architecture with a React frontend using shadcn/ui components, Express.js backend, and PostgreSQL database managed through Drizzle ORM. Authentication is handled via Replit's OpenID Connect integration, and file storage leverages Google Cloud Storage through Replit's object storage service. The platform supports 9 languages (English, Turkish, German, Spanish, French, Italian, Russian, Japanese, and Arabic) through i18next internationalization.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling:**
- React 18+ with TypeScript using Vite as the build tool
- Wouter for client-side routing (lightweight React Router alternative)
- TanStack Query (React Query) for server state management and data fetching
- React Hook Form with Zod validation for form handling

**UI Component System:**
- shadcn/ui component library (Radix UI primitives with Tailwind CSS styling)
- Design system based on "New York" style variant with neutral base color
- Typography hierarchy using Inter (primary) and JetBrains Mono (monospace) fonts
- Responsive design following B2B SaaS patterns inspired by Linear and Notion

**Page Structure:**
- **Landing Page:** Public homepage showcasing manufacturing services with expandable welding service categories (TIG, MIG-MAG, LASER, SPOT, ARC) that navigate to quote request with pre-selected service via URL parameters
- **Quote Request:** Form-based interface for submitting manufacturing quotes with CAD file uploads, supports URL parameter service pre-selection (?service=tig_welding)
- **Target Price Quote:** Specialized form allowing customers to submit CAD files with target budget and price expectations
- **Certifications:** Information page about quality certifications and measurement reports
- **Post-Processing:** Catalog page showcasing 40+ finishing and post-processing options
- **Mass Production:** Services page for scalable mass production capabilities
- **Dashboard:** Authenticated user portal displaying quote history and order tracking
- **Admin Panel:** Administrative interface for managing quotes, updating statuses, and setting prices
- **Quote Details:** Detailed view with order timeline visualization and file downloads

**State Management Strategy:**
- Server state managed through React Query with infinite stale time (manual refetch control)
- Form state handled locally via React Hook Form
- Authentication state centralized through custom `useAuth` hook with ProtectedRoute component wrapper
- 401 errors trigger automatic re-authentication flow

**Internationalization (i18n):**
- i18next integration with browser language detection
- 9 supported languages: English, Turkish, German, Spanish, French, Italian, Russian, Japanese, Arabic
- Language switcher component in navigation with persistent localStorage preference
- Translation files organized in `client/src/i18n/locales/` directory

### Backend Architecture

**Framework & Server:**
- Express.js with TypeScript running on Node.js
- HTTP server configuration with request/response logging middleware
- Custom error handling for 401 responses triggering authentication redirects

**API Design:**
- RESTful API endpoints under `/api` namespace
- Authentication middleware (`isAuthenticated`) protecting sensitive routes
- Request body parsing with raw buffer preservation for webhook verification
- CORS and session management built-in

**Authentication System:**
- Replit OpenID Connect (OIDC) integration via Passport.js
- Session-based authentication with PostgreSQL session storage
- 7-day session TTL with automatic token refresh
- User claims extraction and storage in session

**Route Structure:**
- `/api/auth/user` - Get authenticated user details
- `/api/objects/upload` - Generate signed upload URLs for file storage
- `/objects/:objectPath(*)` - Download files with ACL permission checks
- `/api/quotes` - CRUD operations for manufacturing quotes
- `/api/admin/*` - Administrative endpoints for quote management

### Data Storage

**Database (PostgreSQL via Neon):**
- Drizzle ORM for type-safe database queries and schema management
- Connection pooling through `@neondatabase/serverless` with WebSocket support
- Migration management via `drizzle-kit`

**Schema Design:**

**Users Table:**
- Fields: id (UUID), email, firstName, lastName, profileImageUrl, isAdmin (integer flag)
- Timestamps: createdAt, updatedAt
- Relationships: One-to-many with quotes

**Quotes Table:**
- Core fields: id, userId (foreign key), partName, service type, material, quantity, finishType
- Pricing: finalPrice (decimal), status (enum)
- Timestamps: createdAt, updatedAt, estimatedDelivery
- Relationships: One-to-many with quoteFiles and quoteStatusHistory

**Quote Files Table:**
- Fields: id, quoteId (foreign key), fileName, fileUrl, fileSize
- Purpose: Track uploaded CAD files associated with each quote

**Quote Status History Table:**
- Fields: id, quoteId (foreign key), status, notes
- Purpose: Audit trail for status changes throughout order lifecycle

**Sessions Table:**
- Required for Replit Auth session persistence
- Fields: sid (primary key), sess (JSONB), expire (timestamp)
- Indexed on expire field for efficient cleanup

**Order Status Workflow:**
1. quote_requested → 2. quote_provided → 3. order_confirmed → 4. in_production → 5. quality_check → 6. shipped → 7. delivered

**File Storage (Google Cloud Storage):**
- Object storage service accessed via Replit's sidecar endpoint
- Custom ACL (Access Control List) system for file permissions
- Owner-based access control with public/private visibility options
- Signed URL generation for secure file uploads
- Download streaming with permission verification

**ACL Architecture:**
- ObjectAclPolicy: Defines owner, visibility, and access rules
- ObjectAccessGroup: Abstract groups for permission assignment
- ObjectPermission: READ or WRITE access levels
- Metadata storage using custom headers on GCS objects

## External Dependencies

### Third-Party Services

**Replit Platform Services:**
- **Authentication:** OpenID Connect provider at `replit.com/oidc`
- **Object Storage:** Google Cloud Storage accessed through sidecar endpoint (port 1106)
- **Database:** Neon PostgreSQL serverless database
- **Development Tools:** Vite plugins for error overlay, cartographer, and dev banner

**Google Cloud Platform:**
- **Cloud Storage:** File storage with credential-based authentication using external account type
- **Project Configuration:** Credentials sourced from Replit sidecar with automatic token refresh

### Key NPM Packages

**UI & Styling:**
- `@radix-ui/*` - Headless UI component primitives (dialogs, dropdowns, tooltips, etc.)
- `tailwindcss` - Utility-first CSS framework
- `class-variance-authority` - Component variant management
- `lucide-react` - Icon library

**Forms & Validation:**
- `react-hook-form` - Form state management
- `@hookform/resolvers` - Validation resolver bridge
- `zod` - Schema validation (via `drizzle-zod` for database schemas)

**File Uploads:**
- `@uppy/core`, `@uppy/dashboard`, `@uppy/react`, `@uppy/aws-s3` - File upload UI and S3 integration

**Authentication & Session:**
- `passport` - Authentication middleware
- `openid-client` - OpenID Connect client implementation
- `express-session` - Session middleware
- `connect-pg-simple` - PostgreSQL session store

**Database:**
- `drizzle-orm` - TypeScript ORM
- `@neondatabase/serverless` - Neon database driver with WebSocket support
- `ws` - WebSocket client for database connections

**Development:**
- `vite` - Frontend build tool and dev server
- `tsx` - TypeScript execution for development
- `esbuild` - Production build bundler for server code

### Environment Variables Required

- `DATABASE_URL` - PostgreSQL connection string (Neon)
- `SESSION_SECRET` - Secret key for session encryption
- `ISSUER_URL` - OIDC issuer URL (defaults to replit.com/oidc)
- `REPL_ID` - Replit application identifier
- `PUBLIC_OBJECT_SEARCH_PATHS` - Comma-separated paths for public object access (optional)