# SocialLoginButtons

Google ve Apple ile social login button'larını gösteren component.

## Özellikler

- ✅ Google ve Apple login button'ları
- ✅ Loading states
- ✅ Disabled states
- ✅ Platform check (Apple sadece iOS)
- ✅ Localisation desteği
- ✅ Design system uyumlu

## Kullanım

```typescript
import { SocialLoginButtons } from '@umituz/react-native-auth';

function LoginScreen() {
  const { signInWithGoogle, googleLoading } = useGoogleAuth({
    webClientId: 'your-client-id',
  });

  const { signInWithApple, appleLoading } = useAppleAuth();

  return (
    <View>
      <LoginForm />

      <SocialLoginButtons
        enabledProviders={['google', 'apple']}
        onGooglePress={signInWithGoogle}
        onApplePress={signInWithApple}
        googleLoading={googleLoading}
        appleLoading={appleLoading}
      />
    </View>
  );
}
```

## Props

| Prop | Tip | Required | Default | Açıklama |
|------|-----|----------|---------|----------|
| `enabledProviders` | `SocialAuthProvider[]` | Yes | - | Aktif provider'lar |
| `onGooglePress` | `() => void` | No | - | Google butonu handler |
| `onApplePress` | `() => void` | No | - | Apple butonu handler |
| `googleLoading` | `boolean` | No | `false` | Google loading durumu |
| `appleLoading` | `boolean` | No | `false` | Apple loading durumu |
| `disabled` | `boolean` | No | `false` | Tüm butonları disable et |

### SocialAuthProvider

```typescript
type SocialAuthProvider = 'google' | 'apple';
```

## Örnekler

### Sadece Google

```typescript
function LoginScreen() {
  const { signInWithGoogle, googleLoading } = useGoogleAuth({
    webClientId: Config.GOOGLE_WEB_CLIENT_ID,
  });

  return (
    <View>
      <LoginForm />

      <SocialLoginButtons
        enabledProviders={['google']}
        onGooglePress={signInWithGoogle}
        googleLoading={googleLoading}
      />
    </View>
  );
}
```

### Google ve Apple (iOS)

```typescript
function LoginScreen() {
  const { signInWithGoogle, googleLoading } = useGoogleAuth({
    iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
  });

  const { signInWithApple, appleLoading } = useAppleAuth();

  return (
    <View>
      <LoginForm />

      <SocialLoginButtons
        enabledProviders={['google', 'apple']}
        onGooglePress={signInWithGoogle}
        onApplePress={signInWithApple}
        googleLoading={googleLoading}
        appleLoading={appleLoading}
      />
    </View>
  );
}
```

### Platform-Specific Providers

```typescript
function LoginScreen() {
  const { signInWithGoogle, googleLoading } = useGoogleAuth({
    webClientId: Config.GOOGLE_WEB_CLIENT_ID,
  });

  const { signInWithApple, appleLoading, appleAvailable } = useAppleAuth();

  // Sadece mevcut provider'ları göster
  const enabledProviders = ['google'];
  if (appleAvailable) {
    enabledProviders.push('apple');
  }

  return (
    <View>
      <SocialLoginButtons
        enabledProviders={enabledProviders}
        onGooglePress={signInWithGoogle}
        onApplePress={signInWithApple}
        googleLoading={googleLoading}
        appleLoading={appleLoading}
      />
    </View>
  );
}
```

### Custom Handlers

```typescript
function LoginScreen() {
  const navigation = useNavigation();

  const handleGoogleSignIn = async () => {
    try {
      const result = await customGoogleSignIn();

      if (result.success) {
        navigation.navigate('Home');
      } else {
        Alert.alert('Hata', result.error);
      }
    } catch (error) {
      Alert.alert('Hata', 'Bir sorun oluştu');
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const result = await customAppleSignIn();

      if (result.success) {
        navigation.navigate('Home');
      } else {
        Alert.alert('Hata', result.error);
      }
    } catch (error) {
      Alert.alert('Hata', 'Bir sorun oluştu');
    }
  };

  return (
    <View>
      <SocialLoginButtons
        enabledProviders={['google', 'apple']}
        onGooglePress={handleGoogleSignIn}
        onApplePress={handleAppleSignIn}
      />
    </View>
  );
}
```

### Disabled State

```typescript
function LoginScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signInWithGoogle, googleLoading } = useGoogleAuth();

  return (
    <View>
      <Button onPress={handleSubmit} loading={isSubmitting}>
        Giriş Yap
      </Button>

      <SocialLoginButtons
        enabledProviders={['google']}
        onGooglePress={signInWithGoogle}
        googleLoading={googleLoading}
        disabled={isSubmitting} // Form submit sırasında disable et
      />
    </View>
  );
}
```

### Error Handling

```typescript
function LoginScreen() {
  const { signInWithGoogle, googleLoading } = useGoogleAuth();
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      const result = await signInWithGoogle();

      if (!result.success) {
        setError(result.error || 'Google ile giriş başarısız');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    }
  };

  return (
    <View>
      {error && <Text style={styles.error}>{error}</Text>}

      <SocialLoginButtons
        enabledProviders={['google']}
        onGooglePress={handleGoogleSignIn}
        googleLoading={googleLoading}
      />
    </View>
  );
}
```

## Görünüm

### Divider
```
───────────────────  veya şununla devam et  ───────────────────
```

### Buttons
```
┌─────────────────┐  ┌─────────────────┐
│   G  Google     │  │   A  Apple      │
└─────────────────┘  └─────────────────┘
```

### Loading
```
┌─────────────────┐
│  ⏳  Yükleniyor... │
└─────────────────┘
```

## Platform Davranışı

| Platform | Google | Apple |
|----------|--------|-------|
| iOS | ✅ | ✅ |
| Android | ✅ | ❌ |
| Web | ✅ | ❌ |

Apple butonu otomatik olarak sadece iOS'ta gösterilir.

## Localisation

Component localisation kullanır:

```typescript
// Türkçe
"auth.orContinueWith": "veya şununla devam et"
"auth.google": "Google"
"auth.apple": "Apple"
```

## Design System

Component design system tokens kullanır:

- `tokens.colors.border` - Border rengi
- `tokens.colors.textPrimary` - Metin rengi
- `tokens.spacing` - Spacing değerleri

## İlgili Component'ler

- [`LoginForm`](./LoginForm.md) - Login formu
- [`RegisterForm`](./LoginForm.md#registerform) - Kayıt formu
- [`AuthDivider`](./AuthDivider.md) - Divider component'i

## İlgili Hook'lar

- [`useGoogleAuth`](../hooks/useSocialLogin.md#usegoogleauth) - Google auth hook'u
- [`useAppleAuth`](../hooks/useSocialLogin.md#useappleauth) - Apple auth hook'u
- [`useSocialLogin`](../hooks/useSocialLogin.md#usesociallogin) - Genel social login hook'u
