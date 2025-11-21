# Doctor AI - Design Guidelines

## Design Approach
**System-Based Approach** using Material Design principles adapted for healthcare context. This medical analytics application requires clarity, trust, and professional presentation of complex health data.

Reference inspirations: **Apple Health** (data visualization), **Notion** (clean information hierarchy), **Linear** (modern dashboard patterns)

## Core Design Principles
1. **Medical Trust**: Professional, clean aesthetic that conveys reliability
2. **Data Clarity**: Information hierarchy optimized for reading health metrics
3. **Calm Interface**: Reduce cognitive load with generous spacing and clear sections
4. **Guided Experience**: Progressive disclosure of complex information

---

## Typography System

**Font Stack**: 
- Primary: Inter (headings, UI elements)
- Secondary: System UI (body text, data)

**Hierarchy**:
- Hero/Page Titles: text-4xl font-bold (Dashboard headings)
- Section Headers: text-2xl font-semibold
- Subsection Headers: text-xl font-medium
- Body Text: text-base font-normal leading-relaxed
- Data/Metrics: text-lg font-semibold (health values)
- Labels/Captions: text-sm font-medium
- Small Print/Footnotes: text-xs

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16**
- Micro spacing: p-2, gap-2 (tight groupings)
- Standard spacing: p-4, gap-4, m-6 (component padding)
- Section spacing: py-8, py-12 (between major sections)
- Large breathing room: py-16 (page sections)

**Container Strategy**:
- Max-width: max-w-7xl (main dashboard)
- Sidebar: w-64 fixed
- Content area: flex-1 with p-8
- Cards: p-6 with rounded-xl borders

**Grid Patterns**:
- Metrics grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Dashboard layout: Two-column split (2/3 main, 1/3 sidebar)
- Report history: Single column with max-w-4xl

---

## Component Library

### 1. Navigation & Structure
**Top Header**:
- Fixed top bar with app logo left, user profile/settings right
- Height: h-16
- Horizontal padding: px-6

**Sidebar Navigation** (optional for multi-page):
- Fixed left sidebar w-64
- Navigation items with icons + labels
- Active state: background treatment, font-semibold

### 2. File Upload Interface
**Upload Zone**:
- Large dropzone: min-h-64, border-2 border-dashed rounded-2xl
- Center-aligned icon (document with plus), heading, and subtext
- Drag-over state: border-solid with subtle background shift
- Supported formats display: "PDF, PNG, JPG up to 10MB"

**Uploaded File Card**:
- Horizontal layout: thumbnail (w-16 h-20) + filename + file size + remove button
- Rounded-lg with subtle border
- Padding: p-4

### 3. Dashboard Cards

**Metrics Card**:
- Structure: Icon + Label + Large Value + Trend indicator
- Padding: p-6
- Rounded: rounded-xl
- Border: border with subtle shadow
- Status indicators: Small badge showing "Normal", "Attention", "Critical"

**Life Score Gauge**:
- Circular progress indicator showing 0-100 score
- Large centered number: text-5xl font-bold
- Surrounding ring with gradient fill based on score
- Below: Breakdown of contributing factors in small cards

**Health Insights Section**:
- Accordion or expandable cards for each biomarker category
- Icon + Category name + Status badge
- Expandable details showing: Range, Your Value, Recommendation
- Grid of 2-3 columns on desktop, stack on mobile

### 4. Recommendations Display

**Lifestyle Cards**:
- Category icon (diet, exercise, sleep, stress)
- Bold recommendation title
- Bulleted action items (max 3-5 per card)
- Padding: p-6, gap-4 between items

**Priority Indicators**:
- Visual hierarchy using icon sizes and badge treatments
- High priority: Larger icon, bold text
- Medium/Low: Smaller, normal weight

### 5. Report History

**Timeline View**:
- Vertical timeline with date markers
- Each report: Card showing date uploaded, document name, score at that time
- "View Details" link to expand full analysis
- Most recent at top

### 6. Data Visualization

**Charts & Graphs**:
- Use library-based charts (Chart.js via CDN)
- Bar charts for category comparisons
- Line graphs for trends over time
- Horizontal bars for ranges with "your value" marker

### 7. Forms & Inputs

**Text Inputs**:
- Height: h-12
- Padding: px-4
- Rounded: rounded-lg
- Border with focus state (ring treatment)

**Buttons**:
- Primary CTA: px-6 py-3 rounded-lg font-semibold
- Secondary: Similar with border treatment
- Icon buttons: w-10 h-10 rounded-full

**File Upload Button**:
- Prominent: px-8 py-4 text-lg
- Icon + "Upload Health Report" text

### 8. Status & Feedback

**Loading States**:
- Skeleton loaders for cards (h-32 rounded-xl with pulse animation)
- Spinner for file upload progress
- Progress bar for analysis: w-full h-2 rounded-full with animated fill

**Alert Banners**:
- Success: rounded-lg p-4 with icon + message
- Warning: Similar treatment
- Error: Similar with appropriate icon

**Empty States**:
- Centered icon + heading + description
- CTA button to upload first report
- Illustration or large icon representation

---

## Page Layouts

### Upload/Home Page
- Hero section with app value proposition (h-96)
- Large upload dropzone centered
- Below: "How it works" in 3-step horizontal cards (icon, title, description)

### Dashboard Page
- Top: Summary cards in 3-column grid (Total Reports, Latest Score, Last Upload)
- Main: Life Score gauge (large, centered) 
- Below: Health metrics in expandable sections
- Sidebar: Recommendations panel

### Report Detail View
- Header: Document name + upload date + score badge
- Two-column: Left (extracted metrics in organized groups), Right (recommendations)
- Full-width: Visualizations showing metric ranges

---

## Images

**Hero Section**: 
- Use abstract medical/health imagery - clean stock photo of health data visualization, modern medical technology, or abstract wellness concept
- Treatment: Subtle gradient overlay for text contrast
- Size: Full-width, h-96 on desktop

**Empty State Illustrations**:
- Document upload illustration when no reports exist
- Custom SVG icon for file upload zone (use placeholder comment)

**Category Icons**:
- Use Heroicons for all UI icons
- Medical icons: heart, beaker, chart-bar, clipboard-document-list
- Lifestyle icons: food, running, moon, meditation

---

## Responsive Behavior

**Mobile (< 768px)**:
- Stack all grids to single column
- Hide sidebar, use hamburger menu
- Upload zone: min-h-48
- Life score gauge: Smaller radius
- Reduce padding: p-4 instead of p-8

**Tablet (768px - 1024px)**:
- Two-column grids where appropriate
- Maintain sidebar navigation

**Desktop (> 1024px)**:
- Full three-column metric grids
- Two-column dashboard layout
- Sidebar persistent

---

## Accessibility & Interactions

- All interactive elements minimum h-12 for touch targets
- Focus states: ring-2 treatment on all focusable elements
- Labels paired with all form inputs
- ARIA labels for icon-only buttons
- Keyboard navigation support for all interactions
- High contrast for text over backgrounds (minimum 4.5:1 ratio)

---

**Animation Philosophy**: Minimal and purposeful only
- Subtle fade-in for loaded data (150ms)
- Smooth transitions for expandable sections (200ms)
- Progress indicators for uploads
- NO decorative animations, scroll effects, or unnecessary motion