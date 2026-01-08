# useAccountManagement

Hook for account management operations (logout, delete account).

## Features

- Sign out functionality
- Account deletion with reauthentication
- Reauthentication callback support
- Loading state management

## Usage

```typescript
import { useAccountManagement } from '@umituz/react-native-auth';

function AccountSettings() {
  const { logout, deleteAccount, isLoading, isDeletingAccount } = useAccountManagement({
    onReauthRequired: async () => {
      // Show Google/Apple sign-in UI
      const result = await reauthenticateWithGoogle();
      return result.success;
    },
    onPasswordRequired: async () => {
      // Show password prompt
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

## API

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `onReauthRequired` | `() => Promise<boolean>` | No | Callback for Google/Apple reauthentication |
| `onPasswordRequired` | `() => Promise<string \| null>` | No | Callback for password reauthentication |

### Return Value

| Prop | Type | Description |
|------|------|-------------|
| `logout` | `() => Promise<void>` | Sign out function |
| `deleteAccount` | `() => Promise<void>` | Delete account function |
| `isLoading` | `boolean` | General loading state |
| `isDeletingAccount` | `boolean` | Account deletion loading state |

## Examples

### Simple Account Settings

```typescript
function AccountSettingsScreen() {
  const { logout, deleteAccount, isDeletingAccount } = useAccountManagement();

  return (
    <ScrollView style={styles.container}>
      <Section title="Session">
        <MenuItem
          title="Sign Out"
          icon="log-out"
          onPress={logout}
        />
      </Section>

      <Section title="Danger Zone">
        <MenuItem
          title="Delete Account"
          icon="trash"
          onPress={deleteAccount}
          destructive
          disabled={isDeletingAccount}
        />
        {isDeletingAccount && <ActivityIndicator />}
      </Section>
    </ScrollView>
  );
}
```

### With Reauthentication

```typescript
function AccountSettingsScreen() {
  const { logout, deleteAccount } = useAccountManagement({
    onReauthRequired: async () => {
      try {
        // Reauthenticate with Google
        const result = await signInWithGooglePopup();

        if (result.user) {
          Alert.alert('Success', 'Please continue with account deletion');
          return true;
        }

        return false;
      } catch (error) {
        Alert.alert('Error', 'Reauthentication failed');
        return false;
      }
    },
    onPasswordRequired: async () => {
      return new Promise((resolve) => {
        // Show password prompt
        Alert.prompt(
          'Enter Password',
          'Please enter your password to delete your account',
          [
            {
              text: 'Cancel',
              onPress: () => resolve(null),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: (password) => resolve(password || null),
            },
          ],
          'secure-text'
        );
      });
    },
  });

  // ...
}
```

### Custom Reauthentication UI

```typescript
function DeleteAccountScreen() {
  const [showReauth, setShowReauth] = useState(false);

  const { deleteAccount, isDeletingAccount } = useAccountManagement({
    onReauthRequired: async () => {
      setShowReauth(true);
      return new Promise((resolve) => {
        // Custom reauthentication UI
        const handleResult = (success: boolean) => {
          setShowReauth(false);
          resolve(success);
        };

        showCustomReauthUI(handleResult);
      });
    },
    onPasswordRequired: async () => {
      setShowReauth(true);
      return new Promise((resolve) => {
        // Custom password prompt
        showPasswordPrompt((password) => {
          setShowReauth(false);
          resolve(password);
        });
      });
    },
  });

  const handleDelete = async () => {
    try {
      await deleteAccount();
      Alert.alert('Success', 'Account deleted');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View>
      <Button onPress={handleDelete} disabled={isDeletingAccount}>
        Delete Account
      </Button>

      {showReauth && (
        <ReauthenticationModal
          onComplete={() => {
            // Reauthentication successful, deleteAccount continues
          }}
        />
      )}
    </View>
  );
}
```

### Delete Account Confirmation

```typescript
function DeleteAccountConfirmation() {
  const { deleteAccount, isDeletingAccount } = useAccountManagement();
  const [agreed, setAgreed] = useState(false);

  const handleDelete = async () => {
    if (!agreed) {
      Alert.alert('Warning', 'Please accept the terms');
      return;
    }

    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: deleteAccount,
        },
      ]
    );
  };

  return (
    <View>
      <Text style={styles.warning}>
        By deleting your account:
      </Text>
      <Text>• All your data will be permanently deleted</Text>
      <Text>• This action cannot be undone</Text>
      <Text>• You won't be able to sign in with the same account</Text>

      <CheckBox
        value={agreed}
        onValueChange={setAgreed}
        label="I accept the account deletion terms"
      />

      <Button
        onPress={handleDelete}
        disabled={!agreed || isDeletingAccount}
        style={{ backgroundColor: 'red' }}
      >
        {isDeletingAccount ? 'Deleting...' : 'Permanently Delete Account'}
      </Button>
    </View>
  );
}
```

### Anonymous User Handling

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

## Error Handling

```typescript
function AccountSettingsWithErrorHandling() {
  const { logout, deleteAccount } = useAccountManagement();
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await logout();
      navigation.replace('Login');
    } catch (error) {
      if (error.code === 'auth/network-request-failed') {
        Alert.alert('Connection Error', 'Check your internet connection');
      } else {
        Alert.alert('Error', 'Failed to sign out');
      }
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      Alert.alert('Success', 'Account deleted');
      navigation.replace('Login');
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        Alert.alert(
          'Authentication Required',
          'Please sign in again to delete your account'
        );
      } else if (error.code === 'auth/too-many-requests') {
        Alert.alert(
          'Too Many Attempts',
          'Too many failed attempts. Please try again later'
        );
      } else {
        Alert.alert('Error', 'Failed to delete account');
      }
    }
  };

  return (
    <View>
      <Button onPress={handleLogout}>Sign Out</Button>
      <Button onPress={handleDeleteAccount}>Delete Account</Button>
    </View>
  );
}
```

## Important Notes

1. **Reauthentication Required**: Firebase requires recent sign-in for account deletion
2. **Anonymous Users**: Anonymous accounts cannot be deleted
3. **Irreversible**: Account deletion is permanent
4. **Callbacks**: If `onReauthRequired` and `onPasswordRequired` are not provided, errors will be thrown

## Reauthentication

Account deletion is a sensitive operation, so Firebase requires the user to have signed in recently. This hook provides reauthentication callbacks:

### onReauthRequired

For Google or Apple sign-in users:

```typescript
const { deleteAccount } = useAccountManagement({
  onReauthRequired: async () => {
    try {
      // Reauthenticate with Google
      const result = await signInWithGooglePopup();
      return result.user ? true : false;
    } catch (error) {
      return false;
    }
  },
});
```

### onPasswordRequired

For email/password users:

```typescript
const { deleteAccount } = useAccountManagement({
  onPasswordRequired: async () => {
    return new Promise((resolve) => {
      Alert.prompt(
        'Enter Password',
        'Please enter your password',
        [
          { text: 'Cancel', onPress: () => resolve(null), style: 'cancel' },
          { text: 'OK', onPress: (password) => resolve(password || null) },
        ],
        'secure-text'
      );
    });
  },
});
```

## Related Hooks

- [`useAuth`](./useAuth.md) - Main auth state management
- [`useSignOut`](./useAuth.md) - Sign out function
- [`useUserProfile`](./useUserProfile.md) - Profile information
