# RoomGenius AI - Architecture Documentation

## Overview

RoomGenius AI is built with a modular, scalable architecture that separates concerns and promotes code reusability.

## Core Principles

1. **Separation of Concerns**: Business logic is separated from presentation
2. **Single Responsibility**: Each module has one clear purpose
3. **DRY (Don't Repeat Yourself)**: Reusable components and utilities
4. **Error First**: Comprehensive error handling at every layer
5. **Type Safety**: Clear interfaces and validation

## Layer Architecture

### 1. Presentation Layer (Components)

**Location**: `/components/`

**Purpose**: Reusable UI components with no business logic

**Components**:
- `FileUpload.js` - File selection with validation feedback
- `StyleSelector.js` - Design style dropdown
- `GenerateButton.js` - Primary action button
- `LoadingSpinner.js` - Loading state indicator
- `ErrorMessage.js` - Error display with dismiss
- `ResultDisplay.js` - Generated image display

**Principles**:
- Pure presentational components
- Props-driven
- No direct API calls
- No state management beyond UI state

### 2. Business Logic Layer (Hooks)

**Location**: `/hooks/`

**Purpose**: Encapsulate complex state management and business rules

**Hooks**:
- `useImageGeneration.js` - Image upload and generation workflow
- `usePayment.js` - Payment processing workflow

**Responsibilities**:
- State management
- Orchestration of service calls
- Error handling
- User interaction logic

### 3. Service Layer

**Location**: `/services/`

**Purpose**: API interactions and data operations

**Services**:
- `storage.service.js` - Supabase storage operations
- `generation.service.js` - AI generation API calls
- `payment.service.js` - Payment processing

**Responsibilities**:
- HTTP requests
- Data transformation
- Service-specific error handling
- Retry logic (if needed)

### 4. Utility Layer

**Location**: `/utils/`

**Purpose**: Shared helper functions

**Modules**:
- `validation.js` - Input validation functions
- `errors.js` - Error handling utilities

**Responsibilities**:
- Pure functions
- No side effects
- Reusable across the application

### 5. Configuration Layer

**Location**: `/config/`

**Purpose**: Application-wide configuration

**Modules**:
- `constants.js` - App constants (styles, limits, messages)
- `env.js` - Environment variable management

**Responsibilities**:
- Centralized configuration
- Environment validation
- Type-safe config access

## Data Flow

```
User Interaction
    ↓
Component (Presentation Layer)
    ↓
Custom Hook (Business Logic Layer)
    ↓
Service (Service Layer)
    ↓
External API (Supabase, Replicate, Yookassa)
    ↓
Service (transforms response)
    ↓
Custom Hook (updates state)
    ↓
Component (renders new state)
```

## Error Handling Strategy

### 1. Custom Error Classes

```javascript
class AppError extends Error {
  constructor(message, statusCode, code) {
    // User-friendly errors with codes
  }
}
```

### 2. Error Flow

```
Error occurs in Service
    ↓
Service throws AppError
    ↓
Hook catches and logs error
    ↓
Hook updates error state
    ↓
Component displays ErrorMessage
```

### 3. Error Logging

```javascript
logError(error, context) {
  // Logs to console with context
  // Can be extended to send to monitoring service
}
```

## State Management

### Local State (useState)

Used for simple UI state:
- Input values
- Modal visibility
- Toggle states

### Custom Hooks

Used for complex state with business logic:
- Multi-step workflows
- API interactions
- Form validation

### No Global State

Currently no global state management (Redux, Zustand) as:
- App is small
- No shared state across routes
- Props drilling is minimal

**Future**: If app grows, consider:
- React Context for theme/auth
- Zustand for complex shared state

## API Route Architecture

### Structure

```
/pages/api/
├── generate.js    # AI generation endpoint
└── payment.js     # Payment creation endpoint
```

### Standard Response Format

**Success**:
```json
{
  "data": { ... },
  "timestamp": "2026-02-01T..."
}
```

**Error**:
```json
{
  "error": "User-friendly message",
  "code": "ERROR_CODE",
  "statusCode": 400
}
```

### Error Handling Pattern

```javascript
try {
  // Validation
  if (!input) throw new AppError('Invalid input', 400, 'INVALID_INPUT');
  
  // Business logic
  const result = await service.doSomething(input);
  
  // Success response
  res.status(200).json({ data: result });
} catch (error) {
  // Error logging
  logError(error, 'API endpoint name');
  
  // Error response
  const errorResponse = createErrorResponse(error);
  res.status(errorResponse.statusCode).json(errorResponse);
}
```

## File Upload Workflow

```
1. User selects file
    ↓
2. FileUpload validates file (type, size)
    ↓
3. useImageGeneration.handleFileSelect updates state
    ↓
4. User clicks "Generate"
    ↓
5. useImageGeneration.generate orchestrates:
    a. uploadFile (storage.service)
    b. generateDesign (generation.service)
    ↓
6. Result displayed in ResultDisplay component
```

## Payment Workflow

```
1. User views generated image
    ↓
2. User clicks "Pay"
    ↓
3. usePayment.initiatePayment calls payment.service
    ↓
4. payment.service calls /api/payment
    ↓
5. API creates payment with Yookassa
    ↓
6. User redirected to Yookassa payment page
    ↓
7. After payment, user redirected back to app
    ↓
8. Webhook confirms payment (future enhancement)
```

## Configuration Management

### Environment Variables

**Validation on Startup**:
```javascript
validateEnv(isServer) {
  // Checks all required vars exist
  // Throws error with missing var names
}
```

**Type-Safe Access**:
```javascript
import { env } from '../config/env';

const url = env.supabase.url; // Type-safe, validated
```

### Constants

**Centralized in `config/constants.js`**:
- Design styles
- File upload limits
- Error messages
- API endpoints
- Model configurations

**Benefits**:
- Single source of truth
- Easy to update
- No magic strings
- Autocomplete support

## Testing Strategy (Future)

### Unit Tests
- Utilities (`validation.js`, `errors.js`)
- Pure functions in services

### Integration Tests
- API routes
- Service layer

### Component Tests
- Component rendering
- User interactions
- Error states

### E2E Tests
- Complete workflows
- Payment flow
- Generation flow

## Performance Considerations

### Current Optimizations

1. **Image Loading**: `loading="lazy"` on generated images
2. **Code Splitting**: Next.js automatic code splitting
3. **Static Assets**: Tailwind CSS purging unused styles

### Future Optimizations

1. **Image Optimization**: 
   - Use Next.js Image component
   - WebP format
   - Responsive images

2. **Caching**:
   - API response caching
   - Generated image caching
   - CDN for static assets

3. **Loading States**:
   - Skeleton screens
   - Progressive image loading

## Security Considerations

### Input Validation

- File type checking
- File size limits
- URL validation
- Sanitization of filenames

### Error Messages

- No sensitive data in errors
- Generic messages to users
- Detailed logs server-side only

### Environment Variables

- Never exposed to client (except NEXT_PUBLIC_*)
- Validated on startup
- No defaults for sensitive values

### API Security

- Method validation
- Input validation
- Rate limiting (future)
- Authentication (future)

## Scalability Considerations

### Current Architecture Supports

1. **Adding New Features**:
   - Create new service
   - Create new hook
   - Create components
   - Minimal changes to existing code

2. **Adding New Styles**:
   - Add to `DESIGN_STYLES` constant
   - Add to `STYLE_PROMPTS` constant
   - No component changes needed

3. **Adding New Payment Methods**:
   - Create new service
   - Update `payment.service.js`
   - Minimal hook changes

### Future Considerations

1. **Database Layer**: 
   - Currently no database usage
   - Future: Store user preferences, history
   - Add `/models/` directory

2. **Authentication**:
   - Add auth service
   - Use Supabase Auth
   - Protect routes

3. **Multi-tenancy**:
   - User workspaces
   - Shared/private designs
   - Team collaboration

## Maintenance Guidelines

### Adding a New Feature

1. Define constants in `config/constants.js`
2. Create service in `services/`
3. Create hook in `hooks/`
4. Create components in `components/`
5. Update page to use new components
6. Add API route if needed
7. Update README

### Debugging

1. Check error logs (console)
2. Verify environment variables
3. Check network tab for API calls
4. Review service layer logs
5. Use React DevTools for state

### Code Style

- Use JSDoc comments
- Descriptive variable names
- Consistent file naming (camelCase.js)
- One component per file
- Export default for components

## Conclusion

This architecture provides:
- **Maintainability**: Clear separation of concerns
- **Scalability**: Easy to extend
- **Testability**: Isolated units
- **Developer Experience**: Clear patterns to follow
- **Performance**: Optimized for production