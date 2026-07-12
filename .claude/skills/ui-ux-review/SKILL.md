---
name: ui-ux-review
description: Use this skill when reviewing or auditing UI/UX quality of screens or components — contrast, layout/responsiveness, and accessibility. Triggers on requests like "revisa el UI/UX", "audita accesibilidad", "checklist de diseño", or before shipping visual/frontend changes.
---

# UI/UX Review Checklist

Run through this checklist against the relevant screens/components. Report each item as pass/fail/n-a with a one-line reason. Don't infer from a single theme or viewport — actually check both.

## Contrast & Theming
- [ ] Primary text contrast >=4.5:1 in both light and dark mode
- [ ] Secondary text contrast >=3:1 in both light and dark mode
- [ ] Dividers/borders and interaction states are distinguishable in both modes
- [ ] Modal/drawer scrim opacity is strong enough to preserve foreground legibility (typically 40-60% black)
- [ ] Both themes are tested before delivery (not inferred from a single theme)

## Layout
- [ ] Safe areas are respected for headers, tab bars, and bottom CTA bars
- [ ] Scroll content is not hidden behind fixed/sticky bars
- [ ] Verified on small phone, large phone, and tablet (portrait + landscape)
- [ ] Horizontal insets/gutters adapt correctly by device size and orientation
- [ ] 4/8dp spacing rhythm is maintained across component, section, and page levels
- [ ] Long-form text measure remains readable on larger devices (no edge-to-edge paragraphs)

## Accessibility
- [ ] All meaningful images/icons have accessibility labels
- [ ] Form fields have labels, hints, and clear error messages
- [ ] Color is not the only indicator
- [ ] Reduced motion and dynamic text size are supported without layout breakage
- [ ] Accessibility traits/roles/states (selected, disabled, expanded) are announced correctly

## Notes for web (non-native) contexts
- "Safe areas" / "tab bars" map to sticky headers, footers, and floating CTAs (e.g. the floating WhatsApp button).
- "dp spacing rhythm" maps to a consistent Tailwind/CSS spacing scale (4px/8px multiples).
- "Accessibility traits/roles/states" map to ARIA attributes (`aria-expanded`, `aria-selected`, `aria-disabled`, `role`) and semantic HTML.
