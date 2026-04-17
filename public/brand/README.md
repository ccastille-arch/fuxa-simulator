# /public/brand — Drop-in asset directory

These are the filenames the app expects for the Service Compression brand
layer. Replace each placeholder with the authoritative SVG from Slant (or
exported from `servicecompression.com`) — no code changes required.

| File | Used by | Status |
|---|---|---|
| `service-compression-logo.svg` | `SCLogo` (header, footer) when `useImage` is set | Placeholder — substitute real SVG from Slant |
| `field_tune-logo.svg`          | `SCLogo variant="fieldtune"` when `useImage` is set | Placeholder |
| `sc-pattern-red.svg`           | `.sc-pattern-red::before` + `bg-sc-red-pattern` utility | Placeholder (functional fallback gradient in CSS) |
| `favicon.ico` (or `icon.png`)  | `layout.tsx` metadata | TODO |

## How to enable the real logos

Once Slant ships the SVGs (trademarked assets — do **not** fabricate a
replacement), drop them in at the paths above and flip the `useImage` prop
on `SCLogo` at the header/footer call sites:

```tsx
<SCLogo href="/" tone="light" useImage />
```

## Why placeholders live here

The current code ships a typographic wordmark + bolt glyph that communicates
SC's visual language without reproducing the trademarked `Sc` vessel mark
seen on customer skids. This keeps the build shippable for internal review
while the real artwork is procured.
