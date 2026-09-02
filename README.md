# Hindi InScript Trainer

A focused, browser-based typing trainer for Hindi Devanagari using the BIS InScript keyboard. It runs entirely in the browser and does not send typing data anywhere.

## What it includes

- A complete physical InScript keyboard preview for ANSI and ISO hardware, including Shift legends, home-row markers, and finger assignments.
- Built-in key handling: press a physical key and the trainer writes the matching InScript character, so an operating-system keyboard switch is not required for practice.
- Unicode-aware comparison at grapheme boundaries. Matras, nukta, halant, ZWJ/ZWNJ and conjuncts such as `क्ष` are treated as one typing unit.
- Progressive lessons for the home row, vowels, consonants, matras, conjuncts, frequent words, and sentences.
- Adaptive follow-up practice for characters missed in the previous attempt.
- Live WPM, accuracy, key error heatmap, finger-error summary, and locally stored personal bests.

## Run locally

```bash
pnpm install
pnpm dev
```

Use `pnpm test` for the Unicode and layout regression suite, and `pnpm build` to make the production bundle.

## Deployment

Pushing to `main` runs the GitHub Actions workflow. It tests and builds the app, then deploys the build to GitHub Pages. The live site is available at:

<https://raaviexit.github.io/hindi-inscript-keybr/>

The Vite base is relative so the same artifact also works in local previews and a repository Pages site.
