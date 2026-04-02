## 2025-05-15 - Form Accessibility Pattern
**Learning:** Found that the initial MVP implementation lacked connection between `<label>` elements and their respective inputs/selects, which hinders screen reader usability and reduces the clickable area for users.
**Action:** Always use `htmlFor` on labels and matching `id` on inputs. Pair this with specific `accept` attributes for file inputs to guide user selection.
