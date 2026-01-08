# Social Login Hooks

Hooks for Google and Apple social authentication.

---

## useSocialLogin

General social login functionality wrapper.

### Strategy

**Purpose**: Provides unified interface for Google and Apple social authentication by wrapping `@umituz/react-native-firebase`'s `useSocialAuth`.

**When to Use**:
- Need both Google and Apple auth
- Want unified social auth interface
- Prefer single hook for multiple providers
- Don't need provider-specific features

**Import Path**:
```typescript
import { useSocialLogin } from '@umituz/react-native-auth';
```

**Hook Location**: `src/presentation/hooks/useSocialLogin.ts`

**Dependency**: `@umituz/react-native-firebase`

### Rules

**MUST**:
- Configure provider settings before use
- Check provider availability before showing buttons
- Handle loading states appropriately
- Display errors to users
- Check `googleConfigured` before using Google
- Check `appleAvailable` before using Apple

**MUST NOT**:
- Show unavailable provider buttons
- Assume provider is configured
- Ignore loading states
- Bypass error handling

### Constraints

**CONFIGURATION PARAMETERS**:
- `google?: GoogleAuthConfig` - Google client IDs
- `apple?: { enabled: boolean }` - Apple enable flag

**RETURN VALUES**:
- `signInWithGoogle: () => Promise<SocialAuthResult>` - Google sign-in
- `signInWithApple: () => Promise<SocialAuthResult>` - Apple sign-in
- `googleLoading: boolean` - Google loading state
- `appleLoading: boolean` - Apple loading state
- `googleConfigured: boolean` - Google configuration status
- `appleAvailable: boolean` - Apple availability status

**PLATFORM LIMITATIONS**:
- Google: All platforms
- Apple: iOS only (returns `appleAvailable: false` on other platforms)

---

## useGoogleAuth

Google OAuth authentication with expo-auth-session.

### Strategy

**Purpose**: Complete Google OAuth flow using expo-auth-session for cross-platform support.

**When to Use**:
- Need Google OAuth specifically
- Want full OAuth flow (not just Firebase)
- Need web/expo support
- Require custom Google configuration

**Import Path**:
```typescript
import { useGoogleAuth } from '@umituz/react-native-auth';
```

**Hook Location**: `src/presentation/hooks/useSocialLogin.ts`

**Dependencies**:
- `expo-auth-session`
- `expo-web-browser`
- `@react-native-firebase/auth`

### Rules

**MUST**:
- Provide at least one client ID
- Call `WebBrowser.maybeCompleteAuthSession()` in app root
- Check `googleConfigured` before showing button
- Handle loading and error states
- Support platform-specific client IDs

**MUST NOT**:
- Call without client ID configuration
- Skip web browser setup
- Ignore platform differences
- Show button if not configured

### Constraints

**CLIENT IDs REQUIRED**:
- `iosClientId?: string` - iOS client ID (optional)
- `webClientId?: string` - Web client ID (optional)
- `androidClientId?: string` - Android client ID (optional)
- At least one MUST be provided

**RETURN VALUES**:
- `signInWithGoogle: () => Promise<SocialAuthResult>` - Sign-in function
- `googleLoading: boolean` - Loading state
- `googleConfigured: boolean` - Configuration status

**PLATFORM BEHAVIOR**:
- iOS: Uses `iosClientId` or falls back to `webClientId`
- Android: Uses `androidClientId` or falls back to `webClientId`
- Web: Uses `webClientId`
- Requires OAuth 2.0 client ID from Google Cloud Console

**SETUP REQUIREMENTS**:
- OAuth 2.0 Client ID from Google Cloud Console
- Authorized redirect URI (auto-configured by expo)
- Web browser warm-up (maybeCompleteAuthSession)

---

## useAppleAuth

Apple Sign-In authentication wrapper.

### Strategy

**Purpose**: Convenience wrapper for Apple Sign-In functionality on iOS.

**When to Use**:
- Need Apple Sign-In specifically
- Targeting iOS users
- Want simple Apple auth integration
- Don't need custom Apple configuration

**Import Path**:
```typescript
import { useAppleAuth } from '@umituz/react-native-auth';
```

**Hook Location**: `src/presentation/hooks/useSocialLogin.ts`

**Dependencies**:
- `expo-apple-authentication`
- `@react-native-firebase/auth`

### Rules

**MUST**:
- Check `appleAvailable` before showing button
- Handle loading and error states
- Only show on iOS platform
- Support Apple Sign-In requirements

**MUST NOT**:
- Show Apple button on Android/Web
- Call without availability check
- Ignore Apple's guidelines
- Require Apple auth for all users

### Constraints

**RETURN VALUES**:
- `signInWithApple: () => Promise<SocialAuthResult>` - Sign-in function
- `appleLoading: boolean` - Loading state
- `appleAvailable: boolean` - iOS availability status

**PLATFORM SUPPORT**:
- iOS: ✅ Fully supported (if configured)
- Android: ❌ Not supported (appleAvailable = false)
- Web: ❌ Not supported (appleAvailable = false)

**SETUP REQUIREMENTS**:
- Apple Developer account
- App ID with Sign In with Apple enabled
- Firebase Auth with Apple enabled
- Physical device (may not work in simulator)

**APPLE GUIDELINES**:
- Must offer alternative auth methods
- Cannot require Apple as only option
- Must follow Apple's UI guidelines
- Button design per Apple specifications

---

## SocialAuthResult

Common return type for all social auth functions.

### Structure

**PROPERTIES**:
- `success: boolean` - Operation success status
- `error?: string` - Error message if failed
- `user?: AuthUser` - User object if successful

**Rules**:
- MUST check `success` before using `user`
- MUST handle `error` if `success = false`
- MUST NOT assume `user` exists without checking

**Constraints**:
- Always returns success boolean
- User object only present on success
- Error string only present on failure
- Used by all social auth functions

---

## Configuration Strategy

### Strategy

**Purpose**: Proper setup and configuration for social authentication.

**Rules**:
- MUST configure OAuth providers in Firebase Console
- MUST set up projects in provider consoles
- MUST provide correct client IDs
- MUST test on physical devices

**MUST NOT**:
- Use development client IDs in production
- Skip provider console setup
- Assume configuration is correct
- Test only on simulator

### Constraints

**FIREBASE SETUP**:
- Enable Google Sign-In in Firebase Auth
- Enable Apple Sign-In in Firebase Auth
- Configure OAuth consent screen
- Set up authorized domains

**GOOGLE CONSOLE SETUP**:
1. Go to Google Cloud Console
2. Create OAuth 2.0 Client IDs
3. Add authorized redirect URIs
4. Copy client IDs to app config

**APPLE SETUP**:
1. Apple Developer account
2. Enable Sign In with Apple for App ID
3. Create provider ID in Firebase
4. Configure certificates

---

## Error Handling

### Strategy

**Purpose**: Graceful handling of social authentication failures.

**Rules**:
- MUST distinguish cancellation from errors
- MUST show user-friendly error messages
- MUST allow retry after failures
- MUST not crash on auth failures

**MUST NOT**:
- Show raw OAuth errors
- Block retry indefinitely
- Crash on provider errors
- Expose sensitive tokens in errors

### Constraints

**ERROR TYPES**:
- User cancellation: Silent handling
- Network errors: Retry prompt
- Configuration errors: Developer message
- Provider errors: Generic "try again"

**CANCELLATION HANDLING**:
- Check error message for "cancelled"
- Don't show error for cancellation
- Allow retry without blocking
- Silent return preferred

---

## Security Requirements

### Strategy

**Purpose**: Secure social authentication implementation.

**Rules**:
- MUST use HTTPS for all OAuth endpoints
- MUST store tokens securely
- MUST validate tokens server-side
- MUST never log OAuth credentials
- MUST implement token refresh

**MUST NOT**:
- Store tokens in AsyncStorage
- Log OAuth responses
- Skip server-side validation
- Expose client secrets
- Use HTTP for OAuth flows

### Constraints

**TOKEN HANDLING**:
- Tokens managed by Firebase SDK
- Secure storage automatic
- App never accesses refresh tokens
- ID tokens available for API calls
- Token refresh handled by Firebase

**CLIENT SECRETS**:
- Never included in app code
- Public client flows only
- Server-side validation required
- Firebase manages credentials

---

## Platform-Specific Behavior

### Strategy

**Purpose**: Optimize social auth experience for each platform.

**Rules**:
- MUST respect platform limitations
- MUST use appropriate client IDs
- MUST handle platform-specific errors
- MUST test on target platforms

**Constraints**:

**iOS**:
- Apple Sign-In available
- Google uses app-based OAuth
- Requires Info.plist configuration
- Best on physical devices

**Android**:
- Apple Sign-In NOT available
- Google uses app-based OAuth
- Requires google-services.json
- Works on emulator

**Web**:
- Apple Sign-In NOT available
- Google uses popup OAuth
- Requires proper callback handling
- Browser popup blockers

---

## Related Hooks

- **`useAuth`** (`src/presentation/hooks/useAuth.ts`) - Core authentication state
- **`useAuthBottomSheet`** (`src/presentation/hooks/useAuthBottomSheet.md`) - Auth modal integration

## Related Components

- **`SocialLoginButtons`** (`src/presentation/components/SocialLoginButtons.md`) - Social auth UI

## External Dependencies

- **`@umituz/react-native-firebase`** - Firebase social auth wrapper
- **`expo-auth-session`** - OAuth session management
- **`expo-web-browser`** - Web browser for OAuth
- **`expo-apple-authentication`** - Apple Sign-In
