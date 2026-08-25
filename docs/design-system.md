# ShopSphere Design System & Architecture Guide

Welcome to the central design system and component architecture documentation for **ShopSphere** (Social-Commerce Marketplace).

---

## 1. Brand Identity

- **Brand**: SHOPSPHERE
- **Tagline**: DISCOVER. WATCH. SHOP.
- **Visual Identity**: Modern social-commerce marketplace combining high information density, video discovery, and enterprise operational tools.

---

## 2. Color Tokens

### Light Mode Palette
- **Primary**: `#131A22` (Header & Primary Navigation)
- **Primary Secondary**: `#232F3E` (Secondary Category Navbar)
- **Accent**: `#FFB000` (Gold Brand Highlight)
- **Accent Hover**: `#F59E0B`
- **Page Background**: `#F7F7F7`
- **Surface**: `#FFFFFF`
- **Surface Secondary**: `#F3F4F6`
- **Text Primary**: `#111827`
- **Text Secondary**: `#4B5563`
- **Text Muted**: `#6B7280`
- **Border**: `#D5D9D9`
- **Status Success**: `#067D62`
- **Status Warning**: `#F59E0B`
- **Status Danger**: `#C40000`
- **Status Info**: `#2563EB`
- **Social Like**: `#E11D48`

### Dark Mode Palette (`.dark` class on root)
- **Background**: `#0F1115`
- **Surface**: `#171A21`
- **Surface Secondary**: `#20242D`
- **Text Primary**: `#F9FAFB`
- **Text Secondary**: `#A1A1AA`
- **Border**: `#2A2F38`
- **Accent**: `#FFB000`

---

## 3. Typography System

Font Family: `Inter`, system-ui fallback.

| Token | Size | Weight | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **H1** | 36px | 700 / 800 | 1.2 | Page titles & hero headers |
| **H2** | 28px | 700 | 1.25 | Section headers |
| **H3** | 22px | 600 | 1.3 | Subheaders & modal titles |
| **H4** | 18px | 600 | 1.4 | Card headers |
| **Body** | 14px–16px | 400 | 1.5 | General text content |
| **Small** | 12px–13px | 400–500 | 1.4 | Helper text, metadata |
| **Price** | 24px–30px | 700 | 1.0 | Product prices |
| **Navigation** | 13px–14px | 500–600 | 1.0 | Header links |
| **KPI Stat** | 28px–32px | 700 | 1.0 | Admin dashboard metrics |

---

## 4. Spacing & Container Hierarchy

Base unit: `4px` grid (4, 8, 12, 16, 20, 24, 32, 40, 48, 64).
- **Max Content Width**: `1440px` (`max-w-[1440px] margin-inline: auto`)
- **Desktop Horizontal Padding**: `24px–32px` (`px-6 lg:px-8`)
- **Mobile Horizontal Padding**: `12px–16px` (`px-3 sm:px-4`)

---

## 5. Border Radius System

- `4px` (`rounded-sm`): Small controls & indicators
- `6px` (`rounded-md`): Buttons & Input fields
- `8px` (`rounded-lg`): Default Cards & Product tiles
- `10px` (`rounded-xl`): Large Cards & Banner panels
- `12px` (`rounded-2xl`): Drawers, Modals & Video overlays
- `9999px` (`rounded-pill`): Badges, Status tags & User avatars only

---

## 6. Z-Index Scale

- **Base**: `0`
- **Sticky**: `20`
- **Header**: `40`
- **Dropdown**: `50`
- **Mobile Bottom Navigation**: `60`
- **Drawer**: `70`
- **Modal**: `80`
- **Toast Notifications**: `90`

---

## 7. Core Component System

### Buttons (`src/components/ui/Button.jsx`)
Variants: `primary`, `secondary`, `outline`, `ghost`, `danger`, `link`.
Sizes: `sm` (32px), `md` (40-44px), `lg` (48px), `icon` (40x40px).

### Form Controls (`src/components/ui/Input.jsx`, `FormControls.jsx`)
Includes `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`.
All controls enforce a 2px accessible focus ring (`focus:ring-2 focus:ring-accent`).

### Overlays (`src/components/ui/Modal.jsx`, `Drawer.jsx`, `Overlays.jsx`)
- **Modal**: Responsive modal dialogs with focus trap, ESC listener, backdrop click dismiss.
- **Drawer**: Right-side panel on desktop, bottom sheet on mobile screens with top drag handle.

### Toast System (`src/components/ui/ToastContainer.jsx`)
Positioned at bottom-right on desktop (`sm:bottom-6 sm:right-6`) and bottom-center on mobile (`bottom-20`).

---

## 8. Application Shells

### Customer Shell (`src/components/layouts/CustomerLayout.jsx`)
Contains Customer Header (`64px`), Secondary Category Bar (`42px`), Main Content Outlet, Footer, and Fixed Mobile Bottom Bar (`64-72px`).

### Creator Shell (`src/components/layouts/CreatorLayout.jsx`)
Contains Creator Studio 240px sidebar, studio topbar, and quick reel creation workflows.

### Admin Shell (`src/components/layouts/AdminLayout.jsx`)
Contains Enterprise 250px / 72px collapsible sidebar (`#111827` bg, `#FFB000` active indicator), 64px topbar, search bar, and mobile drawer.
