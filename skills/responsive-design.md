# Skill: Responsive Design

## When to Use

Use when implementing layouts, navigation headers, dashboards, grids, cards, and data tables.

## Important Conventions

- **Mobile-First Approach**: Design the default styles for small screens first, then progressively enhance using `sm:`, `md:`, `lg:`, `xl:`.
- **Navigation Adaptation**:
  - Desktop: Persistent left sidebar (`hidden md:flex`).
  - Mobile: Slide-over sheet drawer (`Sheet` with `SheetTrigger` visible on mobile `md:hidden`).
- **Flexible Grids**: Use responsive CSS grids (`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`) rather than fixed width elements.
- **Touch Targets**: Ensure touch targets are at least 44x44px on mobile devices.

## Things to Avoid

- Do NOT use fixed pixel widths (`w-[1200px]`) that cause horizontal scrolling on smaller viewports.
- Do NOT hide essential core functionality exclusively behind desktop-only views.
- Do NOT hardcode viewport assumptions; test responsive breakpoints across screen sizes.
