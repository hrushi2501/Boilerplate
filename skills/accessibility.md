# Skill: Accessibility (a11y)

## When to Use

Use when implementing interactive components, forms, navigation menus, modals, dialogs, and icons.

## Important Conventions

- **Accessible Primitives**: Use Base UI / Radix primitives under shadcn/ui which provide keyboard navigation, focus management, and ARIA attributes out of the box.
- **Labels & Descriptions**: Always provide `aria-label` or accessible text on icon-only buttons (`<span className="sr-only">Toggle theme</span>`).
- **Form Controls**: Associate inputs with descriptive `<label>` elements and display validation errors using `aria-invalid` and `aria-describedby`.
- **Keyboard Navigation**: Ensure all interactive elements can be focused and activated via keyboard (`Tab`, `Enter`, `Space`, `Escape`).

## Things to Avoid

- Do NOT use non-interactive elements (`div`, `span`) with `onClick` without appropriate ARIA roles, tabindex, and keyboard event handlers.
- Do NOT suppress focus rings entirely (`outline-none`) without providing an equivalent visible focus ring (`focus-visible:ring-2`).
- Do NOT use color as the sole indicator of system state or validation errors.
