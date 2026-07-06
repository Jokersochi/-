## 2026-04-21 - Enhanced Room Design Upload Experience
**Learning:** In image-centric AI applications, providing an immediate preview of the uploaded file significantly reduces user uncertainty. Additionally, in dark-themed interfaces, standard focus rings can be hard to see; using `ring-offset-black` with a high-contrast ring color improves keyboard navigation visibility.
**Action:** Standardize the use of `URL.createObjectURL` (with proper cleanup) for all file uploads and apply `focus-visible:ring-offset-black` for interactive elements in dark mode.

## 2026-04-23 - Interactive File Management and Integrated Feedback
**Learning:** Users expect fine-grained control over their uploads; providing a visible "Remove" action on previews improves trust. Furthermore, replacing browser `alert()` with in-page error states maintains immersion and accessibility, especially in full-screen AI applications. Using a React `ref` to reset the hidden file input is essential to allow re-uploading the same file after removal.
**Action:** Always include a "Remove" button on file previews and prefer state-based error messaging over native browser alerts.
