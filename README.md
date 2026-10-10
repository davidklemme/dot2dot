# Dot garden

A Next.js + TypeScript dot-to-dot maker. Runs image conversion locally in the browser; no accounts, API keys, or paid AI service required.

## Develop

Requires Node.js 20.9+.

```sh
npm ci
npm run dev
```

Upload a high-contrast silhouette or search Wikimedia Commons. Adjust threshold, group count, dot size and counting rules. Click unwanted groups to hide them. Print using the browser's Save as PDF option or export SVG. Search requires access to commons.wikimedia.org and image loading to upload.wikimedia.org; uploaded files stay in the browser.

```sh
npm test
npm run typecheck
npm run build
npm start
```

## Deploy

Import this repository into Vercel; the default Next.js build settings work. Check current Hobby plan eligibility and limits before publishing commercially. No environment variables are needed.

## Current limitations

Threshold tracing works best with silhouettes, not photographs. Line art can produce both sides of a stroke as separate contours. Group selection is by contour length; crossing contours are preserved, but there is no manual path editor or overlap slider yet. Distractors are experimental and may collide with labels. Number-label collision avoidance and adaptive corner sampling are future improvements. Uploaded image rights are the user's responsibility. Commons source links and attribution are retained in print and SVG metadata; check each source for licence conditions. SVG is a puzzle graphic; printed PDF includes the visible attribution.
