## 2025-05-14 - Standardizing Form Accessibility and Loading States
**Learning:** RoomGenius MVP components often lack semantic HTML label associations and keyboard focus-visible styles, which hinders accessibility. Providing visual feedback like loading spinners for async actions improves perceived performance.
**Action:** Always connect labels via 'htmlFor' and 'id', add 'accept' attributes to file inputs, and use 'Loader2' from lucide-react for async states.
