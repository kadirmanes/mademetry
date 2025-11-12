# ManHUB Manufacturing Platform - Design Guidelines

## Design Approach
**Reference-Based System Hybrid**: Drawing from B2B SaaS platforms like Linear and Notion for clean data presentation, combined with manufacturing platform patterns (Xometry-style) for industry-specific workflows. Focus on professional, trust-building aesthetics with emphasis on clarity and efficiency.

## Typography System

**Font Families**:
- Primary: Inter or IBM Plex Sans (clean, professional, excellent readability)
- Monospace: JetBrains Mono (for file names, technical specifications)

**Hierarchy**:
- Hero/Page Titles: text-5xl/text-6xl, font-bold, tracking-tight
- Section Headers: text-3xl/text-4xl, font-semibold
- Subsection Headers: text-xl/text-2xl, font-semibold
- Card Titles: text-lg, font-medium
- Body Text: text-base, font-normal, leading-relaxed
- Small Text/Labels: text-sm, font-medium
- Captions/Metadata: text-xs, font-normal, uppercase tracking-wide

## Layout & Spacing System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24 for consistency
- Component padding: p-6 to p-8
- Section spacing: py-16 to py-24 (desktop), py-12 (mobile)
- Card gaps: gap-6 to gap-8
- Form field spacing: space-y-6
- Tight spacing (badges, chips): px-3 py-1

**Grid Systems**:
- Quote Request Form: Single column max-w-4xl
- Dashboard: 12-column grid with sidebar (3 cols) + main content (9 cols)
- Service Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 with gap-6
- Admin Table View: Full-width responsive tables with horizontal scroll on mobile

## Core Components

### Navigation
**Public Header**:
- Fixed top navigation with max-w-7xl container
- Logo (left), navigation links (center), "Get Quote" + "Login" CTAs (right)
- Height: h-20, with shadow-sm on scroll
- Mobile: Hamburger menu with slide-in drawer

**Dashboard Header**:
- Logo + breadcrumb navigation (left)
- User profile dropdown + notifications (right)
- Persistent across all authenticated pages

### Hero Section (Homepage)
**Layout**: Full viewport height (min-h-screen) with split layout
- Left (50%): Compelling headline (text-6xl font-bold), subheadline (text-xl), dual CTAs ("Upload File" primary + "View Services" secondary)
- Right (50%): Large hero image showing precision manufacturing or 3D CAD visualization
- Background: Subtle gradient overlay on image side for depth

### Service Showcase Cards
**Card Structure** (each manufacturing service):
- Icon container: w-16 h-16 with icon centered
- Service name: text-2xl font-semibold mb-2
- Description: text-base leading-relaxed mb-4
- Key specs list: 3-4 bullet points with check icons
- "Learn More" link with arrow icon
- Hover: Subtle lift transform and shadow increase

### File Upload Component
**Drag-and-Drop Zone**:
- Large dashed border area (min-h-64)
- Centered upload icon (w-16 h-16)
- "Drag & drop files here or click to browse" text
- Supported formats badge: "STEP, STL, DXF, DWG" with file icon
- Upload progress bar when active
- File preview cards below with filename, size, remove button

### Quote Request Form
**Multi-Step Structure**:
- Progress indicator: 4 steps (File Upload → Material & Process → Specifications → Contact Info)
- Each step in card with p-8 padding
- Form fields: Full-width inputs with floating labels
- Dropdowns: Custom styled with chevron icons
- Radio groups: Horizontal card selection for manufacturing processes
- Quantity input: Number stepper with +/- buttons
- Navigation: "Back" + "Continue" buttons, sticky bottom on mobile

### User Dashboard
**Sidebar Navigation** (w-64):
- Logo at top
- Navigation items: Dashboard, My Quotes, Orders, Uploaded Files, Settings
- Active state: Left border accent + bold text
- Logout at bottom

**Main Content Area**:
- Page header: Title + action button (e.g., "New Quote Request")
- Stats cards row: 4 cards showing key metrics (grid-cols-4, each with icon, number, label)
- Recent orders table: Sortable columns (Order ID, Part Name, Status, Date, Price)
- Empty state: Centered illustration + "No orders yet" + CTA

### Order Tracking Timeline
**Status Display**:
- Horizontal timeline for desktop, vertical for mobile
- 7 stages: Quote Requested → Quote Provided → Order Confirmed → In Production → Quality Check → Shipped → Delivered
- Completed stages: Filled circles with checkmark
- Current stage: Larger circle with pulse animation
- Future stages: Outlined circles
- Connecting lines between stages
- Timestamp below each completed stage

### Admin Panel
**Layout**: Two-panel interface
- Left: Incoming quote requests list (scrollable)
- Right: Selected quote details with file viewer, specifications table, quote upload area, status update dropdown
- Bulk actions: Checkbox selection + action bar
- Filters: Date range, status, manufacturing type

**Quote Details View**:
- Customer info card at top
- Uploaded file 3D preview or file icon
- Specifications table (2-column: label | value)
- Quote upload section: PDF drag-drop or "Generate Quote" button
- Status timeline (same as user view)
- Internal notes textarea
- Action buttons: "Send Quote", "Update Status", "Contact Customer"

### Data Tables
**Structure**:
- Sticky header row with sort indicators
- Alternating row backgrounds for readability
- Row hover: Subtle background change + action buttons appear
- Status badges: Rounded-full px-3 py-1 with status-specific styling
- Actions column (right): Icon buttons (View, Edit, Delete)
- Pagination: Bottom right, showing "1-10 of 234" with prev/next

### Buttons & CTAs
**Primary**: Solid fill, px-6 py-3, rounded-lg, font-medium, shadow-sm, with hover lift
**Secondary**: Outlined, same padding, transparent background
**Text Button**: No border, minimal padding, underline on hover
**Icon Button**: Square p-2, rounded-md, icon centered
**Floating Action Button**: Fixed bottom-right, rounded-full, w-16 h-16, shadow-lg

### Form Elements
**Text Inputs**:
- Border rounded-lg, px-4 py-3, focus ring
- Labels: text-sm font-medium mb-2
- Helper text: text-xs below input
- Error state: Red border + error icon + error message

**Dropdowns**:
- Custom styled to match inputs
- Chevron icon (right)
- Dropdown menu: shadow-lg, rounded-lg, max-h-60 overflow-auto

**File Input**:
- Hidden native input, custom button or drag-drop area
- File chips: Filename + size + remove icon, flex-wrap

### Cards
**Standard Card**:
- rounded-xl border shadow-sm
- p-6 for content
- Header: flex justify-between items-center mb-4
- Hover: shadow-md transition

**Stat Card**:
- Icon container (top-left or top-center)
- Large number: text-3xl font-bold
- Label: text-sm uppercase tracking-wide
- Trend indicator: Small arrow + percentage

### Modals & Overlays
**Modal Structure**:
- Backdrop: Semi-transparent overlay
- Content: max-w-2xl centered, rounded-xl, shadow-2xl
- Header: Title + close icon, border-bottom, p-6
- Body: p-6, max-h-96 overflow-auto
- Footer: p-6 border-top, action buttons (right-aligned)

### Badges & Status Indicators
**Badge**: Inline-flex items-center, rounded-full, px-3 py-1, text-xs font-medium
**Status Pill**: Same as badge, with dot icon prefix for active statuses
**Count Badge**: Circular, w-6 h-6, text-xs, absolute positioning on icons

## Images Strategy

**Hero Image**: Large, high-quality image of precision manufacturing equipment, CNC machine in action, or 3D CAD model visualization. Positioned on right 50% of hero section with subtle gradient overlay.

**Service Icons**: Use Material Icons or Heroicons for manufacturing processes (settings for CNC, layers for 3D printing, etc.)

**Empty States**: Illustration-style graphics for empty dashboard, no orders, no files uploaded scenarios

**File Preview**: Thumbnail representations of uploaded CAD files, fallback to file type icons for unsupported previews

**3D Viewer**: Embedded Three.js or similar viewer for STEP/STL file visualization in quote details

## Responsive Behavior

**Breakpoints**:
- Mobile: < 768px (single column, stacked navigation, bottom sheets)
- Tablet: 768px - 1024px (2-column grids, simplified tables)
- Desktop: > 1024px (full multi-column layouts, sidebar navigation)

**Mobile Adaptations**:
- Hero: Stack vertically (image above text)
- Dashboard: Hamburger menu, full-width main content
- Tables: Horizontal scroll or card-based view
- Forms: Full-width inputs, single column
- Timeline: Vertical orientation

## Accessibility Notes
- Maintain WCAG AA contrast ratios throughout
- All interactive elements keyboard navigable
- Form validation with clear error messages
- ARIA labels on icon-only buttons
- Focus indicators on all focusable elements
- Screen reader announcements for status changes

This design creates a professional, trustworthy manufacturing platform that balances technical functionality with approachable user experience, optimized for B2B workflows.