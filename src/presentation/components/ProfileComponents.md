# Profile Components

Components for user profile display and account management.

## Components

- **[`ProfileSection`](#profilesection)** - Profile display section
- **[`AccountActions`](#accountactions)** - Account management actions

---

## ProfileSection

Component that displays user profile information including avatar, name, and user ID.

### Usage

```typescript
import { ProfileSection } from '@umituz/react-native-auth';

function SettingsScreen() {
  const profile = useUserProfile({
    accountRoute: 'AccountSettings',
  });

  const navigation = useNavigation();

  return (
    <View>
      <ProfileSection
        profile={{
          displayName: profile?.displayName,
          userId: profile?.userId,
          isAnonymous: profile?.isAnonymous || false,
          avatarUrl: profile?.avatarUrl,
          accountSettingsRoute: profile?.accountSettingsRoute,
        }}
        onPress={() => navigation.navigate('EditProfile')}
        onSignIn={() => navigation.navigate('Login')}
        signInText="Sign In"
        anonymousText="Guest"
      />
    </View>
  );
}
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `profile` | `ProfileSectionConfig` | Yes | Profile configuration |
| `onPress` | `() => void` | No | Press handler (for authenticated users) |
| `onSignIn` | `() => void` | No | Sign-in handler (for anonymous users) |
| `signInText` | `string` | No | "Sign In" button text |
| `anonymousText` | `string` | No | Anonymous user label |

#### ProfileSectionConfig

```typescript
interface ProfileSectionConfig {
  displayName?: string;        // Display name
  userId?: string;             // User ID
  isAnonymous: boolean;        // Is anonymous user
  avatarUrl?: string;          // Profile photo URL
  accountSettingsRoute?: string; // Account settings route
  benefits?: string[];         // Benefits list
}
```

### Examples

#### Authenticated User

```typescript
function ProfileSection() {
  const { user } = useAuth();

  const profile = {
    displayName: user?.displayName || user?.email,
    userId: user?.uid,
    isAnonymous: false,
    avatarUrl: user?.photoURL,
    accountSettingsRoute: 'AccountSettings',
  };

  const navigation = useNavigation();

  return (
    <ProfileSection
      profile={profile}
      onPress={() => navigation.navigate('EditProfile')}
    />
  );
}
```

#### Anonymous User

```typescript
function ProfileSection() {
  const { user } = useAuth();

  const profile = {
    displayName: 'Guest User',
    userId: undefined,
    isAnonymous: true,
    avatarUrl: undefined,
  };

  const navigation = useNavigation();

  return (
    <ProfileSection
      profile={profile}
      onSignIn={() => navigation.navigate('Login')}
      signInText="Sign In"
    />
  );
}
```

#### With Benefits

```typescript
function PremiumProfileSection() {
  const { user } = useAuth();

  const profile = {
    displayName: user?.displayName,
    userId: user?.uid,
    isAnonymous: false,
    avatarUrl: user?.photoURL,
    benefits: [
      'Access to premium content',
      'Ad-free experience',
      'Exclusive discounts',
    ],
  };

  return <ProfileSection profile={profile} />;
}
```

#### Dynamic Profile

```typescript
function DynamicProfileSection() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const profile = useUserProfile();

  const handlePress = () => {
    if (profile?.isAnonymous) {
      navigation.navigate('Login');
    } else {
      navigation.navigate('EditProfile');
    }
  };

  return (
    <ProfileSection
      profile={{
        displayName: profile?.displayName,
        userId: profile?.userId,
        isAnonymous: profile?.isAnonymous || false,
        avatarUrl: profile?.avatarUrl,
        benefits: profile?.isAnonymous
          ? ['Create an account to access more features']
          : ['Get premium membership', 'Access exclusive content'],
      }}
      onPress={handlePress}
    />
  );
}
```

#### With Custom Avatar

```typescript
function ProfileSectionWithCustomAvatar() {
  const { user } = useAuth();
  const navigation = useNavigation();

  const profile = {
    displayName: user?.displayName || 'User',
    userId: user?.uid,
    isAnonymous: user?.isAnonymous || false,
    avatarUrl: user?.photoURL || 'https://example.com/default-avatar.png',
    accountSettingsRoute: 'AccountSettings',
  };

  return (
    <ProfileSection
      profile={profile}
      onPress={() => navigation.navigate('EditProfile')}
    />
  );
}
```

#### With Edit Indicator

```typescript
function ProfileSectionWithEditIndicator() {
  const profile = useUserProfile();
  const navigation = useNavigation();

  return (
    <View>
      <ProfileSection
        profile={{
          displayName: profile?.displayName,
          userId: profile?.userId,
          isAnonymous: profile?.isAnonymous || false,
          avatarUrl: profile?.avatarUrl,
          accountSettingsRoute: 'AccountSettings',
        }}
        onPress={() => navigation.navigate('EditProfile')}
      />
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('EditProfile')}
      >
        <Text>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## AccountActions

Component for account management operations including sign out, password change, and account deletion.

### Usage

```typescript
import { AccountActions } from '@umituz/react-native-auth';

function AccountSettingsScreen() {
  const { logout, deleteAccount } = useAccountManagement();
  const navigation = useNavigation();

  const config = {
    logoutText: 'Sign Out',
    deleteAccountText: 'Delete Account',
    changePasswordText: 'Change Password',
    logoutConfirmTitle: 'Sign Out',
    logoutConfirmMessage: 'Are you sure you want to sign out?',
    deleteConfirmTitle: 'Delete Account',
    deleteConfirmMessage: 'This action cannot be undone. Continue?',
    deleteErrorTitle: 'Error',
    deleteErrorMessage: 'Account could not be deleted. Please try again.',
    onLogout: async () => {
      await logout();
      navigation.replace('Login');
    },
    onDeleteAccount: async () => {
      await deleteAccount();
      navigation.replace('Login');
    },
    showChangePassword: true,
    onChangePassword: () => {
      navigation.navigate('ChangePassword');
    },
  };

  return (
    <View>
      <AccountActions config={config} />
    </View>
  );
}
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `config` | `AccountActionsConfig` | Yes | Account actions configuration |

#### AccountActionsConfig

```typescript
interface AccountActionsConfig {
  logoutText: string;                  // "Sign Out" button text
  deleteAccountText: string;           // "Delete Account" button text
  changePasswordText?: string;         // "Change Password" button text
  logoutConfirmTitle: string;          // Sign out confirmation title
  logoutConfirmMessage: string;        // Sign out confirmation message
  deleteConfirmTitle: string;          // Delete confirmation title
  deleteConfirmMessage: string;        // Delete confirmation message
  deleteErrorTitle?: string;           // Delete error title
  deleteErrorMessage?: string;         // Delete error message
  onLogout: () => Promise<void>;       // Sign out handler
  onDeleteAccount: () => Promise<void>; // Delete handler
  onChangePassword?: () => void;       // Change password handler
  showChangePassword?: boolean;        // Show change password button
}
```

### Examples

#### Basic Usage

```typescript
function SimpleAccountActions() {
  const { logout, deleteAccount } = useAccountManagement();

  const config = {
    logoutText: 'Sign Out',
    deleteAccountText: 'Delete Account',
    logoutConfirmTitle: 'Sign Out',
    logoutConfirmMessage: 'Are you sure you want to sign out?',
    deleteConfirmTitle: 'Delete Account',
    deleteConfirmMessage: 'Are you sure you want to delete your account?',
    onLogout: logout,
    onDeleteAccount: deleteAccount,
  };

  return <AccountActions config={config} />;
}
```

#### With Password Change

```typescript
function AccountActionsWithPasswordChange() {
  const { logout, deleteAccount } = useAccountManagement();
  const navigation = useNavigation();

  const config = {
    logoutText: 'Sign Out',
    deleteAccountText: 'Delete Account',
    changePasswordText: 'Change Password',
    logoutConfirmTitle: 'Sign Out',
    logoutConfirmMessage: 'Are you sure you want to sign out?',
    deleteConfirmTitle: 'Delete Account',
    deleteConfirmMessage: 'Are you sure you want to delete your account?',
    onLogout: async () => {
      await logout();
      navigation.replace('Login');
    },
    onDeleteAccount: async () => {
      await deleteAccount();
      navigation.replace('Login');
    },
    showChangePassword: true,
    onChangePassword: () => {
      navigation.navigate('ChangePassword');
    },
  };

  return <AccountActions config={config} />;
}
```

#### With Custom Error Handling

```typescript
function AccountActionsWithErrorHandling() {
  const { logout, deleteAccount } = useAccountManagement();
  const navigation = useNavigation();

  const config = {
    logoutText: 'Sign Out',
    deleteAccountText: 'Delete Account',
    logoutConfirmTitle: 'Sign Out',
    logoutConfirmMessage: 'Are you sure you want to sign out?',
    deleteConfirmTitle: 'Delete Account',
    deleteConfirmMessage: 'This action cannot be undone. Continue?',
    deleteErrorTitle: 'Account Deletion Failed',
    deleteErrorMessage: 'An error occurred while deleting your account. Please try again later or contact support.',
    onLogout: async () => {
      try {
        await logout();
        navigation.replace('Login');
      } catch (error) {
        Alert.alert('Error', 'Failed to sign out');
      }
    },
    onDeleteAccount: async () => {
      try {
        await deleteAccount();
        Alert.alert('Success', 'Your account has been deleted');
        navigation.replace('Login');
      } catch (error) {
        // Error is automatically shown (deleteErrorMessage)
        throw error;
      }
    },
  };

  return <AccountActions config={config} />;
}
```

#### For Anonymous Users

```typescript
function AccountActionsAnonymous() {
  const { isAnonymous } = useAuth();

  if (isAnonymous) {
    return (
      <Button onPress={() => navigation.navigate('Register')}>
        Create Account
      </Button>
    );
  }

  const config = {
    logoutText: 'Sign Out',
    deleteAccountText: 'Delete Account',
    logoutConfirmTitle: 'Sign Out',
    logoutConfirmMessage: 'Are you sure you want to sign out?',
    deleteConfirmTitle: 'Delete Account',
    deleteConfirmMessage: 'Are you sure you want to delete your account?',
    onLogout: logout,
    onDeleteAccount: deleteAccount,
  };

  return <AccountActions config={config} />;
}
```

#### With Loading States

```typescript
function AccountActionsWithLoading() {
  const { logout, deleteAccount, isLoading, isDeletingAccount } = useAccountManagement();
  const navigation = useNavigation();

  const config = {
    logoutText: isLoading ? 'Signing out...' : 'Sign Out',
    deleteAccountText: isDeletingAccount ? 'Deleting...' : 'Delete Account',
    logoutConfirmTitle: 'Sign Out',
    logoutConfirmMessage: 'Are you sure?',
    deleteConfirmTitle: 'Delete Account',
    deleteConfirmMessage: 'This cannot be undone. Continue?',
    onLogout: async () => {
      await logout();
      navigation.replace('Login');
    },
    onDeleteAccount: async () => {
      await deleteAccount();
      navigation.replace('Login');
    },
  };

  return (
    <AccountActions
      config={config}
      isLoading={isLoading}
      isDeletingAccount={isDeletingAccount}
    />
  );
}
```

#### With Analytics

```typescript
function AccountActionsWithAnalytics() {
  const { logout, deleteAccount } = useAccountManagement();
  const analytics = useAnalytics();

  const config = {
    logoutText: 'Sign Out',
    deleteAccountText: 'Delete Account',
    logoutConfirmTitle: 'Sign Out',
    logoutConfirmMessage: 'Are you sure?',
    deleteConfirmTitle: 'Delete Account',
    deleteConfirmMessage: 'This cannot be undone.',
    onLogout: async () => {
      analytics.trackEvent('account_logout');
      await logout();
    },
    onDeleteAccount: async () => {
      analytics.trackEvent('account_delete_initiated');
      await deleteAccount();
      analytics.trackEvent('account_delete_completed');
    },
  };

  return <AccountActions config={config} />;
}
```

## Combined Usage

```typescript
function AccountSettingsScreen() {
  const profile = useUserProfile();
  const { logout, deleteAccount } = useAccountManagement();
  const navigation = useNavigation();

  return (
    <ScrollView>
      {/* Profile section */}
      <ProfileSection
        profile={{
          displayName: profile?.displayName,
          userId: profile?.userId,
          isAnonymous: profile?.isAnonymous || false,
          avatarUrl: profile?.avatarUrl,
        }}
        onPress={() => navigation.navigate('EditProfile')}
      />

      {/* Account actions */}
      {!profile?.isAnonymous && (
        <AccountActions
          config={{
            logoutText: 'Sign Out',
            deleteAccountText: 'Delete Account',
            logoutConfirmTitle: 'Sign Out',
            logoutConfirmMessage: 'Are you sure you want to sign out?',
            deleteConfirmTitle: 'Delete Account',
            deleteConfirmMessage: 'This action cannot be undone. Continue?',
            onLogout: async () => {
              await logout();
              navigation.replace('Login');
            },
            onDeleteAccount: async () => {
              await deleteAccount();
              navigation.replace('Login');
            },
          }}
        />
      )}
    </ScrollView>
  );
}
```

## Styling

Components use design system tokens:

```typescript
{
  colors: {
    primary: tokens.colors.primary,
    danger: tokens.colors.error,
    text: tokens.colors.textPrimary,
    background: tokens.colors.background,
  },
  spacing: tokens.spacing,
}
```

## Accessibility

Components include accessibility features:

- ✅ Screen reader labels
- ✅ Accessibility hints
- ✅ Proper touch targets
- ✅ High contrast support
- ✅ Semantic button labels

## Related Components

- [`EditProfileForm`](./README.md) - Profile editing form
- [`EditProfileAvatar`](./README.md) - Profile photo editing

## Related Hooks

- [`useUserProfile`](../hooks/useUserProfile.md) - Profile data hook
- [`useAccountManagement`](../hooks/useAccountManagement.md) - Account management hook
- [`useAuth`](../hooks/useAuth.md) - Main auth state management
