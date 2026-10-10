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

The default outline + inner details mode detects local contrast using smoothed, thinned edges, so internal facial features can become separate groups. Detail sensitivity controls contrast detection and Visible paths selects up to 26 chains. Silhouette-only mode retains threshold tracing. Open paths remain open; loops are marked ↻. Dot spacing controls distance along each path, so smaller features receive fewer dots. Features too short for two open-path dots or three closed-path dots stay as unnumbered linework. Larger dot sizes enforce extra spacing. This reduces within-path crowding; neighbouring paths and labels can still overlap. Try the built-in lion illustration to explore internal details. Photographs can still produce texture and fragmented paths; the detector does not understand which features are eyes or noses. Group selection is by path length; Use Trace a feature to place points over a source-image overlay and add open or closed contextual features manually. New manual features are prioritised; changing detection controls retraces automatic paths while preserving manual features. The overlay is excluded from export and print. There is no overlap slider yet. Distractors are experimental and may collide with labels. Number-label collision avoidance and adaptive corner sampling are future improvements. Uploaded image rights are the user's responsibility. Commons source links and attribution are retained in print and SVG metadata; check each source for licence conditions. SVG is a puzzle graphic; printed PDF includes the visible attribution.
