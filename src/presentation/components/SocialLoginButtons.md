# SocialLoginButtons

Component that displays Google and Apple social authentication buttons.

---

## Component Overview

### Strategy

**Purpose**: Provides pre-built social authentication buttons for Google and Apple with consistent styling, loading states, and platform-specific behavior.

**When to Use**:
- Adding social login options to authentication screens
- Need quick integration with OAuth providers
- Want consistent social login UI across app
- Supporting multiple social providers

**Import Path**:
```typescript
import { SocialLoginButtons } from '@umituz/react-native-auth';
```

**Component Location**: `src/presentation/components/SocialLoginButtons.tsx`

---

## Provider Configuration

### Strategy

**Purpose**: Configure which social providers to display based on platform and availability.

**Supported Providers**:
- `google` - Google OAuth (all platforms)
- `apple` - Apple Sign In (iOS only)

### Rules

**MUST**:
- Pass `enabledProviders` array with provider names
- Check provider availability before enabling
- Provide press handlers for enabled providers
- Respect platform restrictions (Apple = iOS only)

**MUST NOT**:
- Enable Apple on Android or Web
- Show provider buttons without press handlers
- Assume provider is available without checking

### Constraints

**PLATFORM AVAILABILITY**:
| Provider | iOS | Android | Web |
|----------|-----|---------|-----|
| Google   | ✅  | ✅      | ✅  |
| Apple    | ✅  | ❌      | ❌  |

**PROVIDER DETECTION**:
- Use `useGoogleAuth` hook to check Google availability
- Use `useAppleAuth` hook to check Apple availability
- Filter enabled providers array based on availability

**CONFIGURATION REQUIREMENTS**:
- Google: Requires client ID configuration
- Apple: Requires Apple Developer account
- Both: Requires Firebase project setup

---

## Button State Management

### Strategy

**Purpose**: Provide visual feedback for loading, disabled, and error states.

### Rules

**MUST**:
- Show loading indicator during OAuth flow
- Disable buttons during authentication
- Re-enable buttons after completion (success or error)
- Handle user cancellation gracefully

**MUST NOT**:
- Leave buttons in loading state indefinitely
- Allow multiple simultaneous OAuth requests
- Show loading without active OAuth flow

### Constraints

**LOADING STATES**:
- `googleLoading` - Show Google button in loading state
- `appleLoading` - Show Apple button in loading state
- Loading overrides disabled state visually

**DISABLED STATES**:
- Global disabled: All buttons disabled
- Per-button loading: Only that button disabled
- Parent form disabled: All social buttons disabled

**ERROR RECOVERY**:
- Auto-recover after cancellation
- Manual retry required after errors
- No retry limit (user can try indefinitely)

---

## Platform-Specific Behavior

### Strategy

**Purpose**: Optimize social login experience for each platform's conventions.

### Rules

**MUST**:
- Hide Apple button on non-iOS platforms
- Use platform-appropriate button styles
- Follow platform OAuth flow conventions
- Respect platform-specific limitations

**MUST NOT**:
- Show Apple button on Android
- Force web OAuth flow on native platforms
- Bypass platform security features

### Constraints

**iOS BEHAVIOR**:
- Apple Sign-In uses native credential UI
- Google uses app-based OAuth when available
- Falls back to web OAuth if needed
- Requires Info.plist configuration

**ANDROID BEHAVIOR**:
- Google uses app-based OAuth
- Apple button hidden
- Requires Firebase configuration
- Requires Google Services JSON

**WEB BEHAVIOR**:
- Both providers use popup/redirect OAuth
- Requires proper callback handling
- Requires auth session setup
- Browser popup blockers may interfere

---

## Error Handling

### Strategy

**Purpose**: Gracefully handle OAuth errors without breaking user experience.

### Rules

**MUST**:
- Distinguish between user cancellation and errors
- Show user-friendly error messages
- Allow retry after errors
- Log errors for debugging (not to user)

**MUST NOT**:
- Show raw OAuth errors to users
- Block retry after errors
- Crash or hang on OAuth failure
- Expose sensitive tokens in errors

### Constraints

**ERROR TYPES**:
- User cancellation: Silent or gentle notification
- Network error: Retry prompt
- Configuration error: Developer-focused message
- Provider error: Generic "try again" message

**ERROR DISPLAY**:
- Alert/Modal for critical errors
- Inline text for non-critical errors
- Toast for success/cancellation
- Console logging for debugging

---

## Security Requirements

### Strategy

**Purpose**: Ensure OAuth authentication follows security best practices.

### Rules

**MUST**:
- Use HTTPS for all OAuth endpoints
- Store tokens securely (Keychain/Keystore)
- Never log tokens or credentials
- Validate tokens server-side
- Implement token refresh logic

**MUST NOT**:
- Store tokens in AsyncStorage/localStorage
- Log OAuth responses with tokens
- Skip server-side token validation
- Use HTTP for OAuth flows
- Expose client secrets in app code

### Constraints

**TOKEN HANDLING**:
- Tokens managed by Firebase SDK
- App never directly accesses refresh tokens
- ID tokens accessible for API calls
- Secure storage handled automatically

**CLIENT SECRETS**:
- Never include client secrets in app
- Use public client flows
- Server-side validation required
- Firebase manages OAuth credentials

---

## Localization

### Strategy

**Purpose**: Support international users with localized button text and messages.

### Rules

**MUST**:
- Use localization keys for all text
- Provide translations for supported languages
- Respect user's language preference
- Format error messages appropriately

**MUST NOT**:
- Hardcode English text
- Assume user speaks English
- Mix languages in UI

### Constraints

**LOCALIZATION KEYS**:
```
auth.orContinueWith
auth.google
auth.apple
auth.signingIn
```

**SUPPORTED LANGUAGES**:
- English (default)
- Turkish
- Add more via i18n configuration

---

## Design System Integration

### Strategy

**Purpose**: Consistent styling with application design system.

### Rules

**MUST**:
- Use design system color tokens
- Follow design system spacing
- Match design system button styles
- Use design system icons/logos

**MUST NOT**:
- Hardcode colors or sizes
- Use unofficial provider logos
- Override design system styles

### Constraints

**STYLE TOKENS**:
- Button colors: Design system primary
- Text colors: Design system text tokens
- Spacing: Design system spacing scale
- Border radius: Design system radius tokens

**PROVIDER BRANDING**:
- Use official Google/Apple logos
- Follow provider brand guidelines
- Maintain minimum logo sizes
- Don't modify logo colors

---

## Analytics Integration

### Strategy

**Purpose**: Track social login usage for analytics and optimization.

### Rules

**MUST**:
- Track login attempts per provider
- Track successful logins
- Track failures (without sensitive data)
- Track cancellation rates

**MUST NOT**:
- Log personally identifiable information
- Log OAuth tokens or credentials
- Track before user consents
- Expose raw analytics data to users

### Constraints

**EVENTS TO TRACK**:
- `social_login_attempt` (provider, platform)
- `social_login_success` (provider, platform)
- `social_login_failed` (provider, error_category)
- `social_login_cancelled` (provider, platform)

**PRIVACY**:
- No user data in events
- No session identifiers in events
- Aggregate data only
- GDPR/CCPA compliant

---

## Related Components

- **`LoginForm`** (`src/presentation/components/LoginForm.tsx`) - Email/password form
- **`RegisterForm`** (`src/presentation/components/RegisterForm.tsx`) - Registration form

## Related Hooks

- **`useGoogleAuth`** (`src/presentation/hooks/useSocialLogin.ts`) - Google authentication
- **`useAppleAuth`** (`src/presentation/hooks/useSocialLogin.ts`) - Apple authentication
- **`useSocialLogin`** (`src/presentation/hooks/useSocialLogin.ts`) - Combined social auth
