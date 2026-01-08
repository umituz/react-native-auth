# UserProfile Entity

Kullanıcı profili entity'si. Firestore'da saklanan kullanıcı bilgilerini temsil eder.

## Tip Tanımları

```typescript
import type { UserProfile, UpdateProfileParams } from '@umituz/react-native-auth';

interface UserProfile {
  uid: string;                // Kullanıcı ID'si
  email: string | null;       // Email adresi
  displayName: string | null; // Görünen ad
  photoURL: string | null;    // Profil fotoğrafı URL'si
  isAnonymous: boolean;       // Anonymous kullanıcı mı
  createdAt: Date | null;     // Hesap oluşturma tarihi
  lastLoginAt: Date | null;   // Son giriş tarihi
}

interface UpdateProfileParams {
  displayName?: string;  // Yeni görünen ad
  photoURL?: string;     // Yeni profil fotoğrafı URL'si
}
```

## Örnekler

### Tam Profil

```typescript
const fullProfile: UserProfile = {
  uid: 'user-123',
  email: 'john@example.com',
  displayName: 'John Doe',
  photoURL: 'https://example.com/avatar.jpg',
  isAnonymous: false,
  createdAt: new Date('2024-01-01'),
  lastLoginAt: new Date('2024-01-15'),
};
```

### Minimal Profil

```typescript
const minimalProfile: UserProfile = {
  uid: 'user-456',
  email: 'jane@example.com',
  displayName: null,
  photoURL: null,
  isAnonymous: false,
  createdAt: null,
  lastLoginAt: null,
};
```

### Anonymous Profil

```typescript
const anonymousProfile: UserProfile = {
  uid: 'anon-789',
  email: null,
  displayName: null,
  photoURL: null,
  isAnonymous: true,
  createdAt: new Date(),
  lastLoginAt: new Date(),
};
```

## Kullanım

### Profil Oluşturma

```typescript
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { UserProfile } from '@umituz/react-native-auth';

async function createUserProfile(uid: string, email: string): Promise<void> {
  const profile: UserProfile = {
    uid,
    email,
    displayName: null,
    photoURL: null,
    isAnonymous: false,
    createdAt: new Date(),
    lastLoginAt: new Date(),
  };

  await setDoc(doc(db, 'users', uid), {
    ...profile,
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  });
}
```

### Profil Güncelleme

```typescript
import { doc, updateDoc } from 'firebase/firestore';
import type { UpdateProfileParams } from '@umituz/react-native-auth';

async function updateUserProfile(
  uid: string,
  updates: UpdateProfileParams
): Promise<void> {
  const updateData: any = {};

  if (updates.displayName !== undefined) {
    updateData.displayName = updates.displayName;
  }

  if (updates.photoURL !== undefined) {
    updateData.photoURL = updates.photoURL;
  }

  updateData.updatedAt = serverTimestamp();

  await updateDoc(doc(db, 'users', uid), updateData);
}

// Kullanım
await updateUserProfile('user-123', {
  displayName: 'Jane Smith',
  photoURL: 'https://example.com/new-avatar.jpg',
});
```

### Profil Okuma

```typescript
import { doc, getDoc } from 'firebase/firestore';
import type { UserProfile } from '@umituz/react-native-auth';

async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();

  return {
    uid: data.uid,
    email: data.email,
    displayName: data.displayName,
    photoURL: data.photoURL,
    isAnonymous: data.isAnonymous,
    createdAt: data.createdAt?.toDate() || null,
    lastLoginAt: data.lastLoginAt?.toDate() || null,
  };
}
```

### AuthUser'dan UserProfile'a Dönüşüm

```typescript
import type { AuthUser, UserProfile } from '@umituz/react-native-auth';

function authUserToProfile(authUser: AuthUser): UserProfile {
  return {
    uid: authUser.uid,
    email: authUser.email,
    displayName: authUser.displayName,
    photoURL: authUser.photoURL,
    isAnonymous: authUser.isAnonymous,
    createdAt: null, // Firestore'dan gelecek
    lastLoginAt: new Date(),
  };
}
```

## Validasyon

### DisplayName Validasyonu

```typescript
function validateDisplayName(displayName: string): {
  valid: boolean;
  error?: string;
} {
  if (displayName.length < 2) {
    return { valid: false, error: 'Display name en az 2 karakter olmalı' };
  }

  if (displayName.length > 50) {
    return { valid: false, error: 'Display name en fazla 50 karakter olabilir' };
  }

  return { valid: true };
}

// Kullanım
const result = validateDisplayName('John');
if (!result.valid) {
  console.error(result.error);
}
```

### PhotoURL Validasyonu

```typescript
function validatePhotoURL(url: string): {
  valid: boolean;
  error?: string;
} {
  try {
    const parsed = new URL(url);

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, error: 'URL http veya https olmalı' };
    }

    // Image file extension kontrolü
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const hasImageExtension = imageExtensions.some(ext =>
      parsed.pathname.toLowerCase().endsWith(ext)
    );

    if (!hasImageExtension) {
      return { valid: false, error: 'Geçersiz resim formatı' };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'Geçersiz URL' };
  }
}
```

### Update Params Validasyonu

```typescript
function validateUpdateParams(params: UpdateProfileParams): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (params.displayName !== undefined) {
    const nameResult = validateDisplayName(params.displayName);
    if (!nameResult.valid) {
      errors.push(nameResult.error!);
    }
  }

  if (params.photoURL !== undefined) {
    const photoResult = validatePhotoURL(params.photoURL);
    if (!photoResult.valid) {
      errors.push(photoResult.error!);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
```

## Profil Photo Yükleme

### Firebase Storage ile Profil Fotoğrafı Yükleme

```typescript
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

async function uploadProfilePhoto(
  uid: string,
  uri: string
): Promise<string> {
  // Dosyayı blob'a çevir
  const response = await fetch(uri);
  const blob = await response.blob();

  // Storage referansı oluştur
  const storageRef = ref(storage, `avatars/${uid}/${Date.now()}.jpg`);

  // Yükle
  await uploadBytes(storageRef, blob);

  // URL al
  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
}

// Kullanım
async function handleProfilePhotoUpload(uid: string) {
  // Resim seç
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled) {
    return;
  }

  // Yükle
  const photoURL = await uploadProfilePhoto(uid, result.assets[0].uri);

  // Profili güncelle
  await updateUserProfile(uid, { photoURL });
}
```

## Profil Tamamlama Kontrolü

```typescript
function isProfileComplete(profile: UserProfile): boolean {
  return !!(
    profile.displayName &&
    profile.email &&
    profile.photoURL
  );
}

function getProfileCompleteness(profile: UserProfile): {
  percentage: number;
  missing: string[];
} {
  const required: Array<keyof UserProfile> = [
    'displayName',
    'email',
    'photoURL',
  ];

  const completed = required.filter(field => !!profile[field]);
  const percentage = (completed.length / required.length) * 100;

  const missing = required.filter(field => !profile[field]);

  return { percentage, missing };
}

// Kullanım
const completeness = getProfileCompleteness(profile);
console.log(`Profil %${completeness.percentage} tamamlandı`);
console.log('Eksik:', completeness.missing); // ['displayName', 'photoURL']
```

## Profil İsim Görüntüleme

```typescript
function getProfileDisplayName(profile: UserProfile): string {
  if (profile.displayName) {
    return profile.displayName;
  }

  if (profile.email) {
    const emailName = profile.email.split('@')[0];
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  }

  if (profile.isAnonymous) {
    return 'Misafir';
  }

  return 'Kullanıcı';
}

function getProfileInitials(profile: UserProfile): string {
  if (profile.displayName) {
    const names = profile.displayName.trim().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  }

  if (profile.email) {
    return profile.email[0].toUpperCase();
  }

  return '?';
}
```

## Profil Meta Verileri

### Extra Fields Ekleme

```typescript
interface ExtendedUserProfile extends UserProfile {
  bio?: string;
  location?: string;
  website?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  preferences?: {
    newsletter: boolean;
    notifications: boolean;
    language: string;
  };
}

// Kullanım
const extendedProfile: ExtendedUserProfile = {
  ...baseProfile,
  bio: 'Software developer',
  location: 'Istanbul, Turkey',
  website: 'https://johndoe.com',
  preferences: {
    newsletter: true,
    notifications: true,
    language: 'tr',
  },
};
```

## Firestore Index'leri

```json
{
  "indexes": [
    {
      "collectionGroup": "users",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "displayName", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

## İlgili Entity'ler

- **[`AuthUser`](./AuthUser.md)** - Authentication kullanıcı entity'si
- **[`UpdateProfileParams`](#tip-tanımları)** - Profil güncelleme parametreleri

## İlgili Hook'lar

- **[`useUserProfile`](../../presentation/hooks/useUserProfile.md)** - Profil verileri hook'u
- **[`useProfileUpdate`](../../presentation/hooks/useProfileUpdate.md)** - Profil güncelleme hook'u
