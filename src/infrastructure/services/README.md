# Auth Services

React Native Auth paketi için core servisler ve authentication işlevselliği.

## Servisler

- **[`AuthService`](./AuthService.ts)** - Ana authentication servisi
- **[`initializeAuth`](./initializeAuth.ts)** - Auth başlatma servisi
- **[`UserDocumentService`](./UserDocumentService.ts)** - Kullanıcı dokümanı servisi
- **[`AnonymousModeService`](./AnonymousModeService.ts)** - Anonymous mod servisi
- **[`AuthEventService`](./AuthEventService.ts)** - Auth event servisi

---

## AuthService

Ana authentication servisi. Firebase Authentication ile tüm auth işlemlerini yönetir.

### Kullanım

```typescript
import {
  AuthService,
  initializeAuthService,
  getAuthService
} from '@umituz/react-native-auth';

// Service başlatma
initializeAuthService({
  firebaseAuth: getAuth(),
});

// Service alma
const authService = getAuthService();

// Giriş yapma
await authService.signIn({ email, password });

// Kayıt olma
await authService.signUp({ email, password, displayName });

// Çıkış yapma
await authService.signOut();
```

### API

#### Methods

| Method | Parametreler | Açıklama |
|--------|--------------|----------|
| `signIn` | `{ email, password }` | Email/password ile giriş |
| `signUp` | `{ email, password, displayName? }` | Yeni kullanıcı kaydı |
| `signOut` | - | Çıkış yapma |
| `sendPasswordResetEmail` | `email` | Şifre sıfırlama email'i gönderme |

### Örnekler

#### Service Başlatma

```typescript
import { initializeAuthService } from '@umituz/react-native-auth';
import { getAuth } from 'firebase/auth';

function App() {
  useEffect(() => {
    const firebaseAuth = getAuth();

    initializeAuthService({
      firebaseAuth,
      onAuthStateChanged: (user) => {
        console.log('Auth state changed:', user);
      },
    });
  }, []);

  return <AppNavigator />;
}
```

#### Custom AuthService

```typescript
import { AuthService } from '@umituz/react-native-auth';

class CustomAuthService extends AuthService {
  async signInWithCustomToken(token: string) {
    // Custom implementation
    const userCredential = await signInWithCustomToken(
      this.firebaseAuth,
      token
    );

    await this.ensureUserDocument(userCredential.user);
    return userCredential.user;
  }
}

// Custom service kullanımı
const customService = new CustomAuthService({
  firebaseAuth: getAuth(),
});
```

---

## initializeAuth

Authentication sistemini başlatır. Firebase Auth listener'ını kurar ve user state'ini yönetir.

### Kullanım

```typescript
import { initializeAuth } from '@umituz/react-native-auth';

function App() {
  useEffect(() => {
    const init = async () => {
      await initializeAuth({
        onAuthStateChanged: (user) => {
          console.log('User:', user);
        },
      });
    };

    init();
  }, []);

  return <AppNavigator />;
}
```

### Options

```typescript
interface InitializeAuthOptions {
  onAuthStateChanged?: (user: AuthUser | null) => void;
  onAuthError?: (error: Error) => void;
}
```

### Örnekler

#### Basit Başlatma

```typescript
import { initializeAuth } from '@umituz/react-native-auth';

function App() {
  useEffect(() => {
    initializeAuth();
  }, []);

  return <Navigator />;
}
```

#### Callback ile Başlatma

```typescript
import { initializeAuth } from '@umituz/react-native-auth';

function App() {
  const navigation = useNavigation();

  useEffect(() => {
    initializeAuth({
      onAuthStateChanged: (user) => {
        if (user) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }
      },
      onAuthError: (error) => {
        console.error('Auth error:', error);
        Alert.alert('Auth Hatası', error.message);
      },
    });
  }, []);

  return <Navigator />;
}
```

---

## UserDocumentService

Firestore'da kullanıcı dokümanlarını yönetir.

### Kullanım

```typescript
import {
  ensureUserDocument,
  markUserDeleted,
  configureUserDocumentService
} from '@umituz/react-native-auth';

// Kullanıcı dokümanını garanti altına al
await ensureUserDocument(user);

// Kullanıcıyı silinmiş olarak işaretle
await markUserDeleted(user.uid);

// Service konfigürasyonu
configureUserDocumentService({
  collection: 'users',
  timestamps: true,
});
```

### API

| Method | Parametreler | Açıklama |
|--------|--------------|----------|
| `ensureUserDocument` | `user` | Kullanıcı dokümanını oluştur |
| `markUserDeleted` | `userId` | Kullanıcıyı silinmiş olarak işaretle |
| `configureUserDocumentService` | `config` | Service konfigürasyonu |

### Örnekler

#### Custom Konfigürasyon

```typescript
import { configureUserDocumentService } from '@umituz/react-native-auth';

configureUserDocumentService({
  collection: 'customers', // Varsayılan: 'users'
  timestamps: true,        // createdAt, updatedAt alanları ekle
  userData: {
    source: 'app',
    version: '1.0.0',
  },
});
```

#### Custom User Data

```typescript
import { ensureUserDocument } from '@umituz/react-native-auth';

const user = await signInWithGoogle();

await ensureUserDocument(user, {
  role: 'user',
  subscription: 'free',
  preferences: {
    newsletter: true,
    notifications: true,
  },
});
```

---

## AnonymousModeService

Anonymous kullanıcı modunu yönetir.

### Kullanım

```typescript
import { AnonymousModeService } from '@umituz/react-native-auth';

const anonymousService = new AnonymousModeService();

// Anonymous kullanıcı oluştur
const user = await anonymousService.signInAnonymously();

// Anonymous kullanıcıyı authenticated kullanıcısına yükselt
const credential = EmailAuthProvider.credential(email, password);
await user.linkWithCredential(credential);
```

---

## AuthEventService

Authentication event'lerini yönetir ve yayınlar.

### Kullanım

```typescript
import { AuthEventService } from '@umituz/react-native-auth';

const eventService = new AuthEventService();

// Event dinle
const unsubscribe = eventService.on('signIn', (user) => {
  console.log('User signed in:', user);
});

// Event tetikle
eventService.emit('signIn', user);

// Dinlemeyi bırak
unsubscribe();
```

### Event Türleri

| Event | Açıklama |
|-------|----------|
| `signIn` | Kullanıcı giriş yaptı |
| `signUp` | Yeni kullanıcı kayıt oldu |
| `signOut` | Kullanıcı çıkış yaptı |
| `authStateChanged` | Auth state değişti |

---

## Migration

Kullanıcı verilerini taşımak için utility:

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

---

## Storage Provider

Custom storage provider tanımlama:

```typescript
import {
  createStorageProvider,
  StorageProviderAdapter
} from '@umituz/react-native-auth';

// Custom storage provider
class CustomStorageAdapter implements StorageProviderAdapter {
  async getItem(key: string): Promise<string | null> {
    return await AsyncStorage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }
}

// Kullanımı
const storageProvider = createStorageProvider(new CustomStorageAdapter());
```

---

## Validation

Auth validasyon utility'leri:

```typescript
import {
  validateEmail,
  validatePasswordForLogin,
  validatePasswordForRegister,
  validatePasswordConfirmation,
  validateDisplayName
} from '@umituz/react-native-auth';

// Email validasyonu
const emailResult = validateEmail('test@example.com');
// { isValid: true }

// Şifre validasyonu (kayıt için)
const passwordResult = validatePasswordForRegister('MyPass123!');
// {
//   isValid: true,
//   requirements: { hasMinLength: true, hasUppercase: true, ... }
// }

// Şifre validasyonu (giriş için)
const loginPasswordResult = validatePasswordForLogin('password');
// { isValid: true }

// Şifre eşleşme validasyonu
const matchResult = validatePasswordConfirmation('password', 'password');
// { isValid: true, matches: true }

// DisplayName validasyonu
const nameResult = validateDisplayName('John Doe');
// { isValid: true }
```

---

## İlgili Modüller

- **[Domain](../../domain/README.md)** - Domain entities ve value objects
- **[Application](../../application/README.md)** - Application ports ve interfaces
- **[Hooks](../../presentation/hooks/README.md)** - React hooks
