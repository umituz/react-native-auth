# React Native Auth Skills

This directory contains Claude Code skills for `@umituz/react-native-auth`.

## Available Skills

### setup-react-native-auth

Automated setup and integration for `@umituz/react-native-auth` with complete authentication configuration.

**What it does:**
- Installs or updates the auth package
- Configures AuthProvider
- Sets up Firebase authentication
- Enables social auth (Apple, Google)
- Creates login/register screens
- Adds auth guards for protected routes
- Handles native setup (iOS capabilities)

**Authentication Methods:**
- ✅ Email/password authentication
- ✅ Anonymous authentication
- ✅ Apple Sign-In (iOS)
- ✅ Google Sign-In (iOS/Android)
- ✅ Authentication state persistence
- ✅ Protected route guards

## Installation

### Option 1: Install from Local Path

```bash
npx skills add /Users/umituz/Desktop/github/umituz/apps/mobile/npm-packages/react-native-auth/skills/SKILL.md
```

### Option 2: Install Globally (Recommended)

```bash
npx skills add /Users/umituz/Desktop/github/umituz/apps/mobile/npm-packages/react-native-auth/skills/SKILL.md -g
```

### Option 3: Manual Installation

```bash
mkdir -p ~/.claude/skills/setup-react-native-auth
cp /Users/umituz/Desktop/github/umituz/apps/mobile/npm-packages/react-native-auth/skills/SKILL.md ~/.claude/skills/setup-react-native-auth/
```

## Usage

Once installed, the skill triggers automatically when you ask Claude Code to:

- Setup authentication in my app
- Initialize auth
- Configure authentication
- Install auth package
- Setup login screen
- Add social auth (Apple/Google)

**Example prompts:**

```text
Setup authentication in my React Native app
```

```text
Initialize auth with Apple Sign-In and Google Sign-In
```

```text
Install and configure @umituz/react-native-auth with login screens
```

```text
Add auth guards to my protected routes
```

## Skill Structure

This skill follows the [app-store-screenshots](https://github.com/ParthJadhav/app-store-screenshots) pattern:

```
skills/
└── SKILL.md    # Main skill instructions with YAML frontmatter
```

The `SKILL.md` file contains:

1. **YAML Frontmatter** - Metadata and trigger keywords
   - `name`: Unique identifier
   - `description`: When to use it + "Triggers on:" keywords

2. **Markdown Content** - Step-by-step instructions for the AI agent
   - Overview and Quick Start
   - When to Use section
   - 9 setup steps (analyze → install → configure → verify)
   - Complete code examples
   - Social auth setup (Apple, Google)
   - Auth guard patterns
   - Verification checklist
   - Common mistakes table
   - Troubleshooting guide

## What Gets Setup

### 1. Package Installation

Automatically installs:
- `@umituz/react-native-auth`
- `@umituz/react-native-firebase` (required)
- `@umituz/react-native-design-system`
- `zustand` (state management)
- `@tanstack/react-query`
- `firebase`

Plus Expo auth modules:
- `expo-apple-authentication`
- `expo-auth-session`
- `expo-web-browser`
- `expo-crypto`

### 2. Provider Configuration

Wraps your app with `AuthProvider`:

```typescript
<AuthProvider>
  <RootNavigation />
</AuthProvider>
```

### 3. Authentication Screens

Creates complete screens:
- Login screen (email/password)
- Register screen with password confirmation
- Social auth buttons (Apple, Google)

### 4. Auth Guards

Protects routes with authentication checks:

```typescript
const { user, isLoading } = useAuth();

if (!user && !isLoading) {
  router.replace('/login');
}
```

### 5. Social Auth

Configures:
- Apple Sign-In (iOS)
- Google Sign-In (iOS/Android)
- Firebase provider setup

## Available Hooks

After setup, these hooks are available:

| Hook | Purpose |
|------|---------|
| `useAuth()` | Access auth state and methods |
| `useLoginForm()` | Login form state and handler |
| `useRegisterForm()` | Register form state and handler |
| `useSocialAuth()` | Social auth methods |
| `useAuthRequired()` | Guard for protected screens |

## Features

### Complete Auth Flow

1. **Sign Up** - User creates account with email/password
2. **Sign In** - User logs in with credentials
3. **Social Auth** - Apple/Google Sign-In
4. **Auth Persistence** - User stays logged in across app restarts
5. **Protected Routes** - Auth guards redirect unauthenticated users
6. **Sign Out** - Clean logout with state cleanup

### State Management

- Uses Zustand for auth state
- TanStack Query for server state
- Firebase auth persistence
- Automatic token refresh

### Error Handling

- Form validation (email format, password strength)
- Duplicate account detection
- Wrong password handling
- Network error handling
- User-friendly error messages

## Why This Pattern Works

The app-store-screenshots skill pattern ensures:

1. **Markdown-based instructions** - Easy to read and maintain
2. **Clear trigger keywords** - AI agents know when to activate it
3. **Step-by-step format** - Logical progression through setup
4. **Complete code examples** - Ready-to-use implementations
5. **Verification checklist** - Confirms everything works
6. **Troubleshooting guide** - Quick problem resolution

## Testing

To test the auth setup:

1. Install the skill using one of the methods above
2. Run: "Setup authentication in my app"
3. Verify AuthProvider is added
4. Test login flow with email/password
5. Test social auth (if configured)
6. Verify auth state persists after app restart
7. Test protected routes redirect correctly

## Common Mistakes to Avoid

| Mistake | Fix |
|---------|-----|
| Forgetting Firebase | Setup Firebase first with the Firebase skill |
| Missing AuthProvider | Must wrap entire app, not just screens |
| No Apple capability | Enable "Sign in with Apple" in Xcode |
| Navigation outside provider | Move navigation inside AuthProvider |
| Wrong Firebase config | Verify Firebase is initialized before auth |

## Prerequisites

**Required:**
- Firebase project configured
- @umituz/react-native-firebase installed (skill handles this)
- React Native or Expo project

**For Social Auth:**
- Apple Developer Account (for Apple Sign-In)
- Firebase Console (enable providers)
- Google Cloud Console (for Google Sign-In)

## Inspiration

This skill structure is inspired by [app-store-screenshots](https://github.com/ParthJadhav/app-store-screenshots), demonstrating best practices for Claude Code skills.

## License

MIT

## Contributing

Contributions welcome! Submit PRs with:
- Clear descriptions
- Step-by-step instructions
- Complete code examples
- Testing instructions
- Troubleshooting guides
