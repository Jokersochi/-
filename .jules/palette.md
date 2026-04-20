## 2026-04-21 - Enhanced Room Design Upload Experience
**Learning:** In image-centric AI applications, providing an immediate preview of the uploaded file significantly reduces user uncertainty. Additionally, in dark-themed interfaces, standard focus rings can be hard to see; using `ring-offset-black` with a high-contrast ring color improves keyboard navigation visibility.
**Action:** Standardize the use of `URL.createObjectURL` (with proper cleanup) for all file uploads and apply `focus-visible:ring-offset-black` for interactive elements in dark mode.
