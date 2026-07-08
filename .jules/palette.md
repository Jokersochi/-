## 2026-04-21 - Enhanced Room Design Upload Experience
**Learning:** In image-centric AI applications, providing an immediate preview of the uploaded file significantly reduces user uncertainty. Additionally, in dark-themed interfaces, standard focus rings can be hard to see; using `ring-offset-black` with a high-contrast ring color improves keyboard navigation visibility.
**Action:** Standardize the use of `URL.createObjectURL` (with proper cleanup) for all file uploads and apply `focus-visible:ring-offset-black` for interactive elements in dark mode.

## 2026-05-15 - Improving File Upload Resilience
**Learning:** Users often select the wrong file and expect an easy way to clear it without a full page refresh. Standard HTML file inputs don't allow programmatic clearing easily without a ref. Providing a dedicated 'Remove' button that resets both the React state and the DOM input's value creates a much smoother correction loop.
**Action:** Always pair image previews with a visible (or hover-visible) remove action that synchronizes state and DOM via refs.
