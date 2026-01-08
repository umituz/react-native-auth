# Auth Screens

Pre-built screen components for authentication flows.

---

## Strategy

**Purpose**: Provides complete authentication screens ready to use in navigation.

**When to Use**:
- Need complete auth screens
- Want consistent auth UI
- Rapid development
- Standard auth flows

**Location**: `src/presentation/screens/`

---

## Available Screens

### LoginScreen

**Purpose**: Complete login screen with form and social options

**When to Use**:
- App login entry point
- Need login screen
- Want pre-built solution

**Import Path**:
```typescript
import { LoginScreen } from '@umituz/react-native-auth';
```

**File**: `LoginScreen.tsx`

**Rules**:
- MUST configure navigation
- MUST handle auth callbacks
- MUST integrate with app navigation
- MUST NOT bypass AuthProvider

---

### RegisterScreen

**Purpose**: Complete registration screen with validation

**When to Use**:
- User registration flow
- Account creation
- Need pre-built solution

**Import Path**:
```typescript
import { RegisterScreen } from '@umituz/react-native-auth';
```

**File**: `RegisterScreen.tsx`

**Rules**:
- MUST configure navigation
- MUST provide legal links
- MUST handle registration success
- MUST NOT bypass AuthProvider

---

### AccountScreen

**Purpose**: Account settings and profile management

**When to Use**:
- Account settings page
- Profile management
- Account operations

**Import Path**:
```typescript
import { AccountScreen } from '@umituz/react-native-auth';
```

**File**: `AccountScreen.tsx`

**Configuration**:
- Can customize with config prop
- Show/hide features
- Add custom actions

**Rules**:
- MUST only show to authenticated users
- MUST handle anonymous users separately
- MUST configure properly

---

### EditProfileScreen

**Purpose**: Profile editing screen

**When to Use**:
- Profile editing
- User settings
- Profile photo update

**Import Path**:
```typescript
import { EditProfileScreen } from '@umituz/react-native-auth';
```

**File**: `EditProfileScreen.tsx`

**Configuration**:
- Show/hide avatar editing
- Allow/disallow email change
- Custom validation rules

**Rules**:
- MUST validate before saving
- MUST handle photo uploads
- MUST show errors appropriately

---

## Navigation Integration

### Navigation Setup

**RULES**:
- MUST wrap with NavigationContainer
- MUST use proper stack navigator
- MUST set screen options
- MUST handle navigation callbacks

**SCREEN OPTIONS**:
- `headerShown: false` - Hide default header
- `gestureEnabled: false` - Disable gestures (optional)
- Custom header components

---

## Configuration

### Screen Configuration

**ACCOUNT SCREEN**:
- `showChangePassword` - Show password change option
- `benefits` - List of account benefits
- Custom actions

**EDIT PROFILE SCREEN**:
- `showAvatar` - Enable avatar editing
- `allowEmailChange` - Allow email modification
- `maxDisplayNameLength` - Validation limit

**Rules**:
- MUST pass valid config
- MUST handle config changes
- MUST not pass invalid options

---

## Best Practices

### Screen Composition

**RULES**:
- SHOULD use pre-built screens when possible
- MUST configure screens properly
- MUST handle navigation state
- MUST integrate with AuthProvider

**MUST NOT**:
- Bypass AuthProvider
- Break navigation flow
- Ignore configuration options

---

### Error Handling

**RULES**:
- MUST handle auth errors in screens
- MUST show user-friendly messages
- MUST allow user retry
- MUST not crash on errors

---

## Related Documentation

- **Components**: `../components/README.md`
- **Hooks**: `../hooks/README.md`
- **Services**: `../../infrastructure/services/README.md`
