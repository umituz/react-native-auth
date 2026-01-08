# Domain Layer

React Native Auth paketinin domain katmanı. İş kurallarını, domain entity'lerini ve value object'leri içerir.

## Yapı

```
domain/
├── entities/
│   ├── AuthUser.ts          # Authentication kullanıcısı
│   └── UserProfile.ts       # Kullanıcı profili
├── value-objects/
│   └── AuthConfig.ts        # Auth konfigürasyonu
├── errors/
│   └── AuthError.ts         # Auth hataları
└── utils/
    ├── anonymousNameGenerator.ts  # Anonymous isim oluşturucu
    └── migration.ts               # Veri taşıma
```

## Entities

### AuthUser

Authentication işlemleri için kullanıcı entity'si.

```typescript
import type { AuthUser } from '@umituz/react-native-auth';

const user: AuthUser = {
  uid: 'user-123',
  email: 'user@example.com',
  displayName: 'John Doe',
  photoURL: 'https://...',
  isAnonymous: false,
  provider: 'google',
  emailVerified: true,
};
```

**Özellikler:**
- Firebase User ile uyumlu
- Provider bilgisi
- Anonymous kontrolü
- Email verification durumu

**Kullanım:**
```typescript
function getUserDisplayName(user: AuthUser): string {
  return user.displayName || user.email || 'Anonymous';
}

function isSocialLogin(user: AuthUser): boolean {
  return user.provider === 'google' || user.provider === 'apple';
}
```

### UserProfile

Kullanıcı profili entity'si.

```typescript
import type { UserProfile } from '@umituz/react-native-auth';

const profile: UserProfile = {
  displayName: 'John Doe',
  photoURL: 'https://...',
  bio: 'Software developer',
  location: 'Istanbul',
  website: 'https://johndoe.com',
};
```

**Güncelleme:**
```typescript
async function updateProfile(userId: string, updates: UpdateProfileParams) {
  await updateDoc(doc(db, 'users', userId), updates);
}
```

## Value Objects

### AuthConfig

Authentication konfigürasyonu.

```typescript
import { AuthConfig, DEFAULT_AUTH_CONFIG } from '@umituz/react-native-auth';

const config: AuthConfig = {
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
  social: {
    google: {
      iosClientId: '...',
      webClientId: '...',
    },
    apple: {
      enabled: true,
    },
  },
};
```

## Errors

### AuthError Hierarchy

```typescript
import {
  AuthError,
  AuthInitializationError,
  AuthConfigurationError,
  AuthValidationError,
  AuthNetworkError,
  AuthUserNotFoundError,
  AuthWrongPasswordError,
  AuthEmailAlreadyInUseError,
  AuthWeakPasswordError,
  AuthInvalidEmailError,
} from '@umituz/react-native-auth';
```

**Hata Yakalama:**
```typescript
try {
  await signIn({ email, password });
} catch (error) {
  if (error instanceof AuthUserNotFoundError) {
    // Kullanıcı bulunamadı
  } else if (error instanceof AuthWrongPasswordError) {
    // Şifre hatalı
  } else if (error instanceof AuthNetworkError) {
    // Network hatası
  }
}
```

## Utils

### Anonymous Name Generator

Anonymous kullanıcılar için rastgele isim oluşturur.

```typescript
import {
  generateAnonymousName,
  getAnonymousDisplayName
} from '@umituz/react-native-auth';

const name1 = generateAnonymousName('user-123');
// "User_Witty_Badger_1234"

const name2 = generateAnonymousName('user-456', {
  prefix: 'Guest',
  adjectiveCount: 1,
  nounCount: 1,
});
// "Guest_Clever_Fox_456"

const displayName = getAnonymousDisplayName('user-123');
// "Witty Badger"
```

**Konfigürasyon:**
```typescript
interface AnonymousNameConfig {
  prefix?: string;           // Varsayılan: 'User'
  adjectiveCount?: number;   // Varsayılan: 2
  nounCount?: number;        // Varsayılan: 1
  showNumbers?: boolean;     // Varsayılan: true
}
```

### Migration

Kullanıcı verilerini taşımak için utility.

```typescript
import { migrateUserData, configureMigration } from '@umituz/react-native-auth';

// Migration konfigürasyonu
configureMigration({
  from: 'legacy_users',
  to: 'users',
  transform: (legacyData) => ({
    displayName: legacyData.name,
    email: legacyData.email_address,
    createdAt: legacyData.joined_at,
  }),
});

// Migration çalıştırma
await migrateUserData(userId);
```

**Tam Örnek:**
```typescript
async function migrateLegacyUser(userId: string) {
  configureMigration({
    from: 'old_users_collection',
    to: 'users',
    transform: (old) => ({
      displayName: old.full_name,
      email: old.email_addr,
      photoURL: old.profile_pic,
      createdAt: old.created_at,
      metadata: {
        migratedFrom: 'legacy',
        migratedAt: Date.now(),
      },
    }),
  });

  try {
    await migrateUserData(userId);
    console.log('Migration successful');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}
```

## Type Guards

Domain type'ları için guard'lar:

```typescript
function isAuthenticatedUser(user: AuthUser | null): user is AuthUser {
  return user !== null && !user.isAnonymous;
}

function isEmailVerified(user: AuthUser): boolean {
  return !!user.emailVerified;
}

function hasProvider(user: AuthUser, provider: string): boolean {
  return user.provider === provider;
}
```

## Domain Services

### User Validation

```typescript
function validateUserForRegistration(user: Partial<AuthUser>): ValidationResult {
  const errors: string[] = [];

  if (!user.email) {
    errors.push('Email is required');
  }

  if (!user.displayName || user.displayName.length < 2) {
    errors.push('Display name must be at least 2 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
```

## Domain Rules

1. **AuthUser Rules:**
   - Her kullanıcının unique bir `uid`'si olmalı
   - Anonymous kullanıcıların `email`'i yoktur
   - Social login kullanıcıları provider bilgisi taşır

2. **UserProfile Rules:**
   - `displayName` en az 2 karakter olmalı
   - `email` geçerli formatta olmalı
   - `photoURL` geçerli URL olmalı

3. **Password Rules:**
   - Minimum 8 karakter
   - En az 1 büyük harf
   - En az 1 küçük harf
   - En az 1 rakam
   - En az 1 özel karakter

## İlgili Modüller

- **[Application](../application/README.md)** - Application ports
- **[Infrastructure](../infrastructure/README.md)** - Infrastructure implementation
- **[Presentation](../presentation/README.md)** - UI components ve hooks
