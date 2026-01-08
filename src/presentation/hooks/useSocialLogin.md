# Social Login Hooks

Google ve Apple ile social authentication işlemleri için hooks.

## Hooks

- **[`useSocialLogin`](#usesociallogin)** - Genel social login yönetimi
- **[`useGoogleAuth`](#usegoogleauth)** - Google ile giriş (OAuth flow)
- **[`useAppleAuth`](#useappleauth)** - Apple ile giriş

---

## useSocialLogin

Genel social login işlevselliği sağlar. `@umituz/react-native-firebase` paketinin `useSocialAuth` hook'unu wrap'ler.

### Kullanım

```typescript
import { useSocialLogin } from '@umituz/react-native-auth';

function LoginScreen() {
  const {
    signInWithGoogle,
    signInWithApple,
    googleLoading,
    appleLoading,
    googleConfigured,
    appleAvailable,
  } = useSocialLogin({
    google: {
      webClientId: 'your-web-client-id.apps.googleusercontent.com',
      iosClientId: 'your-ios-client-id.apps.googleusercontent.com',
    },
    apple: { enabled: true },
  });

  return (
    <View>
      <Button
        onPress={signInWithGoogle}
        disabled={googleLoading || !googleConfigured}
      >
        {googleLoading ? 'Giriş yapılıyor...' : 'Google ile Giriş'}
      </Button>

      <Button
        onPress={signInWithApple}
        disabled={appleLoading || !appleAvailable}
      >
        {appleLoading ? 'Giriş yapılıyor...' : 'Apple ile Giriş'}
      </Button>
    </View>
  );
}
```

### API

#### Parameters

| Param | Tip | Açıklama |
|-------|------|----------|
| `config` | `UseSocialLoginConfig` | Social auth konfigürasyonu |

#### UseSocialLoginConfig

```typescript
interface UseSocialLoginConfig {
  google?: {
    iosClientId?: string;
    webClientId?: string;
    androidClientId?: string;
  };
  apple?: {
    enabled: boolean;
  };
}
```

#### Return Value

| Prop | Tip | Açıklama |
|------|-----|----------|
| `signInWithGoogle` | `() => Promise<SocialAuthResult>` | Google ile giriş (Not: `useGoogleAuth` kullanın) |
| `signInWithApple` | `() => Promise<SocialAuthResult>` | Apple ile giriş |
| `googleLoading` | `boolean` | Google giriş loading durumu |
| `appleLoading` | `boolean` | Apple giriş loading durumu |
| `googleConfigured` | `boolean` | Google yapılandırılmış mı |
| `appleAvailable` | `boolean` | Apple mevcut mu (sadece iOS) |

**Not:** `signInWithGoogle` için tam OAuth flow'u `useGoogleAuth` hook'unu kullanın.

---

## useGoogleAuth

Google OAuth flow'unu `expo-auth-session` kullanarak yönetir ve Firebase authentication ile entegre eder.

### Kullanım

```typescript
import { useGoogleAuth } from '@umituz/react-native-auth';

function LoginScreen() {
  const { signInWithGoogle, googleLoading, googleConfigured } = useGoogleAuth({
    iosClientId: 'your-ios-client-id.apps.googleusercontent.com',
    webClientId: 'your-web-client-id.apps.googleusercontent.com',
    androidClientId: 'your-android-client-id.apps.googleusercontent.com',
  });

  const handleGoogleSignIn = async () => {
    const result = await signInWithGoogle();

    if (result.success) {
      console.log('Google ile giriş başarılı');
    } else {
      Alert.alert('Hata', result.error || 'Giriş başarısız');
    }
  };

  return (
    <Button
      onPress={handleGoogleSignIn}
      disabled={googleLoading || !googleConfigured}
    >
      {googleLoading ? 'Giriş yapılıyor...' : 'Google ile Giriş'}
    </Button>
  );
}
```

### API

#### Parameters

| Param | Tip | Required | Açıklama |
|-------|------|----------|----------|
| `iosClientId` | `string` | No* | iOS için Google Client ID |
| `webClientId` | `string` | No* | Web için Google Client ID |
| `androidClientId` | `string` | No* | Android için Google Client ID |

*En az biri sağlanmalıdır.

#### Return Value

| Prop | Tip | Açıklama |
|------|-----|----------|
| `signInWithGoogle` | `() => Promise<SocialAuthResult>` | Google ile giriş fonksiyonu |
| `googleLoading` | `boolean` | Loading durumu |
| `googleConfigured` | `boolean` | Yapılandırılmış mı |

### Örnekler

#### Google ile Giriş Ekranı

```typescript
function SocialLoginScreen() {
  const { signInWithGoogle, googleLoading } = useGoogleAuth({
    iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
    webClientId: Config.GOOGLE_WEB_CLIENT_ID,
  });

  const { signInWithApple, appleLoading, appleAvailable } = useAppleAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giriş Yap</Text>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={signInWithGoogle}
        disabled={googleLoading}
      >
        {googleLoading ? (
          <ActivityIndicator />
        ) : (
          <>
            <GoogleIcon />
            <Text>Google ile devam et</Text>
          </>
        )}
      </TouchableOpacity>

      {Platform.OS === 'ios' && appleAvailable && (
        <TouchableOpacity
          style={styles.appleButton}
          onPress={signInWithApple}
          disabled={appleLoading}
        >
          {appleLoading ? (
            <ActivityIndicator />
          ) : (
            <>
              <AppleIcon />
              <Text>Apple ile devam et</Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}
```

#### Hata Yönetimi

```typescript
function LoginWithErrorHandling() {
  const { signInWithGoogle, googleLoading } = useGoogleAuth({
    webClientId: Config.GOOGLE_WEB_CLIENT_ID,
  });

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();

      if (result.success) {
        // Başarılı giriş
        navigation.navigate('Home');
      } else {
        // Hata durumunda
        if (result.error?.includes('cancelled')) {
          // Kullanıcı iptal etti
          return;
        }

        Alert.alert(
          'Giriş Hatası',
          result.error || 'Google ile giriş yapılamadı'
        );
      }
    } catch (error) {
      Alert.alert(
        'Beklenmeyen Hata',
        'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
      );
    }
  };

  return <Button onPress={handleGoogleSignIn} />;
}
```

---

## useAppleAuth

Apple Sign-In işlevselliği sağlar. Sadece iOS'ta mevcuttur.

### Kullanım

```typescript
import { useAppleAuth } from '@umituz/react-native-auth';
import { Platform } from 'react-native';

function LoginScreen() {
  const { signInWithApple, appleLoading, appleAvailable } = useAppleAuth();

  if (Platform.OS !== 'ios' || !appleAvailable) {
    return null; // Apple sadece iOS'ta çalışır
  }

  return (
    <TouchableOpacity
      onPress={signInWithApple}
      disabled={appleLoading}
      style={styles.appleButton}
    >
      {appleLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          <AppleIcon />
          <Text>Apple ile Giriş</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
```

### API

#### Return Value

| Prop | Tip | Açıklama |
|------|-----|----------|
| `signInWithApple` | `() => Promise<SocialAuthResult>` | Apple ile giriş fonksiyonu |
| `appleLoading` | `boolean` | Loading durumu |
| `appleAvailable` | `boolean` | Apple Sign-In mevcut mu (iOS only) |

### Örnekler

#### Platform-Specific Apple Button

```typescript
function SocialLoginButtons() {
  const { signInWithApple, appleLoading, appleAvailable } = useAppleAuth();
  const { signInWithGoogle, googleLoading } = useGoogleAuth({
    webClientId: Config.GOOGLE_WEB_CLIENT_ID,
  });

  return (
    <View>
      {/* Google - tüm platformlar */}
      <SocialButton
        provider="google"
        onPress={signInWithGoogle}
        loading={googleLoading}
      />

      {/* Apple - sadece iOS */}
      {Platform.OS === 'ios' && appleAvailable && (
        <SocialButton
          provider="apple"
          onPress={signInWithApple}
          loading={appleLoading}
        />
      )}
    </View>
  );
}
```

#### Apple ile Giriş ve Hata Yönetimi

```typescript
function AppleLoginButton() {
  const { signInWithApple, appleLoading, appleAvailable } = useAppleAuth();

  const handleAppleSignIn = async () => {
    const result = await signInWithApple();

    if (result.success) {
      console.log('Apple ile giriş başarılı');
      // Kullanıcıyı ana ekrana yönlendir
    } else {
      // Hata yönetimi
      if (result.error?.includes('cancelled')) {
        console.log('Kullanıcı iptal etti');
      } else {
        Alert.alert('Hata', result.error || 'Apple ile giriş yapılamadı');
      }
    }
  };

  if (!appleAvailable) {
    return null;
  }

  return (
    <TouchableOpacity onPress={handleAppleSignIn} disabled={appleLoading}>
      <Text>Apple ile Giriş</Text>
    </TouchableOpacity>
  );
}
```

## SocialAuthResult

Tüm social login fonksiyonları aynı result tipini döner:

```typescript
interface SocialAuthResult {
  success: boolean;
  error?: string;
  user?: AuthUser;
}
```

## Konfigürasyon

### Google Client ID Almak

1. [Google Cloud Console](https://console.cloud.google.com/)'a gidin
2. Yeni bir proje oluşturun veya mevcut projeyi seçin
3. "APIs & Services" > "Credentials" sayfasına gidin
4. "OAuth 2.0 Client IDs" oluşturun:
   - **iOS**: iOS uygulamanız için
   - **Android**: Android uygulamanız için
   - **Web**: Expo/web için

### Apple Sign-In Konfigürasyonu

1. [Apple Developer](https://developer.apple.com/)'da gidin
2. "Certificates, Identifiers & Profiles" > "Identifiers"
3. App ID'nizi seçin ve "Sign In with Apple"ı enable edin
4. Firebase Console'da Apple Sign-In'i enable edin

## Önemli Notlar

### Google
- `expo-web-browser` kurulumu gerekir
- `WebBrowser.maybeCompleteAuthSession()` app root'ta çağrılmalı
- En az bir client ID sağlanmalıdır

### Apple
- Sadece iOS'ta mevcuttur
- `expo-apple-authentication` kurulumu gerekir
- Apple Developer hesabı gerekir
- Test için cihaz gereklidir (simulator'de çalışmayabilir)

## İlgili Hook'lar

- [`useAuth`](./useAuth.md) - Ana auth state yönetimi
- [`useSocialLogin`](#usesociallogin) - Genel social login yönetimi

## İlgili Component'ler

- [`SocialLoginButtons`](../components/SocialLoginButtons.md) - Social login button component'i
