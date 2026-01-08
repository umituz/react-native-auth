# useUserProfile

Hook for fetching user profile data for display in settings or profile screens.

## Features

- Returns profile data based on auth state
- Generates anonymous names for anonymous users
- Memoized for performance
- Type-safe profile data

## Usage

```typescript
import { useUserProfile } from '@umituz/react-native-auth';

function ProfileHeader() {
  const profile = useUserProfile({
    accountRoute: '/account',
    anonymousDisplayName: 'Guest User',
  });

  if (!profile) {
    return <LoadingSpinner />;
  }

  return (
    <View>
      <Avatar source={{ uri: profile.avatarUrl }} />
      <Text>{profile.displayName}</Text>
      {profile.isAnonymous && <Text>Guest</Text>}
    </View>
  );
}
```

## API

### Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `anonymousDisplayName` | `string` | `undefined` | Default name for anonymous users |
| `accountRoute` | `string` | `undefined` | Account settings route |
| `anonymousNameConfig` | `AnonymousNameConfig` | `undefined` | Anonymous name generation config |

### Return Value

`UserProfileData | undefined` - `undefined` if no user, otherwise:

| Prop | Type | Description |
|------|------|-------------|
| `displayName` | `string` | User's display name |
| `userId` | `string` | User ID |
| `isAnonymous` | `boolean` | Is anonymous user |
| `avatarUrl` | `string \| undefined` | Profile photo URL |
| `accountSettingsRoute` | `string \| undefined` | Account settings route |

## Examples

### Simple Profile Header

```typescript
function ProfileHeader() {
  const profile = useUserProfile();

  if (!profile) return null;

  return (
    <View style={styles.header}>
      {profile.avatarUrl ? (
        <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
      ) : (
        <View style={styles.placeholderAvatar}>
          <Text>{profile.displayName?.[0]}</Text>
        </View>
      )}
      <View>
        <Text style={styles.name}>{profile.displayName}</Text>
        {profile.isAnonymous && (
          <Badge style={styles.badge}>Guest</Badge>
        )}
      </View>
    </View>
  );
}
```

### Profile Settings Link

```typescript
function SettingsLink() {
  const profile = useUserProfile({
    accountRoute: '/settings/account',
  });

  if (!profile || profile.isAnonymous) {
    return null; // Don't show for anonymous users
  }

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(profile.accountSettingsRoute)}
    >
      <Text>Account Settings</Text>
    </TouchableOpacity>
  );
}
```

### Anonymous User with Custom Name

```typescript
function UserProfileCard() {
  const profile = useUserProfile({
    anonymousDisplayName: 'Guest User',
    anonymousNameConfig: {
      prefix: 'User',
      adjectiveCount: 1,
      nounCount: 1,
    },
  });

  if (!profile) return <Skeleton />;

  return (
    <Card>
      <Card.Title>{profile.displayName}</Card.Title>
      {profile.isAnonymous && (
        <Card.Description>
          <Link href="/register">Create an account</Link> for more features
        </Card.Description>
      )}
    </Card>
  );
}
```

### Navigation Integration

```typescript
function ProfileTab() {
  const profile = useUserProfile({
    accountRoute: 'Account',
  });

  const navigation = useNavigation();

  const handleProfilePress = () => {
    if (profile?.isAnonymous) {
      navigation.navigate('Register');
    } else if (profile?.accountSettingsRoute) {
      navigation.navigate(profile.accountSettingsRoute);
    }
  };

  return (
    <TouchableOpacity onPress={handleProfilePress}>
      <Text>{profile?.displayName || 'Profile'}</Text>
    </TouchableOpacity>
  );
}
```

### Conditional Content Based on Auth

```typescript
function WelcomeBanner() {
  const profile = useUserProfile();

  if (!profile) return <LoadingBanner />;

  if (profile.isAnonymous) {
    return (
      <Banner>
        <Text>Welcome, {profile.displayName}!</Text>
        <Button onPress={() => navigation.navigate('Register')}>
          Create Account
        </Button>
      </Banner>
    );
  }

  return (
    <Banner>
      <Text>Welcome, {profile.displayName}!</Text>
      <Text>Complete your profile to get the most out of the app.</Text>
    </Banner>
  );
}
```

## Anonymous Name Generation

Anonymous users automatically get random names generated:

```typescript
import { generateAnonymousName } from '@umituz/react-native-auth';

// Default: "User_Witty_Badger_1234"
const name1 = generateAnonymousName('user-123');

// Custom config
const name2 = generateAnonymousName('user-123', {
  prefix: 'Guest',
  adjectiveCount: 1,
  nounCount: 1,
});
// "Guest_Clever_Fox_1234"

// ID only
const name3 = generateAnonymousName('user-123', {
  prefix: '',
  adjectiveCount: 0,
  nounCount: 0,
});
// "user-123"
```

## Performance Notes

- Hook uses `useMemo` for performance
- Only recalculates when dependencies change
- Automatically updates on user sign-in/sign-out

## Related Hooks

- [`useAuth`](./useAuth.md) - Main auth state management
- [`useProfileUpdate`](./useProfileUpdate.md) - Profile updates
- [`useProfileEdit`](./useProfileEdit.md) - Profile editing form
