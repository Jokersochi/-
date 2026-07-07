## 2026-04-21 - Enhanced Room Design Upload Experience
**Learning:** In image-centric AI applications, providing an immediate preview of the uploaded file significantly reduces user uncertainty. Additionally, in dark-themed interfaces, standard focus rings can be hard to see; using `ring-offset-black` with a high-contrast ring color improves keyboard navigation visibility.
**Action:** Standardize the use of `URL.createObjectURL` (with proper cleanup) for all file uploads and apply `focus-visible:ring-offset-black` for interactive elements in dark mode.

## 2026-07-07 - Streamlined Upload and Result Management
**Learning:** In highly interactive image tools, providing a way to 'undo' or 'clear' a selection without reloading the page is critical. Reusing a `useRef` to reset the file input's internal state prevents 'selection deadlocks' where the user cannot re-select the same file after manual removal.
**Action:** Always provide a 'Remove' button for uploaded previews and use `fileInputRef.current.value = ''` to ensure consistent `onChange` firing.
