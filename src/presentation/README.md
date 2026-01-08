# Presentation Layer

React Native Auth package presentation layer. Contains React components, hooks, providers, stores, and navigation.

## Structure

```
presentation/
├── providers/
│   └── AuthProvider.tsx           # Auth context provider
├── hooks/
│   ├── useAuth.ts                 # Main auth hook
│   ├── useAuthRequired.ts         # Auth-required hook
│   ├── useRequireAuth.ts          # Route protection hook
│   ├── useUserProfile.ts          # User profile hook
│   ├── useProfileUpdate.ts        # Profile update hook
│   ├── useProfileEdit.ts          # Profile edit hook
│   ├── useAccountManagement.ts    # Account management hook
│   ├── useSocialLogin.ts          # Social login hook
│   ├── useGoogleAuth.ts           # Google auth hook
│   ├── useAppleAuth.ts            # Apple auth hook
│   ├── useAuthBottomSheet.ts      # Auth bottom sheet hook
│   ├── useLoginForm.ts            # Login form hook
│   ├── useRegisterForm.ts         # Register form hook
│   └── mutations/
│       └── useAuthMutations.ts    # Auth mutation hooks
├── components/
│   ├── AuthContainer.tsx          # Main container
│   ├── AuthHeader.tsx             # Header component
│   ├── AuthFormCard.tsx           # Form card
│   ├── LoginForm.tsx              # Login form
│   ├── RegisterForm.tsx           # Register form
│   ├── EditProfileForm.tsx        # Edit profile form
│   ├── EditProfileAvatar.tsx      # Edit profile avatar
│   ├── PasswordStrengthIndicator.tsx  # Password strength
│   ├── PasswordMatchIndicator.tsx     # Password match
│   ├── SocialLoginButtons.tsx     # Social login buttons
│   ├── ProfileSection.tsx         # Profile section
│   ├── AccountActions.tsx         # Account actions
│   ├── AuthBottomSheet.tsx        # Bottom sheet modal
│   ├── AuthLegalLinks.tsx         # Legal links
│   ├── AuthDivider.tsx            # Divider
│   ├── AuthLink.tsx               # Navigation link
│   ├── AuthErrorDisplay.tsx       # Error display
│   ├── AuthGradientBackground.tsx # Gradient background
│   └── icons/
│       ├── GoogleIconSvg.tsx      # Google icon
│       └── AppleIconSvg.tsx       # Apple icon
├── screens/
│   ├── LoginScreen.tsx            # Login screen
│   ├── RegisterScreen.tsx         # Register screen
│   ├── AccountScreen.tsx          # Account screen
│   └── EditProfileScreen.tsx      # Edit profile screen
├── navigation/
│   └── AuthNavigator.tsx          # Auth navigator
├── stores/
│   ├── authStore.ts               # Auth state store (Zustand)
│   └── authModalStore.ts          # Auth modal store
└── utils/
    └── accountDeleteHandler.util.ts  # Account deletion handler
```

## Overview

The presentation layer provides all UI components and React hooks for authentication features in your React Native app.

---

# Providers

## AuthProvider

Root provider that wraps your app and provides authentication context.

```typescript
import { AuthProvider } from '@umituz/react-native-auth';

function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
```

---

# Hooks

## Core Hooks

### useAuth

Main authentication hook for managing auth state and operations.

```typescript
import { useAuth } from '@umituz/react-native-auth';

function MyComponent() {
  const {
    user,
    userId,
    userType,
    loading,
    isAuthReady,
    isAnonymous,
    isAuthenticated,
    error,
    signIn,
    signUp,
    signOut,
    continueAnonymously,
    setError,
  } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <View>
      <Text>Welcome, {user?.email}</Text>
      <Button onPress={signOut}>Sign Out</Button>
    </View>
  );
}
```

### useAuthRequired

Check auth requirements and show modal if needed.

```typescript
import { useAuthRequired } from '@umituz/react-native-auth';

function LikeButton() {
  const { isAllowed, checkAndRequireAuth } = useAuthRequired();

  const handleLike = () => {
    if (checkAndRequireAuth()) {
      // User is authenticated, proceed
      likePost();
    }
    // Otherwise, auth modal is shown automatically
  };

  return (
    <Button onPress={handleLike}>
      {isAllowed ? 'Like' : 'Sign in to like'}
    </Button>
  );
}
```

### useRequireAuth

Get userId or throw if not authenticated (for protected components).

```typescript
import { useRequireAuth } from '@umituz/react-native-auth';

function UserProfile() {
  const userId = useRequireAuth(); // Guaranteed to be string

  useEffect(() => {
    fetchUserData(userId);
  }, [userId]);

  return <ProfileContent userId={userId} />;
}
```

## User Profile Hooks

### useUserProfile

Fetch user profile data for display.

```typescript
import { useUserProfile } from '@umituz/react-native-auth';

function ProfileHeader() {
  const profile = useUserProfile({
    accountRoute: '/account',
    anonymousDisplayName: 'Guest User',
  });

  if (!profile) return <LoadingSpinner />;

  return (
    <View>
      <Avatar source={{ uri: profile.avatarUrl }} />
      <Text>{profile.displayName}</Text>
      {profile.isAnonymous && <Text>Guest</Text>}
    </View>
  );
}
```

### useProfileUpdate

Profile update operations.

```typescript
import { useProfileUpdate } from '@umituz/react-native-auth';

function ProfileSettings() {
  const { updateProfile, isUpdating, error } = useProfileUpdate();

  const handleUpdate = async (data: UpdateProfileParams) => {
    try {
      await updateProfile(data);
    } catch (err) {
      console.error(err);
    }
  };

  return <ProfileForm onSave={handleUpdate} />;
}
```

### useProfileEdit

Profile editing form state management.

```typescript
import { useProfileEdit } from '@umituz/react-native-auth';

function EditProfileScreen() {
  const {
    formState,
    setDisplayName,
    setEmail,
    setPhotoURL,
    resetForm,
    validateForm,
  } = useProfileEdit({
    displayName: user?.displayName || '',
    email: user?.email || '',
    photoURL: user?.photoURL || null,
  });

  const handleSave = () => {
    const { isValid, errors } = validateForm();
    if (!isValid) {
      Alert.alert('Error', errors.join('\n'));
      return;
    }
    updateProfile(formState);
  };

  return <EditProfileForm {...props} />;
}
```

## Account Management Hooks

### useAccountManagement

Account management operations (logout, delete).

```typescript
import { useAccountManagement } from '@umituz/react-native-auth';

function AccountSettings() {
  const { logout, deleteAccount, isLoading, isDeletingAccount } = useAccountManagement({
    onReauthRequired: async () => {
      const result = await reauthenticateWithGoogle();
      return result.success;
    },
    onPasswordRequired: async () => {
      const password = await showPasswordPrompt();
      return password;
    },
  });

  return (
    <View>
      <Button onPress={logout}>Sign Out</Button>
      <Button onPress={deleteAccount}>Delete Account</Button>
    </View>
  );
}
```

## Social Login Hooks

### useSocialLogin

General social login management.

```typescript
import { useSocialLogin } from '@umituz/react-native-auth';

function LoginScreen() {
  const {
    signInWithGoogle,
    signInWithApple,
    googleLoading,
    appleLoading,
    googleConfigured,
    appleAvailable,
  } = useSocialLogin({
    google: { webClientId: '...', iosClientId: '...' },
    apple: { enabled: true },
  });

  return (
    <View>
      <Button onPress={signInWithGoogle} disabled={googleLoading}>
        Google
      </Button>
      <Button onPress={signInWithApple} disabled={appleLoading}>
        Apple
      </Button>
    </View>
  );
}
```

### useGoogleAuth

Google OAuth flow with expo-auth-session.

```typescript
import { useGoogleAuth } from '@umituz/react-native-auth';

function LoginScreen() {
  const { signInWithGoogle, googleLoading, googleConfigured } = useGoogleAuth({
    iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
    webClientId: Config.GOOGLE_WEB_CLIENT_ID,
  });

  return (
    <Button onPress={signInWithGoogle} disabled={googleLoading}>
      Sign in with Google
    </Button>
  );
}
```

### useAppleAuth

Apple Sign-In functionality.

```typescript
import { useAppleAuth } from '@umituz/react-native-auth';

function LoginScreen() {
  const { signInWithApple, appleLoading, appleAvailable } = useAppleAuth();

  if (!appleAvailable) return null;

  return (
    <Button onPress={signInWithApple} disabled={appleLoading}>
      Sign in with Apple
    </Button>
  );
}
```

## UI Hooks

### useAuthBottomSheet

Authentication bottom sheet management.

```typescript
import { useAuthBottomSheet } from '@umituz/react-native-auth';

function AuthBottomSheet() {
  const {
    modalRef,
    mode,
    providers,
    googleLoading,
    appleLoading,
    handleDismiss,
    handleGoogleSignIn,
    handleAppleSignIn,
  } = useAuthBottomSheet({
    socialConfig: {
      google: { webClientId: '...', iosClientId: '...' },
      apple: { enabled: true },
    },
  });

  return (
    <BottomSheetModal ref={modalRef} onDismiss={handleDismiss}>
      {mode === 'login' ? (
        <LoginForm onGoogleSignIn={handleGoogleSignIn} />
      ) : (
        <RegisterForm onGoogleSignIn={handleGoogleSignIn} />
      )}
    </BottomSheetModal>
  );
}
```

---

# Components

## Layout Components

### AuthContainer

Main auth layout container with gradient background.

```typescript
import { AuthContainer } from '@umituz/react-native-auth';

function LoginScreen() {
  return (
    <AuthContainer>
      <AuthHeader title="Sign In" />
      <LoginForm />
      <SocialLoginButtons />
    </AuthContainer>
  );
}
```

### AuthHeader

Header component for auth screens.

```typescript
import { AuthHeader } from '@umituz/react-native-auth';

<AuthHeader
  title="Welcome Back"
  subtitle="Sign in to continue"
/>
```

### AuthFormCard

Form card container with consistent styling.

```typescript
import { AuthFormCard } from '@umituz/react-native-auth';

<AuthFormCard>
  <LoginForm />
</AuthFormCard>
```

## Form Components

### LoginForm & RegisterForm

Pre-built authentication forms.

```typescript
import { LoginForm, RegisterForm } from '@umituz/react-native-auth';

function LoginScreen() {
  const navigation = useNavigation();

  return (
    <LoginForm onNavigateToRegister={() => navigation.navigate('Register')} />
  );
}

function RegisterScreen() {
  const navigation = useNavigation();

  return (
    <RegisterForm
      onNavigateToLogin={() => navigation.navigate('Login')}
      onTermsPress={() => navigation.navigate('Terms')}
      onPrivacyPress={() => navigation.navigate('Privacy')}
    />
  );
}
```

## Password Indicators

### PasswordStrengthIndicator

Visual password strength indicator.

```typescript
import { PasswordStrengthIndicator } from '@umituz/react-native-auth';

function RegisterForm() {
  const [password, setPassword] = useState('');
  const requirements = validatePasswordRequirements(password);

  return (
    <View>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <PasswordStrengthIndicator requirements={requirements} />
    </View>
  );
}
```

### PasswordMatchIndicator

Password matching indicator.

```typescript
import { PasswordMatchIndicator } from '@umituz/react-native-auth';

function RegisterForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const passwordsMatch = password === confirmPassword && password.length > 0;

  return (
    <View>
      <TextInput value={password} onChangeText={setPassword} />
      <TextInput value={confirmPassword} onChangeText={setConfirmPassword} />
      {confirmPassword.length > 0 && (
        <PasswordMatchIndicator isMatch={passwordsMatch} />
      )}
    </View>
  );
}
```

## Social Login Components

### SocialLoginButtons

Social login button group.

```typescript
import { SocialLoginButtons } from '@umituz/react-native-auth';

function LoginScreen() {
  const { signInWithGoogle, googleLoading } = useGoogleAuth({ ... });
  const { signInWithApple, appleLoading } = useAppleAuth();

  return (
    <SocialLoginButtons
      enabledProviders={['google', 'apple']}
      onGooglePress={signInWithGoogle}
      onApplePress={signInWithApple}
      googleLoading={googleLoading}
      appleLoading={appleLoading}
    />
  );
}
```

## Profile Components

### ProfileSection

User profile display component.

```typescript
import { ProfileSection } from '@umituz/react-native-auth';

function SettingsScreen() {
  const profile = useUserProfile();

  return (
    <ProfileSection
      profile={{
        displayName: profile?.displayName,
        userId: profile?.userId,
        isAnonymous: profile?.isAnonymous || false,
        avatarUrl: profile?.avatarUrl,
      }}
      onPress={() => navigation.navigate('EditProfile')}
      onSignIn={() => navigation.navigate('Login')}
    />
  );
}
```

### AccountActions

Account management actions component.

```typescript
import { AccountActions } from '@umituz/react-native-auth';

function AccountSettings() {
  const { logout, deleteAccount } = useAccountManagement();

  const config = {
    logoutText: 'Sign Out',
    deleteAccountText: 'Delete Account',
    logoutConfirmTitle: 'Sign Out',
    logoutConfirmMessage: 'Are you sure you want to sign out?',
    deleteConfirmTitle: 'Delete Account',
    deleteConfirmMessage: 'This action cannot be undone. Continue?',
    onLogout: logout,
    onDeleteAccount: deleteAccount,
  };

  return <AccountActions config={config} />;
}
```

---

# Screens

Pre-built authentication screens.

```typescript
import {
  LoginScreen,
  RegisterScreen,
  AccountScreen,
  EditProfileScreen,
} from '@umituz/react-native-auth';

// Use in navigation
<Stack.Screen
  name="Login"
  component={LoginScreen}
  options={{ headerShown: false }}
/>
<Stack.Screen
  name="Register"
  component={RegisterScreen}
/>
<Stack.Screen
  name="Account"
  component={AccountScreen}
/>
<Stack.Screen
  name="EditProfile"
  component={EditProfileScreen}
/>
```

---

# Stores

## authStore

Main authentication state store (Zustand).

```typescript
import {
  useAuthStore,
  selectIsAuthenticated,
  selectUserId,
  getIsAuthenticated,
  getUserId,
} from '@umituz/react-native-auth';

function Component() {
  // Selectors prevent unnecessary re-renders
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const userId = useAuthStore(selectUserId);

  return <View>{/* ... */}</View>;
}
```

## authModalStore

Auth modal state store.

```typescript
import { useAuthModalStore } from '@umituz/react-native-auth';

function Component() {
  const { showAuthModal, isVisible, mode, hideAuthModal } = useAuthModalStore();

  const handleAuthRequired = () => {
    showAuthModal(() => {
      // Callback after successful auth
      performAction();
    }, 'login');
  };

  return <View>{/* ... */}</View>;
}
```

---

# Navigation

## AuthNavigator

Pre-configured authentication navigator.

```typescript
import { AuthNavigator } from '@umituz/react-native-auth';

function App() {
  return (
    <NavigationContainer>
      <AuthNavigator />
    </NavigationContainer>
  );
}
```

---

# Best Practices

## 1. Use Hooks Over Direct Store Access

```typescript
// ✅ Good
function Component() {
  const { user, signIn } = useAuth();

  return <View>{/* ... */}</View>;
}

// ❌ Bad
function Component() {
  const user = useAuthStore((state) => state.user);

  return <View>{/* ... */}</View>;
}
```

## 2. Wrap with AuthProvider

```typescript
// ✅ Good
function App() {
  return (
    <AuthProvider>
      <Navigator />
    </AuthProvider>
  );
}

// ❌ Bad - Missing provider
function App() {
  return <Navigator />;
}
```

## 3. Handle Loading States

```typescript
// ✅ Good
function Component() {
  const { loading, isAuthReady, user } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!isAuthReady) return <InitializingScreen />;

  return <View>{/* ... */}</View>;
}
```

## Related Modules

- **[Domain](../domain/README.md)** - Domain entities and business rules
- **[Application](../application/README.md)** - Application interfaces
- **[Infrastructure](../infrastructure/README.md)** - Infrastructure implementations
