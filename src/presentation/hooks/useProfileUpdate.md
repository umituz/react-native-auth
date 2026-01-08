# useProfileUpdate & useProfileEdit

Profil güncelleme ve düzenleme işlemleri için hooks.

## useProfileUpdate

Profil güncelleme işlemleri için hook. Bu hook implementasyon provides app tarafından sağlanmalıdır.

**Not:** Bu hook placeholder olarak sağlanmıştır. Gerçek implementasyon için Firebase SDK veya backend API kullanın.

### Kullanım

```typescript
import { useProfileUpdate } from '@umituz/react-native-auth';

function ProfileSettings() {
  const { updateProfile, isUpdating, error } = useProfileUpdate();

  const handleUpdate = async (data: UpdateProfileParams) => {
    try {
      await updateProfile(data);
      // Başarılı
    } catch (err) {
      // Hata yönetimi
    }
  };

  return (
    <View>
      {/* Profile form */}
      {error && <Text>{error}</Text>}
    </View>
  );
}
```

### API

| Prop | Tip | Açıklama |
|------|-----|----------|
| `updateProfile` | `(params: UpdateProfileParams) => Promise<void>` | Profil güncelleme fonksiyonu |
| `isUpdating` | `boolean` | Güncelleme durumunda |
| `error` | `string \| null` | Hata mesajı |

### Kendi Implementasyonunuzu Oluşturma

```typescript
function useProfileUpdate() {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = useCallback(async (params: UpdateProfileParams) => {
    if (!user) {
      throw new Error("No user logged in");
    }

    if (user.isAnonymous) {
      throw new Error("Anonymous users cannot update profile");
    }

    setIsUpdating(true);
    setError(null);

    try {
      // Firebase SDK kullanarak profil güncelleme
      await updateProfile(user, {
        displayName: params.displayName,
        photoURL: params.photoURL,
      });

      // Firestore'da kullanıcı dokümanını güncelleme
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
  }, [user]);

  return { updateProfile, isUpdating, error };
}
```

---

## useProfileEdit

Profil düzenleme form state yönetimi için hook. Form validasyonu ve değişiklik takibi sağlar.

### Kullanım

```typescript
import { useProfileEdit } from '@umituz/react-native-auth';

function EditProfileScreen({ navigation }) {
  const { user } = useAuth();

  const {
    formState,
    setDisplayName,
    setEmail,
    setPhotoURL,
    resetForm,
    validateForm
  } = useProfileEdit({
    displayName: user?.displayName || '',
    email: user?.email || '',
    photoURL: user?.photoURL || null,
  });

  const handleSave = () => {
    const { isValid, errors } = validateForm();

    if (!isValid) {
      Alert.alert('Hata', errors.join('\n'));
      return;
    }

    // Profil güncelleme işlemi
    updateProfile({
      displayName: formState.displayName,
      photoURL: formState.photoURL,
    });

    navigation.goBack();
  };

  const handleCancel = () => {
    if (formState.isModified) {
      Alert.alert(
        'Değişiklikler kaydedilmedi',
        'Yapılan değişiklikler iptal edilsin mi?',
        [
          { text: 'İptal', style: 'cancel' },
          {
            text: 'Tamam',
            onPress: () => {
              resetForm({
                displayName: user?.displayName || '',
                email: user?.email || '',
                photoURL: user?.photoURL || null,
              });
              navigation.goBack();
            }
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <ScrollView>
      <TextInput
        value={formState.displayName}
        onChangeText={setDisplayName}
        placeholder="Ad Soyad"
      />

      <TextInput
        value={formState.email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        editable={false} // Email genellikle değiştirilemez
      />

      <AvatarUploader
        photoURL={formState.photoURL}
        onImageSelected={setPhotoURL}
      />

      <View style={styles.buttons}>
        <Button onPress={handleCancel}>İptal</Button>
        <Button
          onPress={handleSave}
          disabled={!formState.isModified}
        >
          Kaydet
        </Button>
      </View>
    </ScrollView>
  );
}
```

### API

#### Return Value

| Prop | Tip | Açıklama |
|------|-----|----------|
| `formState` | `ProfileEditFormState` | Form state'i |
| `setDisplayName` | `(value: string) => void` | Display name set etme |
| `setEmail` | `(value: string) => void` | Email set etme |
| `setPhotoURL` | `(value: string \| null) => void` | Photo URL set etme |
| `resetForm` | `(initial: Partial<ProfileEditFormState>) => void` | Formu sıfırlama |
| `validateForm` | `() => { isValid: boolean; errors: string[] }` | Form validasyonu |

#### ProfileEditFormState

| Prop | Tip | Açıklama |
|------|-----|----------|
| `displayName` | `string` | Görünen ad |
| `email` | `string` | Email adresi |
| `photoURL` | `string \| null` | Profil fotoğrafı URL'si |
| `isModified` | `boolean` | Form değiştirildi mi |

### Validasyon

`validateForm()` fonksiyonu şu kontrolleri yapar:

- **Display name**: Boş olamaz
- **Email**: Geçerli email formatı kontrolü

```typescript
const { isValid, errors } = validateForm();

if (!isValid) {
  errors.forEach(error => console.log(error));
  // ["Display name is required", "Invalid email format"]
}
```

### Örnekler

#### Profil Fotoğrafı Yükleme

```typescript
function ProfilePhotoSection() {
  const { formState, setPhotoURL } = useProfileEdit({
    photoURL: user?.photoURL,
  });

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
          <Text>Fotoğraf Seç</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
```

#### Değişiklik Uyarısı

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
        'Değişiklikler kaydedilmedi',
        'Yapılan değişiklikler kaydedilsin mi?',
        [
          { text: 'İptal', style: 'cancel' },
          {
            text: 'Kaydet',
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

#### Custom Validasyon

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
    // Base validasyon
    const { isValid, errors } = validateForm();

    // Custom validasyon
    const customErrors = [];

    if (formState.displayName.length < 3) {
      customErrors.push('Display name en az 3 karakter olmalı');
    }

    if (formState.photoURL && !isValidImageUrl(formState.photoURL)) {
      customErrors.push('Geçersiz resim URL');
    }

    const allErrors = [...errors, ...customErrors];

    if (allErrors.length > 0) {
      Alert.alert('Hata', allErrors.join('\n'));
      return;
    }

    // Kaydet
    saveProfile();
  };

  // ...
}
```

## İlgili Hooks

- [`useUserProfile`](./useUserProfile.md) - Profil verilerini görüntüleme
- [`useAuth`](./useAuth.md) - Ana auth state yönetimi
- [`useAccountManagement`](./useAccountManagement.md) - Hesap yönetimi işlemleri
