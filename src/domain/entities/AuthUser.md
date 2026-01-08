# AuthUser Entity

Authentication için provider-agnostic kullanıcı entity'si. Firebase User ile uyumlu, ancak herhangi bir auth provider ile kullanılabilir.

## Tip Tanımı

```typescript
import type { AuthUser, AuthProviderType } from '@umituz/react-native-auth';

interface AuthUser {
  uid: string;                    // Unique kullanıcı ID'si
  email: string | null;           // Email adresi (anonymous'da null)
  displayName: string | null;     // Görünen ad
  isAnonymous: boolean;           // Anonymous kullanıcı mı
  emailVerified: boolean;         // Email doğrulanmış mı
  photoURL: string | null;        // Profil fotoğrafı URL'si
  provider: AuthProviderType;     // Auth provider tipi
}

type AuthProviderType =
  | "google.com"      // Google ile giriş
  | "apple.com"       // Apple ile giriş
  | "password"        // Email/password ile giriş
  | "anonymous"       // Anonymous kullanıcı
  | "unknown";        // Bilinmeyen provider
```

## Örnekler

### Email/Password Kullanıcısı

```typescript
const emailUser: AuthUser = {
  uid: 'user-123',
  email: 'john@example.com',
  displayName: 'John Doe',
  isAnonymous: false,
  emailVerified: true,
  photoURL: null,
  provider: 'password',
};
```

### Google Kullanıcısı

```typescript
const googleUser: AuthUser = {
  uid: 'google-456',
  email: 'jane@gmail.com',
  displayName: 'Jane Smith',
  isAnonymous: false,
  emailVerified: true,
  photoURL: 'https://lh3.googleusercontent.com/...',
  provider: 'google.com',
};
```

### Apple Kullanıcısı

```typescript
const appleUser: AuthUser = {
  uid: 'apple-789',
  email: 'user@icloud.com',
  displayName: 'Apple User',
  isAnonymous: false,
  emailVerified: true,
  photoURL: null,
  provider: 'apple.com',
};
```

### Anonymous Kullanıcı

```typescript
const anonymousUser: AuthUser = {
  uid: 'anon-abc',
  email: null,
  displayName: null,
  isAnonymous: true,
  emailVerified: false,
  photoURL: null,
  provider: 'anonymous',
};
```

## Kullanım

### Firebase User'dan AuthUser'a Dönüşüm

```typescript
import { getAuth } from 'firebase/auth';
import type { AuthUser } from '@umituz/react-native-auth';

function firebaseUserToAuthUser(firebaseUser: FirebaseUser): AuthUser {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    isAnonymous: firebaseUser.isAnonymous,
    emailVerified: firebaseUser.emailVerified,
    photoURL: firebaseUser.photoURL,
    provider: firebaseUser.providerData[0]?.providerId || 'unknown',
  };
}

// Kullanım
const auth = getAuth();
const firebaseUser = auth.currentUser;
if (firebaseUser) {
  const user: AuthUser = firebaseUserToAuthUser(firebaseUser);
  console.log(user.displayName);
}
```

### DisplayName Alma

```typescript
function getUserDisplayName(user: AuthUser): string {
  // Önce displayName'i dene
  if (user.displayName) {
    return user.displayName;
  }

  // Yoksa email'i kullan
  if (user.email) {
    // Email'den isim çıkar
    const name = user.email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  // Hiçbiri yoksa varsayılan
  return 'Kullanıcı';
}

// Kullanım
const name = getUserDisplayName(user);
console.log(name); // "John" veya "Johndoe"
```

### Provider Kontrolü

```typescript
function isSocialLogin(user: AuthUser): boolean {
  return user.provider === 'google.com' || user.provider === 'apple.com';
}

function isEmailPasswordUser(user: AuthUser): boolean {
  return user.provider === 'password';
}

function canChangePassword(user: AuthUser): boolean {
  // Sadece email/password kullanıcıları şifre değiştirebilir
  return user.provider === 'password';
}

// Kullanım
if (isSocialLogin(user)) {
  console.log('Social login ile giriş yaptı');
}

if (canChangePassword(user)) {
  // Şifre değiştirme butonunu göster
}
```

### Email Doğrulama Kontrolü

```typescript
function requireEmailVerification(user: AuthUser): void {
  if (user.provider === 'password' && !user.emailVerified) {
    throw new Error('Email doğrulanması gerekiyor');
  }
}

function shouldShowVerifyEmailBanner(user: AuthUser): boolean {
  return (
    !user.isAnonymous &&
    user.provider === 'password' &&
    !user.emailVerified
  );
}
```

### Avatar URL Alma

```typescript
function getUserAvatar(user: AuthUser): string | null {
  // Önce photoURL'yi dene
  if (user.photoURL) {
    return user.photoURL;
  }

  // Anonymous ise null döndür
  if (user.isAnonymous) {
    return null;
  }

  // Default avatar oluştur (örn: UI Avatars)
  if (user.email) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}&background=random`;
  }

  return null;
}
```

### User İsim Oluşturma

```typescript
function getUserInitials(user: AuthUser): string {
  if (user.displayName) {
    const names = user.displayName.trim().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  }

  if (user.email) {
    return user.email[0].toUpperCase();
  }

  return '?';
}

// Kullanım
const initials = getUserInitials(user);
console.log(initials); // "JD" veya "J" veya "?"
```

## Type Guards

```typescript
function isAuthenticatedUser(user: AuthUser | null): user is AuthUser {
  return user !== null && !user.isAnonymous;
}

function isAnonymousUser(user: AuthUser | null): user is AuthUser {
  return user !== null && user.isAnonymous;
}

function hasEmail(user: AuthUser | null): user is AuthUser {
  return user !== null && user.email !== null;
}

// Kullanım
if (isAuthenticatedUser(user)) {
  // TypeScript burada user'ın AuthUser olduğunu bilir
  console.log(user.email);
}
```

## Firebase ile Entegrasyon

### Auth State Değişikliği Dinleme

```typescript
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import type { AuthUser } from '@umituz/react-native-auth';

function useAuthUser() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const authUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          isAnonymous: firebaseUser.isAnonymous,
          emailVerified: firebaseUser.emailVerified,
          photoURL: firebaseUser.photoURL,
          provider: firebaseUser.providerData[0]?.providerId || 'unknown',
        };
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  return user;
}
```

### User Meta Verileri

```typescript
interface ExtendedAuthUser extends AuthUser {
  createdAt?: number;
  lastSignInAt?: number;
  metadata?: {
    lastSignInTime?: string;
    creationTime?: string;
  };
}

function enrichAuthUser(user: AuthUser, firebaseUser: FirebaseUser): ExtendedAuthUser {
  return {
    ...user,
    metadata: {
      lastSignInTime: firebaseUser.metadata.lastSignInTime,
      creationTime: firebaseUser.metadata.creationTime,
    },
  };
}
```

## Validasyon

### User Validasyonu

```typescript
function validateAuthUser(user: AuthUser): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!user.uid || user.uid.length === 0) {
    errors.push('User ID is required');
  }

  if (!user.isAnonymous && !user.email) {
    errors.push('Email is required for non-anonymous users');
  }

  if (user.email && !isValidEmail(user.email)) {
    errors.push('Invalid email format');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

## Testler

### Mock User Oluşturma

```typescript
function createMockAuthUser(overrides?: Partial<AuthUser>): AuthUser {
  return {
    uid: 'mock-user-123',
    email: 'mock@example.com',
    displayName: 'Mock User',
    isAnonymous: false,
    emailVerified: true,
    photoURL: null,
    provider: 'password',
    ...overrides,
  };
}

// Testlerde kullanım
const mockUser = createMockAuthUser({
  provider: 'google.com',
  photoURL: 'https://example.com/avatar.jpg',
});
```

## İlgili Entity'ler

- **[`UserProfile`](./UserProfile.md)** - Kullanıcı profili entity'si
- **[`AuthError`](../errors/AuthError.md)** - Auth hataları

## İlgili Type'lar

- **[`AuthProviderType`](#tip-tanımı)** - Provider tipi
- **[`UpdateProfileParams`](../UserProfile.md)** - Profil güncelleme parametreleri
