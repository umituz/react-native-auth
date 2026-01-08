# useProfileUpdate & useProfileEdit

Hooks for profile update operations and profile editing form management.

---

## useProfileUpdate

Hook for profile update operations. Implementation should be provided by the app using Firebase SDK or backend API.

### Usage

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

### API

| Prop | Type | Description |
|------|------|-------------|
| `updateProfile` | `(params: UpdateProfileParams) => Promise<void>` | Profile update function |
| `isUpdating` | `boolean` | Update in progress |
| `error` | `string \| null` | Error message |

### Create Your Own Implementation

```typescript
function useProfileUpdate() {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (params: UpdateProfileParams) => {
    if (!user) {
      throw new Error("No user logged in");
    }

    if (user.isAnonymous) {
      throw new Error("Anonymous users cannot update profile");
    }

    setIsUpdating(true);
    setError(null);

    try {
      // Update profile in Firebase Auth
      await updateProfile(user, {
        displayName: params.displayName,
        photoURL: params.photoURL,
      });

      // Update user document in Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: params.displayName,
        photoURL: params.photoURL,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Update failed';
      setError(message);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateProfile, isUpdating, error };
}
```

---

## useProfileEdit

Hook for simple profile editing with form state management.

### Usage

```typescript
import { useProfileEdit } from '@umituz/react-native-auth';

function EditProfileScreen({ navigation }) {
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

    updateProfile({
      displayName: formState.displayName,
      photoURL: formState.photoURL,
    });

    navigation.goBack();
  };

  return (
    <ScrollView>
      <TextInput
        value={formState.displayName}
        onChangeText={setDisplayName}
        placeholder="Full Name"
      />

      <TextInput
        value={formState.email}
        onChangeText={setEmail}
        placeholder="Email"
        editable={false}
      />

      <AvatarUploader
        photoURL={formState.photoURL}
        onImageSelected={setPhotoURL}
      />

      <View style={styles.buttons}>
        <Button onPress={navigation.goBack}>Cancel</Button>
        <Button
          onPress={handleSave}
          disabled={!formState.isModified}
        >
          Save
        </Button>
      </View>
    </ScrollView>
  );
}
```

### API

#### Return Value

| Prop | Type | Description |
|------|------|-------------|
| `formState` | `ProfileEditFormState` | Form state |
| `setDisplayName` | `(value: string) => void` | Set display name |
| `setEmail` | `(value: string) => void` | Set email |
| `setPhotoURL` | `(value: string \| null) => void` | Set photo URL |
| `resetForm` | `(initial: Partial<ProfileEditFormState>) => void` | Reset form |
| `validateForm` | `() => { isValid: boolean; errors: string[] }` | Validate form |

#### ProfileEditFormState

| Prop | Type | Description |
|------|------|-------------|
| `displayName` | `string` | Display name |
| `email` | `string` | Email |
| `photoURL` | `string \| null` | Photo URL |
| `isModified` | `boolean` | Form has been modified |

### Validation

`validateForm()` checks:

- **Display name**: Cannot be empty
- **Email**: Valid email format (if provided)

```typescript
const { isValid, errors } = validateForm();

if (!isValid) {
  errors.forEach(error => console.log(error));
  // ["Display name is required", "Invalid email format"]
}
```

## Examples

### Profile Photo Upload

```typescript
function ProfilePhotoSection() {
  const { formState, setPhotoURL } = useProfileEdit(initialState);

  const handlePickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.assets?.[0]) {
      // Upload to storage and get URL
      const url = await uploadToStorage(result.assets[0].uri);
      setPhotoURL(url);
    }
  };

  return (
    <TouchableOpacity onPress={handlePickImage}>
      {formState.photoURL ? (
        <Image source={{ uri: formState.photoURL }} />
      ) : (
        <View style={styles.placeholder}>
          <Text>Select Photo</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
```

### Unsaved Changes Warning

```typescript
function EditProfileScreen({ navigation }) {
  const {
    formState,
    resetForm,
    validateForm
  } = useProfileEdit(initialState);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (!formState.isModified) {
        return;
      }

      e.preventDefault();

      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. What would you like to do?',
        [
          { text: 'Don\'t Save', style: 'cancel' },
          {
            text: 'Save',
            onPress: () => {
              saveChanges();
              navigation.dispatch(e.data.action);
            }
          },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {
              resetForm(initialState);
              navigation.dispatch(e.data.action);
            }
          },
        ]
      );
    });

    return unsubscribe;
  }, [navigation, formState.isModified]);

  // ...
}
```

### Custom Validation

```typescript
function ExtendedProfileEdit() {
  const {
    formState,
    setDisplayName,
    setEmail,
    setPhotoURL,
    validateForm
  } = useProfileEdit(initialState);

  const handleSave = () => {
    // Base validation
    const { isValid, errors } = validateForm();

    // Custom validation
    const customErrors = [];

    if (formState.displayName.length < 3) {
      customErrors.push('Display name must be at least 3 characters');
    }

    if (formState.photoURL && !isValidImageUrl(formState.photoURL)) {
      customErrors.push('Invalid image URL');
    }

    const allErrors = [...errors, ...customErrors];

    if (allErrors.length > 0) {
      Alert.alert('Error', allErrors.join('\n'));
      return;
    }

    saveProfile();
  };

  // ...
}
```

## Related Hooks

- [`useUserProfile`](./useUserProfile.md) - Display profile data
- [`useAuth`](./useAuth.md) - Main auth state management
- [`useAccountManagement`](./useAccountManagement.md) - Account operations
