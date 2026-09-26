# UI & Design Conventions

## Visual Philosophy

- **Modern & Professional**: Clean surfaces, subtle 1px borders (`border-border`), and balanced whitespace.
- **Fast & Responsive**: Mobile-first architecture with persistent desktop layouts and responsive mobile drawer navigation.
- **Minimal Animation**: Animations should only be added when they improve UX feedback (e.g., active state transitions, dropdown fades). Avoid gratuitous continuous animations.
- **Theme Support**: Seamless light and dark mode powered by `next-themes` and OKLCH color tokens in `src/app/globals.css`.

## Design Pattern Influences

- **21st.dev**: High-polish components with subtle card borders and clean contrast.
- **Emil Design & Ponytail**: Functional minimalism, typography-first hierarchy, and high information clarity.
- **React Bits**: Used sparingly and intentionally for high-impact micro-interactions.

## Component Conventions

- All reusable base UI components reside in `src/components/ui/`.
- Styling uses `cn(...)` from `@/lib/utils` to merge Tailwind classes with `tailwind-merge`.
- Use the `render` prop on Base UI components or `buttonVariants({ ... })` on Next.js `<Link>` elements.
