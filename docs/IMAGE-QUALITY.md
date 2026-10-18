# Image quality update

The supplied images were small crops from page mockups. Many were 190–300px wide; enlarging them to a full-width desktop hero exposed missing detail and sometimes fragments of the original page UI.

The fix replaces active image sources with 13 new, standalone assets in `public/images/hd`. Three panoramas are 1983×793; the other ten are 1672×941. Original files were retained. These are generated illustrations, not recovered original photographs or manufacturer documentation.

- `components/site-image.tsx` wraps Next Image and resolves legacy references to the detailed assets.
- `lib/image-assets.ts` owns the mapping for heroes, cards, category hubs, the guide library, reference charts, methodology and footer.
- Images retain responsive `sizes`; Next serves WebP at quality 85 with image-specific sizing.
- Extra zoom used to hide source-crop borders was removed. HTML remains separate from artwork.
- The final font pairing is local Inter (body/navigation), Sora (headings) and Rajdhani (statistics). Fonts are preloaded through `next/font/local`.
- The current local-font configuration reads the actual bundled WOFF2 files, rather than importing the unsupported Inter `/latin.css` entry.

Built-in image generation was used. The saved prompt set is in `docs/IMAGE-GENERATION.json`; final files are in `public/images/hd`. No CLI fallback or API key was used.

The later supplied `sprocket_geometry` and `torque_horsepower` images are 1280px wide and are used directly for their corresponding guide layouts. The resolver preserves these URLs; it does not substitute a generic replacement. The small geometry diagram is SVG so mathematical labels stay sharp.
