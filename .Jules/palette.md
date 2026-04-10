## 2026-04-10 - Polishing Image Preview State
**Learning:** Adding a visual preview for file uploads significantly improves UX, but it requires careful state management. Forgetting to reset the HTML file input value prevents re-selecting the same file if it's removed, and failing to revoke object URLs can lead to memory leaks.
**Action:** Always pair `URL.createObjectURL` with `URL.revokeObjectURL` (using `useEffect` or manual cleanup) and use a `ref` to clear the file input when the user removes a selected file.
