# useAuthBottomSheet

Authentication bottom sheet yönetimi için hook. Login/Register modal'ını göstermek, yönetmek ve social authentication işlemlerini gerçekleştirmek için kullanılır.

## Özellikler

- Bottom sheet modal yönetimi
- Login/Register mod değiştirme
- Social authentication entegrasyonu
- Otomatik kapanma (başarılı authentication sonrası)
- Pending callback yönetimi

## Kullanım

```typescript
import { useAuthBottomSheet } from '@umituz/react-native-auth';
import { BottomSheetModal } from '@umituz/react-native-design-system';

function AuthBottomSheet() {
  const {
    modalRef,
    mode,
    providers,
    googleLoading,
    appleLoading,
    handleDismiss,
    handleClose,
    handleNavigateToRegister,
    handleNavigateToLogin,
    handleGoogleSignIn,
    handleAppleSignIn,
  } = useAuthBottomSheet({
    socialConfig: {
      google: {
        iosClientId: 'your-ios-client-id',
        webClientId: 'your-web-client-id',
      },
      apple: { enabled: true },
    },
  });

  return (
    <BottomSheetModal ref={modalRef} onDismiss={handleDismiss}>
      {mode === 'login' ? (
        <LoginForm
          onRegisterPress={handleNavigateToRegister}
          onGoogleSignIn={handleGoogleSignIn}
          onAppleSignIn={handleAppleSignIn}
          googleLoading={googleLoading}
          appleLoading={appleLoading}
        />
      ) : (
        <RegisterForm
          onLoginPress={handleNavigateToLogin}
          onGoogleSignIn={handleGoogleSignIn}
          onAppleSignIn={handleAppleSignIn}
          googleLoading={googleLoading}
          appleLoading={appleLoading}
        />
      )}
    </BottomSheetModal>
  );
}
```

## API

### Parameters

| Param | Tip | Required | Açıklama |
|-------|------|----------|----------|
| `socialConfig` | `SocialAuthConfiguration` | No | Social auth konfigürasyonu |
| `onGoogleSignIn` | `() => Promise<void>` | No | Custom Google sign-in handler |
| `onAppleSignIn` | `() => Promise<void>` | No | Custom Apple sign-in handler |

#### SocialAuthConfiguration

```typescript
interface SocialAuthConfiguration {
  google?: GoogleAuthConfig;
  apple?: { enabled: boolean };
}
```

### Return Value

| Prop | Tip | Açıklama |
|------|-----|----------|
| `modalRef` | `RefObject<BottomSheetModalRef>` | Bottom sheet modal referansı |
| `mode` | `'login' \| 'register'` | Mevcut mod |
| `providers` | `SocialAuthProvider[]` | Mevcut social provider'lar |
| `googleLoading` | `boolean` | Google loading durumu |
| `appleLoading` | `boolean` | Apple loading durumu |
| `handleDismiss` | `() => void` | Modal'ı kapatma (dismiss) |
| `handleClose` | `() => void` | Modal'ı kapatma ve temizleme |
| `handleNavigateToRegister` | `() => void` | Register moduna geçiş |
| `handleNavigateToLogin` | `() => void` | Login moduna geçiş |
| `handleGoogleSignIn` | `() => Promise<void>` | Google ile giriş |
| `handleAppleSignIn` | `() => Promise<void>` | Apple ile giriş |

## Örnekler

### Basit Auth Bottom Sheet

```typescript
function AuthModal() {
  const {
    modalRef,
    mode,
    handleDismiss,
    handleNavigateToRegister,
    handleNavigateToLogin,
  } = useAuthBottomSheet();

  return (
    <BottomSheetModal ref={modalRef} snapPoints={['80%']} onDismiss={handleDismiss}>
      <View>
        {mode === 'login' ? (
          <>
            <Text>Giriş Yap</Text>
            <LoginForm />
            <Button onPress={handleNavigateToRegister}>
              Hesabınız yok mu? Kayıt Olun
            </Button>
          </>
        ) : (
          <>
            <Text>Kayıt Ol</Text>
            <RegisterForm />
            <Button onPress={handleNavigateToLogin}>
              Zaten hesabınız var mı? Giriş Yapın
            </Button>
          </>
        )}
      </View>
    </BottomSheetModal>
  );
}
```

### Social Login ile

```typescript
function AuthBottomSheetWithSocial() {
  const {
    modalRef,
    mode,
    providers,
    googleLoading,
    appleLoading,
    handleDismiss,
    handleNavigateToRegister,
    handleNavigateToLogin,
    handleGoogleSignIn,
    handleAppleSignIn,
  } = useAuthBottomSheet({
    socialConfig: {
      google: {
        webClientId: Config.GOOGLE_WEB_CLIENT_ID,
        iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
      },
      apple: { enabled: Platform.OS === 'ios' },
    },
  });

  return (
    <BottomSheetModal ref={modalRef} snapPoints={['90%']} onDismiss={handleDismiss}>
      <View>
        {mode === 'login' ? (
          <>
            <LoginForm />

            {/* Social login buttons */}
            {providers.includes('google') && (
              <SocialButton
                provider="google"
                onPress={handleGoogleSignIn}
                loading={googleLoading}
              />
            )}

            {providers.includes('apple') && (
              <SocialButton
                provider="apple"
                onPress={handleAppleSignIn}
                loading={appleLoading}
              />
            )}

            <Button onPress={handleNavigateToRegister}>
              Kayıt Ol
            </Button>
          </>
        ) : (
          <>
            <RegisterForm />

            {/* Social login buttons */}
            {providers.includes('google') && (
              <SocialButton
                provider="google"
                onPress={handleGoogleSignIn}
                loading={googleLoading}
              />
            )}

            {providers.includes('apple') && (
              <SocialButton
                provider="apple"
                onPress={handleAppleSignIn}
                loading={appleLoading}
              />
            )}

            <Button onPress={handleNavigateToLogin}>
              Giriş Yap
            </Button>
          </>
        )}
      </View>
    </BottomSheetModal>
  );
}
```

### Custom Social Login Handlers

```typescript
function AuthBottomSheetWithCustomHandlers() {
  const { showAuthModal } = useAuthModalStore();

  const handleCustomGoogleSignIn = async () => {
    try {
      // Custom Google sign-in logic
      const result = await customGoogleSignInFlow();

      if (result.success) {
        // Başarılı authentication sonrası modal otomatik kapanır
        console.log('Google ile giriş başarılı');
      }
    } catch (error) {
      Alert.alert('Hata', 'Google ile giriş başarısız');
    }
  };

  const handleCustomAppleSignIn = async () => {
    try {
      // Custom Apple sign-in logic
      const result = await customAppleSignInFlow();

      if (result.success) {
        console.log('Apple ile giriş başarılı');
      }
    } catch (error) {
      Alert.alert('Hata', 'Apple ile giriş başarısız');
    }
  };

  const {
    modalRef,
    mode,
    googleLoading,
    appleLoading,
    handleDismiss,
    handleNavigateToRegister,
    handleNavigateToLogin,
    handleGoogleSignIn,
    handleAppleSignIn,
  } = useAuthBottomSheet({
    onGoogleSignIn: handleCustomGoogleSignIn,
    onAppleSignIn: handleCustomAppleSignIn,
  });

  return (
    <BottomSheetModal ref={modalRef} onDismiss={handleDismiss}>
      {/* Auth form content */}
    </BottomSheetModal>
  );
}
```

### Auth Modal Tetikleme

```typescript
function RequireAuthButton() {
  const { showAuthModal } = useAuthModalStore();
  const { isAuthenticated } = useAuth();

  const handlePress = () => {
    if (!isAuthenticated) {
      // Login modal'ını göster
      showAuthModal(undefined, 'login');
      return;
    }

    // Auth gerektiren işlemi yap
    console.log('İşlem başarılı');
  };

  return (
    <Button onPress={handlePress}>
      Auth Gerektiren İşlem
    </Button>
  );
}
```

### Pending Callback ile

```typescript
function AddToFavoritesButton() {
  const { showAuthModal } = useAuthModalStore();
  const { isAuthenticated } = useAuth();

  const handleAddToFavorites = async () => {
    if (!isAuthenticated) {
      // Authentication sonrası çalışacak callback'i kaydet
      showAuthModal(async () => {
        await addToFavorites(postId);
        Alert.alert('Başarılı', 'Favorilere eklendi');
      }, 'login');
      return;
    }

    // Kullanıcı authenticated, doğrudan işlemi yap
    await addToFavorites(postId);
    Alert.alert('Başarılı', 'Favorilere eklendi');
  };

  return (
    <Button onPress={handleAddToFavorites}>
      Favorilere Ekle
    </Button>
  );
}
```

## Otomatik Kapanma

Hook, başarılı authentication sonrası otomatik olarak modal'ı kapatır:

- **Authenticated olmadan authenticated olmaya**: Kullanıcı giriş yaptığında
- **Anonymous'den authenticated olmaya**: Anonymous kullanıcı kayıt olduğunda

```typescript
// Kullanıcı giriş yapar
// → useAuth store güncellenir
// → useAuthBottomSheet bunu tespit eder
// → Modal otomatik kapanır
// → Pending callback çalıştırılır
```

## Provider Kontrolü

Hook hangi provider'ların mevcut olduğunu otomatik belirler:

```typescript
const { providers } = useAuthBottomSheet({
  socialConfig: {
    google: { webClientId: '...' },
    apple: { enabled: true },
  },
});

// iOS: ['apple', 'google'] veya ['google']
// Android: ['google']
// Web: ['google']
```

## Hata Yönetimi

```typescript
function AuthBottomSheetWithErrorHandling() {
  const {
    modalRef,
    mode,
    handleGoogleSignIn,
    handleAppleSignIn,
  } = useAuthBottomSheet({
    socialConfig: {
      google: { webClientId: Config.GOOGLE_WEB_CLIENT_ID },
      apple: { enabled: true },
    },
  });

  const handleGoogleSignInWithErrorHandling = async () => {
    try {
      await handleGoogleSignIn();
      // Hook hata yönetimini içeride yapar
    } catch (error) {
      // Additional error handling if needed
      Alert.alert('Hata', 'Bir sorun oluştu');
    }
  };

  return (
    <BottomSheetModal ref={modalRef}>
      <Button onPress={handleGoogleSignInWithErrorHandling}>
        Google ile Giriş
      </Button>
    </BottomSheetModal>
  );
}
```

## İlgili Component'ler

- [`AuthBottomSheet`](../components/AuthBottomSheet.md) - Bottom sheet component'i
- [`useAuthModalStore`](../stores/authModalStore.md) - Auth modal state store'u
- [`LoginForm`](../components/LoginForm.md) - Login form component'i
- [`RegisterForm`](../components/RegisterForm.md) - Register form component'i

## İlgili Hook'lar

- [`useGoogleAuth`](./useSocialLogin.md#usegoogleauth) - Google auth hook'u
- [`useAppleAuth`](./useSocialLogin.md#useappleauth) - Apple auth hook'u
- [`useAuth`](./useAuth.md) - Ana auth state yönetimi
