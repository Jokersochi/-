## 2026-04-15 - Standardizing Form Accessibility and Loading States
**Learning:** Initial MVP components lacked semantic HTML associations (labels/inputs) and visual async feedback, which are critical for both accessibility and user confidence during long-running tasks like AI generation.
**Action:** Always associate labels via `htmlFor`/`id`, add `accept` attributes to file inputs, and use animated spinners (e.g., `Loader2`) for async states to provide clear visual affordance.
