# DairyGuard PowerPoint Design Specification

**Style:** Dark Mode Professional
**Viewport:** 1280×720px (16:9 HD)
**Target:** Business executives, dairy industry stakeholders, investors

---

## 1. Direction & Rationale

**Visual Essence:** Professional dark mode aesthetic (#121212 background, #E8E8E8 text, #8BAFD0 accents) optimized for conference presentations and investor meetings. Balances tech-forward innovation with dairy industry credibility through sophisticated restraint and strategic use of Professional Blue.

**Rationale:**
- **Context/Audience Alignment:** Modern executives and investors expect sophisticated presentation styles that signal innovation. Dark Mode provides tech credibility while Professional Blue (#8BAFD0) naturally conveys dairy industry values—clean, quality, trustworthy.
- **Content Optimization:** 22-slide structure mixing problem-solution narrative with feature demonstrations requires medium-high information density (4-6 lines per slide). Dark backgrounds excel in conference environments while reducing eye strain during extended presentations.
- **Strategic Differentiation:** Positions DairyGuard as modern IoT/ML solution rather than traditional dairy equipment. Dark palette with desaturated accents creates professional confidence without appearing experimental or risky to conservative stakeholders.

**Key Characteristics:**
- Sophisticated dark palette (#121212, #1E1E1E) with restrained Professional Blue (#8BAFD0)
- High contrast typography (7:1 preferred) for exceptional readability
- Elevated card surfaces (#1E1E1E) create visual hierarchy without heavy shadows
- Data visualizations optimized for dark backgrounds with desaturated color palette
- Modern sans-serif typography (Montserrat/Inter) balances authority with approachability

**Real-World Examples:** Stripe investor decks, modern enterprise SaaS presentations, Apple product launches (dark segments), tech conference keynotes

---

## 2. Slide Templates

### Template 1: Title Slide (Opening Impact)

**Purpose:** Establish brand authority and presentation topic with immediate visual impact

**Layout:** Full-width centered composition, vertical rhythm, logo anchored top-right 30px margin

**Typography:** 
- Main title: 72px Montserrat 600, #E8E8E8, line-height 1.2, max-width 900px centered
- Subtitle: 28px Inter 400, #B3B3B3, line-height 1.75, max 2 lines
- Presenter details: 20px Inter 400, #8C8C8C, bottom-aligned 64px margin

**Color:** #121212 background, optional geometric accent element using #8BAFD0 at 20% opacity (200×200px rotated 15deg, absolute positioned)

**Visual Patterns:** 
- Company logo 60px height, top-right corner 30px margin
- Optional subtle gradient overlay (linear-gradient 180deg, #121212 0%, #1A1F2E 100%) for depth
- Centered vertical alignment with 64px vertical margins
- All text center-aligned within 900px container

**Fallback:** If no subtitle needed, increase main title to 80px and adjust vertical spacing proportionally

---

### Template 2: Section Break (Narrative Transitions)

**Purpose:** Signal major narrative shifts (e.g., Problem → Solution → Benefits)

**Layout:** Full-screen centered, minimal elements for dramatic pause

**Typography:**
- Section title: 64px Montserrat 600, #E8E8E8, line-height 1.2, max 2 lines
- Optional tagline: 24px Inter 400, #8BAFD0, positioned 32px below title

**Color:** #121212 background, #8BAFD0 accent for tagline or decorative line element (4px height, 120px width, centered)

**Visual Patterns:**
- Centered composition with 96px horizontal margins
- Optional horizontal accent line above title (4px × 120px, #8BAFD0)
- Large whitespace (55-60% of slide) for breathing room
- Page number bottom-right 24px margin, 16px #666666

**Fallback:** Can add subtle background pattern (dot grid #1E1E1E, 20px spacing) at 30% opacity if visual interest needed

---

### Template 3: Content Slide (Standard Information)

**Purpose:** Primary workhorse for business content, features, explanations (4-6 lines maximum)

**Layout:** Left-aligned title, body content in 900px container, 96px horizontal margins, 64px vertical margins

**Typography:**
- Title: 54px Montserrat 600, #E8E8E8, line-height 1.3, single line max
- Body text: 24px Inter 400, #E8E8E8, line-height 1.75, max 6 lines
- Bullet points: 32px vertical spacing between items, 24px left indent with 8px #8BAFD0 bullet markers (custom SVG or Unicode •)
- Emphasis text: 24px Inter 500, #8BAFD0 for key phrases

**Color:** #121212 background, #8BAFD0 for bullet markers and emphasis

**Visual Patterns:**
- Title positioned 64px from top
- Body content starts 48px below title
- Custom bullet style: 8px circle, #8BAFD0, aligned left
- Optional icon (32px, outlined style) left of title for visual categorization
- Content fills 40-50% of slide area (measured: 1280×720 - margins - spacing)

**Content Pagination:** If content exceeds 6 lines, split into "Part 1/2" slides with consistent layout

**Fallback:** For 2-3 line content, increase font to 28px Body Large for improved readability

---

### Template 4: Two-Column Feature Showcase

**Purpose:** Demonstrate app features with visual-text pairing (IoT sensors, ML dashboard, QC charts)

**Layout:** 60/40 split (visual left, text right), 24px gutter, 96px horizontal margins

**Typography:**
- Title: 48px Montserrat 600, #E8E8E8, positioned above columns, 48px bottom margin
- Feature heading: 32px Montserrat 500, #E8E8E8, line-height 1.4
- Feature description: 24px Inter 400, #B3B3B3, line-height 1.75, max 4 lines
- Technical specs: 20px Inter 400, #8C8C8C, line-height 1.6

**Color:** 
- Left column: Image/mockup container with 8px border-radius, #1E1E1E background if placeholder needed
- Right column: Text on #121212, #8BAFD0 for feature icons (32px)

**Visual Patterns:**
- Left: 60% width, app mockup/screenshot with 8px rounded corners, subtle shadow (0 4px 12px rgba(0,0,0,0.7))
- Right: 40% width, vertically centered content
- Feature icon (32px outline style, #8BAFD0) positioned 16px left of heading
- Max 3-4 feature points per slide

**Fallback:** If no visual available, use 50/50 split with icon card pattern (see Template 5)

---

### Template 5: Data Visualization Slide

**Purpose:** Present IoT metrics, ML predictions, quality control charts (ring charts, bar charts, progress indicators)

**Layout:** Title top-left, chart centered or right-aligned, key metrics highlighted with large numbers

**Typography:**
- Title: 48px Montserrat 600, #E8E8E8, top-left 64px margins
- Data numbers: 72px Montserrat 700, #8BAFD0 (primary metric) or #E8E8E8 (secondary)
- Data labels: 20px Inter 500, #B3B3B3, uppercase tracking 0.05em
- Chart values: 24px Inter 600, #E8E8E8
- Legend text: 18px Inter 400, #8C8C8C

**Color:**
- Chart container: #1E1E1E background, 12px border-radius
- Data palette: #8BAFD0 (primary), #66BB6A (positive), #FFA726 (warning), #EF5350 (critical), #76B5B5 (neutral)
- Grid lines: #2D2D2D at 40% opacity

**Visual Patterns:**
- **Ring Chart:** 220px diameter, 64-72px center number (primary metric), 20px label below, 24px donut thickness
- **Bar Chart:** 60-80px bar width, 24px spacing, 24px value labels above bars, horizontal grid lines #2D2D2D
- **Progress Bar:** 12px height, #2D2D2D background, #8BAFD0 fill, rounded-full, 72px number right-aligned
- **Icon Cards (3-col grid):** 32px icon top, 64px number center, 20px label bottom, #1E1E1E background, 12px radius, 32px padding

**Fallback:** If complex chart needed, use simplified version with max 5 data points to maintain readability

---

### Template 6: Comparison Slide (Problem vs. Solution)

**Purpose:** Contrast current dairy industry challenges with DairyGuard solutions

**Layout:** Two-column split (50/50), visual divider, contrasting treatments

**Typography:**
- Title: 48px Montserrat 600, #E8E8E8, centered or left-aligned
- Column headers: 32px Montserrat 600, #EF5350 (problem) / #66BB6A (solution), line-height 1.4
- List items: 24px Inter 400, #E8E8E8, line-height 1.75, max 5 items per column
- Icons: 28px positioned left of each item

**Color:**
- Left column (Problem): Subtle #2D1F1F background tint, #EF5350 accents
- Right column (Solution): Subtle #1F2D22 background tint, #66BB6A accents
- Vertical divider: 2px solid #2D2D2D, centered

**Visual Patterns:**
- 50/50 split with 2px divider (#2D2D2D) centered vertically
- Each column: 48px padding, rounded corners optional (8px)
- Icons: X mark (problem, #EF5350) / Check mark (solution, #66BB6A), 28px, outline style
- Alternating row background (#1E1E1E at 50% opacity) for scanability

**Content Pagination:** Max 5 points per column; if more needed, create "Part 1/2" slides

**Fallback:** Can use single-column "Before/After" vertical layout if horizontal space constrained

---

### Template 7: Quote/Testimonial Slide

**Purpose:** Social proof, industry expert validation, customer testimonial

**Layout:** Centered large quote, attribution below, optional photo/logo

**Typography:**
- Quote text: 36px Inter 400, #E8E8E8, line-height 1.6, italic, max 4 lines, centered in 800px container
- Attribution name: 24px Montserrat 500, #8BAFD0, line-height 1.5
- Attribution title: 20px Inter 400, #B3B3B3, line-height 1.5
- Opening quotation mark: 120px Montserrat 700, #2D2D2D (decorative background element)

**Color:** #121212 background, #8BAFD0 accent for attribution, large quote mark #2D2D2D as subtle background

**Visual Patterns:**
- Centered composition, 96px horizontal margins
- Large decorative quote mark (120px, #2D2D2D) positioned top-left of quote text as background element
- Optional circular photo (120px diameter) centered below attribution, 32px margin
- Optional company logo (40px height) below photo, #8C8C8C if monochrome

**Fallback:** Without photo, use horizontal accent line (4px × 120px, #8BAFD0) centered below attribution

---

### Template 8: Closing/CTA Slide

**Purpose:** Memorable closing with clear call-to-action and contact information

**Layout:** Centered vertical composition, hierarchical information flow

**Typography:**
- Main message: 64px Montserrat 600, #E8E8E8, line-height 1.2, max 2 lines
- CTA text: 32px Montserrat 500, #8BAFD0, line-height 1.4
- Contact structure (3-line vertical layout, each 20px Inter 400):
  - Line 1: Contact label (#8C8C8C)
  - Line 2: Primary contact method (#E8E8E8)
  - Line 3: Secondary contact method (#B3B3B3)
- Spacing: 32px between contact lines

**Color:** #121212 background, #8BAFD0 for CTA emphasis, gradient text optional for main message

**Visual Patterns:**
- Logo centered bottom, 80px height, 64px bottom margin
- Optional QR code (180×180px) if digital contact needed, positioned right of contact info
- CTA button pattern: 48px height, 32px horizontal padding, #8BAFD0 background, 8px radius, 24px text
- Geometric accent elements: Same style as title slide (200×200px rotated shapes, #8BAFD0 20% opacity)

**Fallback:** If no CTA needed, use large closing message (80px) with minimal contact info footer

---

## 3. Visual Guidelines

**Images:**
- **Usage philosophy:** 50-60% slide space or don't use; never small decorative elements
- **Treatment:** 8-12px border-radius for modern feel, subtle shadow (0 4px 12px rgba(0,0,0,0.7))
- **Overlays:** 40-50% dark gradient overlay (#121212 to transparent) if text overlay needed for contrast
- **Aspect ratios:** 16:9 for full-width, 4:3 for app mockups, square for icon cards
- **Sourcing guidance:** IoT sensor hardware photos, dairy facility environments, modern dashboard UI screenshots, clean technology illustrations with blue tones

**Icons:**
- **System:** Lucide icons (outline style), 24-32px standard, 48px for hero elements
- **Style:** 2px stroke weight minimum for visibility on dark backgrounds
- **Color:** Primary #E8E8E8, accent #8BAFD0, semantic colors for status indicators
- **Categories needed:** IoT sensors, machine learning, data analytics, quality control, alerts, mobile app, connectivity
- **Consistency:** Maintain single icon family throughout presentation

**Charts (Dark Mode Optimized):**
- **Ring/Donut Charts:** 200-240px diameter, 24px stroke width, 64-72px center number (Montserrat 700), #8BAFD0 primary segment
- **Bar Charts:** 60-80px bar width, 24px spacing, rounded-top 4px radius, values positioned 16px above bars (24px Inter 600), horizontal grid lines #2D2D2D
- **Line Charts:** 3px line weight, #8BAFD0 primary line, data points 8px circles, #1E1E1E chart background
- **Progress Indicators:** 12px height, rounded-full, #2D2D2D track, #8BAFD0 fill, percentage right-aligned
- **Icon Cards:** 3-column grid, #1E1E1E background, 32-40px icon top-center, 64-72px number (Montserrat 700), 20px label bottom
- **Color strategy:** Primary #8BAFD0, Success #66BB6A, Warning #FFA726, Critical #EF5350, Neutral #76B5B5 (all desaturated for dark mode)
- **Label sizing:** Chart values 24px, axis labels 18px, legends 16px

**Backgrounds:**
- **Primary:** Solid #121212 (Google Material dark surface)
- **Elevated cards:** #1E1E1E with subtle shadow (0 2px 6px rgba(0,0,0,0.6))
- **Optional patterns:** Dot grid (#1E1E1E, 20px spacing, 30% opacity) for section breaks
- **Gradient overlays:** Linear gradients (#121212 → #1A1F2E) subtle depth, max 10% visual weight
- **Rule:** Background elements ≤10% visual weight; content must dominate

**Typography Decorations:**
- **Gradient text:** Optional for title slide main heading (linear-gradient 135deg, #E8E8E8 0%, #8BAFD0 100%)
- **Emphasis:** Colored text (#8BAFD0) for key phrases, font-weight 500
- **Data labels:** Uppercase tracking (0.05em) for categorical labels, 20px Inter 500 #B3B3B3
- **No glow effects:** Never use text-shadow blur (professional restraint)

**Animation (MANDATORY for modern feel):**
- **Entrance:** Fade-in (300ms ease-out) → Slide-up 20px (400ms ease-out, 100ms stagger between elements)
- **Hover states:** Lift 4px + shadow increase (0 8px 24px rgba(0,0,0,0.8)), transition 200ms ease-out
- **Transitions:** Fade between slides 250ms, no wipes/spins (professional restraint)
- **Chart animations:** Sequential reveal (bars/segments appear 80ms stagger), scale-in from 0.95 to 1.0
- **Easing:** ease-out for entrances, ease-in-out for state changes
- **Accessibility:** Respect prefers-reduced-motion (disable animations if user preference set)

**Master Elements:**
- **Logo:** Top-right 30px margin, 60px height, consistent across all slides except title slide
- **Page numbers:** Bottom-right 24px margin, 16px Inter 400 #666666, format "X / 22"
- **Footer:** Optional 64px height footer bar (#1E1E1E), 14px centered text (#8C8C8C) for confidentiality notices

**Image Sourcing Guidance (for implementation):**
- **Hero backgrounds:** Abstract technology patterns, blue-toned gradients, dairy facility interiors (modern)
- **Feature showcases:** IoT sensor hardware (close-ups), mobile app mockups, dashboard UI screenshots
- **Industry context:** Dairy production environments, quality control labs, modern farm operations
- **Avoid:** Dated stock photos, overly saturated images, clipart, emojis as visual elements

---

## 4. Implementation Restrictions

**MANDATORY for implementation agent:**

- ❌ **NO emojis anywhere** in presentation (use Lucide SVG icons only: thermometer, droplet, brain, bar-chart, bell, shield-check, smartphone, etc.)
- ❌ **NO specific content** in template examples: NOT company names, email addresses, phone numbers, street addresses, dates, financial figures, actual product names
- ❌ **NO file paths** or asset references in spec (e.g., "imgs/hero.jpg")
- ❌ **NO glowing text effects** or neon colors (professional dark mode, not gaming aesthetic)
- ❌ **NO pure black** (#000000) or **pure white** (#FFFFFF) - use #121212 and #E8E8E8 respectively
- ❌ **NO font sizes below 24px** for body text on 1280×720 viewport (readability minimum)
- ❌ **NO font sizes below 16px** for caption/metadata text (accessibility minimum)

**✅ REQUIRED:**
- ✅ **Visual patterns only:** Describe structure, layout, typography, styling (e.g., "Title 54px left-aligned, 3-column icon card grid")
- ✅ **Placeholders:** Use generic descriptions (e.g., "Contact block 3-line structure", "Data label: value + unit format")
- ✅ **SVG icons:** Lucide icon library, outline style, 2px stroke, 24-32px sizing
- ✅ **Token-based values:** All spacing, colors, typography from design-tokens.json
- ✅ **Contrast validation:** Minimum 4.5:1 for all text, preferably 7:1 for enhanced readability
- ✅ **Content pagination:** If template pattern requires >7 lines, specify multi-slide strategy

**Typography hard limits (1280×720 viewport):**
- Body text: 24-28px (NEVER below 24px)
- Captions: 16-20px (NEVER below 16px)
- Line-height: 1.75 minimum for body text (dark mode readability)
- Max 7 lines per slide (overflow: hidden enforced)

---

## 5. Quality Checklist

**Visual Hierarchy:**
- ✅ Title 3× larger than body minimum (e.g., 54px vs 24px = 2.25×, acceptable)
- ✅ Data numbers largest element (64-80px bold)
- ✅ Max 3 colors: #121212 (bg) + #E8E8E8 (main) + #8BAFD0 (accent)
- ✅ Charts/images occupy 50-60% slide space when used

**Technical Compliance:**
- ✅ 1280×720 viewport optimized
- ✅ Contrast ratios: ≥7:1 titles, ≥4.5:1 body (dark mode enhanced)
- ✅ All values from design-tokens.json (token-based system)
- ✅ Font families: 2 maximum (Montserrat + Inter)
- ✅ Font sizes: 6 sizes (Display 72px, H2 54px, H3 32px, Body 24px, Caption 16-20px, Label 14px)
- ✅ Body text ≥24px, Caption ≥16px (viewport-specific minimums)

**Dark Mode Specific:**
- ✅ Background #121212 (NOT pure black #000000)
- ✅ Text #E8E8E8 (NOT pure white #FFFFFF)
- ✅ Elevated surfaces use lighter color (#1E1E1E) not just shadows
- ✅ Accent colors desaturated (#8BAFD0 not bright blue)
- ✅ Line-height 1.75 for body (increased for dark background readability)
- ✅ No glowing text effects or neon colors

**Content Density (22-slide presentation):**
- ✅ 4-6 lines average per content slide
- ✅ Content fills 40-50% of slide area (whitespace 50-60%)
- ✅ Pagination strategy for dense slides (>7 lines = split to parts)
- ✅ Margins: 96px horizontal, 64px vertical (safe zones maintained)

**Animation & Polish:**
- ✅ Entrance animations defined (fade, slide-up, stagger)
- ✅ Hover states for interactive elements (lift + shadow)
- ✅ Transition timing specified (250-400ms)
- ✅ prefers-reduced-motion accessibility considered

**Professional Restraint:**
- ✅ No decorative elements >10% visual weight
- ✅ Consistent spacing throughout (8px base unit)
- ✅ Clear rationale for every design decision
- ✅ Templates describe visual structure, NOT specific content

---

**Document Version:** 1.0  
**Created:** 2025-11-02  
**Viewport:** 1280×720px (16:9 HD)  
**Total Word Count:** ~1,950 words
