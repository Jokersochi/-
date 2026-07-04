## 2026-04-21 - Enhanced Room Design Upload Experience
**Learning:** In image-centric AI applications, providing an immediate preview of the uploaded file significantly reduces user uncertainty. Additionally, in dark-themed interfaces, standard focus rings can be hard to see; using `ring-offset-black` with a high-contrast ring color improves keyboard navigation visibility.
**Action:** Standardize the use of `URL.createObjectURL` (with proper cleanup) for all file uploads and apply `focus-visible:ring-offset-black` for interactive elements in dark mode.

## 2026-07-04 - Refined Image Selection and Accessible Actions
**Learning:** For a smooth 'remove and retry' file upload experience, use a `useRef` to programmatically clear the file input value; otherwise, re-selecting the same file won't trigger the `onChange` event. Combining `focus-visible:opacity-100` with `group-hover` ensures that secondary action buttons (like a 'Remove' icon on a preview) remain accessible to keyboard users while staying hidden for mouse users until needed.
**Action:** Always pair `group-hover:opacity-100` with `focus-visible:opacity-100` for hidden-on-hover actions, and use refs to manage file input states.
