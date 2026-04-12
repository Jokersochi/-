## 2026-04-12 - File Upload Preview and Accessibility
**Learning:** Adding a preview for file uploads combined with an explicit "remove" action significantly reduces user uncertainty during asynchronous flows. Connecting labels via `htmlFor` and providing `focus-visible` styles ensures the application remains usable for keyboard and screen reader users.
**Action:** Always implement a preview and cleanup logic (using `URL.revokeObjectURL`) when handling file inputs to provide immediate visual feedback.
