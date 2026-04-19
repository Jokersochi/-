## 2026-04-19 - Standardizing Form Accessibility and Visual Feedback
**Learning:** MVP components often lack basic semantic associations (label htmlFor/id) and visual async feedback, which are critical for both accessibility and user confidence. Image previews for file uploads significantly improve the "predictability" of the interface.
**Action:** Always associate labels with inputs using htmlFor/id, add 'accept' attributes to file inputs to guide users, and provide immediate visual feedback (like spinners and previews) for all user-initiated async actions.
