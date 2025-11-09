# Design System Implementation Guide

This guide will help you apply the clean design system consistently across all pages in the application.

## Table of Contents
1. [Overview](#overview)
2. [Design Tokens](#design-tokens)
3. [Components](#components)
4. [Implementation Examples](#implementation-examples)
5. [Best Practices](#best-practices)

---

## Overview

The design system is based on a clean, modern aesthetic with:
- Consistent spacing and shadows
- Category-specific colors
- Reusable components
- Clear visual hierarchy
- Subtle animations

**Reference Implementation**: `src/pages/Dashboard.jsx`

---

## Design Tokens

### Colors

#### Category Colors
```javascript
// Marketing (Orange)
bg-marketing-50, text-marketing-500, border-marketing-500

// Finance (Green)
bg-finance-50, text-finance-500, border-finance-500

// Customer Service (Red)
bg-sac-50, text-sac-500, border-sac-500

// Retention (Blue)
bg-retention-50, text-retention-500, border-retention-500

// Growth (Purple)
bg-growth-50, text-growth-500, border-growth-500

// Data (Blue)
bg-data-50, text-data-500, border-data-500
```

#### Status Colors
```javascript
// Stable/Success
bg-status-stable-50, text-status-stable-600

// Pending/Warning
bg-status-pending-50, text-status-pending-600

// Executed
bg-status-executed-50, text-status-executed-600

// Review
bg-status-review-50, text-status-review-600
```

### Spacing
```javascript
space-y-section  // 32px - Section spacing
p-card           // 24px - Card padding
gap-6            // 24px - Grid gaps
```

### Border Radius
```javascript
rounded-card     // 12px - Cards
rounded-button   // 8px - Buttons
rounded-pill     // 24px - Pill buttons/badges
```

### Shadows
```javascript
shadow-card          // Subtle card shadow
shadow-card-hover    // Enhanced shadow on hover
shadow-button        // Button shadow
```

---

## Components

### 1. PageHeader
**Location**: `src/components/common/PageHeader.jsx`

**Usage**:
```jsx
import PageHeader from '../components/common/PageHeader';

<PageHeader
  title="Page Title"
  subtitle="Optional subtitle or date range"
  status={{
    status: 'stable',
    label: 'Stable',
    showDot: true
  }}
  actions={
    <button className="btn-primary">Action Button</button>
  }
/>
```

**Props**:
- `title` (string): Main page heading
- `subtitle` (string): Optional description
- `status` (object): Status badge config
- `actions` (ReactNode): Action buttons/components

---

### 2. StatusBadge
**Location**: `src/components/common/StatusBadge.jsx`

**Usage**:
```jsx
import StatusBadge from '../components/common/StatusBadge';

<StatusBadge
  status="stable"
  label="Stable"
  showDot={true}
/>
```

**Props**:
- `status`: 'stable' | 'pending' | 'executed' | 'review'
- `label` (string): Badge text
- `showDot` (boolean): Show status indicator dot

---

### 3. QuickActionButton
**Location**: `src/components/common/QuickActionButton.jsx`

**Usage**:
```jsx
import QuickActionButton from '../components/common/QuickActionButton';

<QuickActionButton
  label="Action Name"
  onClick={handleClick}
  icon={FiIcon}
/>
```

**Props**:
- `label` (string): Button text
- `onClick` (function): Click handler
- `icon` (Component): Optional icon
- `disabled` (boolean): Disabled state

---

### 4. CategoryCard
**Location**: `src/components/common/CategoryCard.jsx`

**Usage**:
```jsx
import CategoryCard from '../components/common/CategoryCard';
import { FiTrendingUp } from 'react-icons/fi';

<CategoryCard
  category="marketing"
  title="Marketing"
  icon={FiTrendingUp}
  metrics={[
    { label: 'ROAS', value: '3.1' },
    { label: 'CPA', value: '$9,500' },
    { label: 'CTR', value: '3.4%' }
  ]}
/>
```

**Props**:
- `category`: 'marketing' | 'finance' | 'sac' | 'retention' | 'growth' | 'data'
- `title` (string): Card title
- `icon` (Component): Icon component
- `metrics` (array): Array of { label, value } objects
- `iconBgColor` (string): Custom icon background (optional)
- `iconColor` (string): Custom icon color (optional)

---

### 5. SectionHeader
**Location**: `src/components/common/SectionHeader.jsx`

**Usage**:
```jsx
import SectionHeader from '../components/common/SectionHeader';

<SectionHeader
  title="Section Title"
  subtitle="Optional description"
  borderColor="border-primary-500"
  action={<button>Action</button>}
/>
```

**Props**:
- `title` (string): Section heading
- `subtitle` (string): Optional description
- `borderColor` (string): Left border color class
- `action` (ReactNode): Optional action component

---

## Implementation Examples

### Example 1: Basic Page Structure

```jsx
import PageHeader from '../components/common/PageHeader';
import SectionHeader from '../components/common/SectionHeader';
import CategoryCard from '../components/common/CategoryCard';

const MyPage = () => {
  return (
    <div className="space-y-section">
      {/* Page Header */}
      <PageHeader
        title="My Page"
        subtitle="Page description"
        status={{ status: 'stable', label: 'Stable' }}
      />

      {/* Section 1 */}
      <div>
        <SectionHeader title="Key Metrics" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Cards here */}
        </div>
      </div>
    </div>
  );
};
```

### Example 2: Using Custom Card Classes

```jsx
// Use utility classes for custom cards
<div className="card card-hover p-6">
  <h3 className="text-lg font-semibold mb-4">Card Title</h3>
  <div className="space-y-3">
    {/* Card content */}
  </div>
</div>
```

### Example 3: Button Variations

```jsx
// Primary button
<button className="btn-primary">Primary Action</button>

// Secondary button
<button className="btn-secondary">Secondary Action</button>

// Pill button (for quick actions)
<button className="btn-pill">Quick Action</button>
```

---

## Best Practices

### 1. Spacing
- Use `space-y-section` (32px) between major sections
- Use `gap-6` (24px) for grid layouts
- Use `space-y-3` or `space-y-4` within cards

### 2. Cards
- Always use `card` class for white backgrounds with border
- Add `card-hover` for interactive cards
- Use category-specific classes (`category-card-marketing`, etc.) for category cards

### 3. Colors
- Use category colors consistently across the app
- Marketing: Orange, Finance: Green, SAC: Red, etc.
- Use status colors for badges and indicators

### 4. Typography
- Page titles: `text-3xl font-bold text-gray-900`
- Section headers: `text-xl font-semibold text-gray-900`
- Card titles: `text-lg font-semibold text-gray-900`
- Body text: `text-base text-gray-600`
- Labels: `text-sm text-gray-600`

### 5. Grid Layouts
```jsx
// 3-column responsive grid (desktop)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// 2-column responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

// 4-column responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
```

### 6. Loading States
```jsx
import LoadingSpinner from '../components/common/LoadingSpinner';

if (isLoading) {
  return (
    <div className="flex items-center justify-center h-96">
      <LoadingSpinner size="lg" message="Loading..." />
    </div>
  );
}
```

---

## Migration Checklist

When updating a page to use the new design system:

- [ ] Replace page header with `PageHeader` component
- [ ] Add status badge if applicable
- [ ] Update section headers to use `SectionHeader` component
- [ ] Replace custom cards with `CategoryCard` or utility classes
- [ ] Update button styles to use design system classes
- [ ] Ensure consistent spacing with `space-y-section`
- [ ] Use appropriate grid layouts with `gap-6`
- [ ] Update colors to use category/status colors
- [ ] Test responsive behavior on mobile/tablet
- [ ] Verify loading and empty states

---

## Next Steps

1. **Marketing Page**: Apply design to Marketing analytics
2. **Finance Page**: Update financial dashboards
3. **Analytics Page**: Redesign cross-channel analytics
4. **Planning Page**: Update planning and forecast views
5. **Reports Page**: Standardize report layouts

---

## Support

For questions or suggestions about the design system:
- Reference: `src/pages/Dashboard.jsx` (fully implemented)
- Components: `src/components/common/`
- Styles: `tailwind.config.js` and `src/index.css`
