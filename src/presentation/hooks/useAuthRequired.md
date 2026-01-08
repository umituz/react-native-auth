# useAuthRequired & useRequireAuth

Two hooks for authentication requirements in components.

---

## useAuthRequired

Check auth requirements and show modal if needed.

### Usage

```typescript
import { useAuthRequired } from '@umituz/react-native-auth';

function LikeButton() {
  const { isAllowed, isLoading, requireAuth, checkAndRequireAuth } = useAuthRequired();

  const handleLike = () => {
    if (checkAndRequireAuth()) {
      // User is authenticated, proceed
      likePost();
    }
    // Otherwise, auth modal is shown automatically
  };

  return (
    <Button onPress={handleLike} disabled={isLoading}>
      {isAllowed ? 'Like' : 'Sign in to like'}
    </Button>
  );
}
```

### API

| Prop | Type | Description |
|------|------|-------------|
| `isAllowed` | `boolean` | Whether user is authenticated (not anonymous) |
| `isLoading` | `boolean` | Whether auth is still loading |
| `userId` | `string \| null` | Current user ID (null if not authenticated) |
| `requireAuth` | `() => void` | Show auth modal |
| `checkAndRequireAuth` | `() => boolean` | Check and show modal if needed, returns true/false |

### Examples

#### Add to Favorites

```typescript
function AddToFavoritesButton({ postId }) {
  const { isAllowed, checkAndRequireAuth } = useAuthRequired();

  const handleAddToFavorites = () => {
    if (!checkAndRequireAuth()) {
      return; // Auth modal opened, stop here
    }

    // User authenticated, proceed
    addToFavorites(postId);
  };

  return (
    <TouchableOpacity onPress={handleAddToFavorites}>
      <HeartIcon filled={isAllowed} />
    </TouchableOpacity>
  );
}
```

#### Post Comment

```typescript
function CommentForm({ postId }) {
  const { isAllowed, requireAuth, userId } = useAuthRequired();
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (!isAllowed) {
      requireAuth(); // Open auth modal
      return;
    }

    // Submit comment
    submitComment(postId, userId, comment);
    setComment('');
  };

  return (
    <View>
      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder={isAllowed ? "Write your comment..." : "Sign in to comment"}
        editable={isAllowed}
      />
      <Button onPress={handleSubmit} disabled={!isAllowed}>
        {isAllowed ? 'Submit' : 'Sign In'}
      </Button>
    </View>
  );
}
```

---

## useRequireAuth

For components that **must** have an authenticated user. Throws if not authenticated.

### Usage

```typescript
import { useRequireAuth } from '@umituz/react-native-auth';

function UserProfile() {
  const userId = useRequireAuth(); // string, not null

  useEffect(() => {
    // userId is guaranteed to be string
    fetchUserData(userId);
  }, [userId]);

  return <ProfileContent userId={userId} />;
}
```

### useUserId (Safe Alternative)

Returns null if user is not authenticated:

```typescript
import { useUserId } from '@umituz/react-native-auth';

function MaybeUserProfile() {
  const userId = useUserId(); // string | null

  if (!userId) {
    return <LoginPrompt />;
  }

  return <ProfileContent userId={userId} />;
}
```

### Examples

#### Order History

```typescript
function OrderHistory() {
  const userId = useRequireAuth(); // User must be authenticated

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', userId],
    queryFn: () => fetchOrders(userId),
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <FlatList
      data={orders}
      renderItem={({ item }) => <OrderCard order={item} />}
    />
  );
}
```

#### User Settings

```typescript
function UserSettings() {
  const userId = useRequireAuth();

  const updateSettings = async (settings: UserSettings) => {
    await updateUserSettings(userId, settings);
  };

  return <SettingsForm onSave={updateSettings} />;
}
```

### Error Handling

Wrap components using `useRequireAuth` with Error Boundary:

```typescript
function App() {
  return (
    <ErrorBoundary fallback={<LoginScreen />}>
      <Routes>
        <Route path="/settings" element={<UserSettings />} />
        <Route path="/orders" element={<OrderHistory />} />
      </Routes>
    </ErrorBoundary>
  );
}
```

## Comparison Table

| Situation | Hook | Why |
|-----------|------|-----|
| Check auth before action | `useAuthRequired` | Can show modal, graceful degradation |
| Show auth modal | `useAuthRequired` | Has `requireAuth()` method |
| Component requires auth | `useRequireAuth` | Type-safe, non-null userId |
| Optional auth | `useUserId` | Safe, can return null |

## Code Comparison

```typescript
// ❌ Wrong - useRequireAuth with modal attempt
function BadComponent() {
  const userId = useRequireAuth(); // Will throw!

  const handleClick = () => {
    // Never reaches here
  };
}

// ✅ Good - useAuthRequired with modal
function GoodComponent() {
  const { isAllowed, requireAuth } = useAuthRequired();

  const handleClick = () => {
    if (!isAllowed) {
      requireAuth(); // Show modal
      return;
    }
    // Perform action
  };
}

// ✅ Good - useRequireAuth for required auth
function ProtectedComponent() {
  const userId = useRequireAuth(); // Type-safe: string

  // Use userId
  useEffect(() => {
    fetchUserData(userId);
  }, [userId]);
}
```

## Related Hooks

- [`useAuth`](./useAuth.md) - Main auth state management
- [`useAuthModalStore`](../stores/authModalStore.ts) - Auth modal state
