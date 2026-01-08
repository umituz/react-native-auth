# LoginForm & RegisterForm

Authentication formları için hazır component'ler.

---

## LoginForm

Email ve şifre ile giriş formu.

### Kullanım

```typescript
import { LoginForm } from '@umituz/react-native-auth';

function LoginScreen() {
  const navigation = useNavigation();

  return (
    <View>
      <LoginForm
        onNavigateToRegister={() => navigation.navigate('Register')}
      />
    </View>
  );
}
```

### Props

| Prop | Tip | Required | Açıklama |
|------|-----|----------|----------|
| `onNavigateToRegister` | `() => void` | Yes | Kayıt ekranına navigasyon |

### Özellikler

- ✅ Email validasyonu
- ✅ Şifre validasyonu
- ✅ Loading state
- ✅ Hata gösterimi
- ✅ Keyboard navigation (Enter ile sonraki alana geçiş)
- ✅ Localisation desteği
- ✅ Disabled state (boş alanlar)

### Örnekler

#### Basit Kullanım

```typescript
function LoginScreen() {
  const navigation = useNavigation();

  return (
    <AuthContainer>
      <AuthHeader title="Giriş Yap" />
      <LoginForm
        onNavigateToRegister={() => navigation.navigate('Register')}
      />
    </AuthContainer>
  );
}
```

#### Social Login ile

```typescript
function LoginScreen() {
  const navigation = useNavigation();
  const { signInWithGoogle, signInWithApple } = useSocialLogin();

  return (
    <AuthContainer>
      <AuthHeader title="Giriş Yap" />

      <LoginForm
        onNavigateToRegister={() => navigation.navigate('Register')}
      />

      <AuthDivider text="veya" />

      <SocialLoginButtons
        onGoogleSignIn={signInWithGoogle}
        onAppleSignIn={signInWithApple}
      />
    </AuthContainer>
  );
}
```

#### Custom AuthContainer ile

```typescript
function CustomLoginScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Logo />
        <Text style={styles.title}>Hoşgeldiniz</Text>
        <Text style={styles.subtitle}>Devam etmek için giriş yapın</Text>
      </View>

      <View style={styles.formContainer}>
        <LoginForm
          onNavigateToRegister={() => navigation.navigate('Register')}
        />
      </View>

      <View style={styles.footer}>
        <AuthLegalLinks />
      </View>
    </ScrollView>
  );
}
```

---

## RegisterForm

Kullanıcı kayıt formu. DisplayName, email, şifre ve şifre tekrar alanlarını içerir.

### Kullanım

```typescript
import { RegisterForm } from '@umituz/react-native-auth';

function RegisterScreen() {
  const navigation = useNavigation();

  return (
    <View>
      <RegisterForm
        onNavigateToLogin={() => navigation.navigate('Login')}
        onTermsPress={() => navigation.navigate('Terms')}
        onPrivacyPress={() => navigation.navigate('Privacy')}
      />
    </View>
  );
}
```

### Props

| Prop | Tip | Required | Açıklama |
|------|-----|----------|----------|
| `onNavigateToLogin` | `() => void` | Yes | Giriş ekranına navigasyon |
| `termsUrl` | `string` | No | Kullanım şartları URL |
| `privacyUrl` | `string` | No | Gizlilik politikası URL |
| `onTermsPress` | `() => void` | No | Kullanım şartları butonu handler |
| `onPrivacyPress` | `() => void` | No | Gizlilik politikası butonu handler |

### Özellikler

- ✅ DisplayName validasyonu
- ✅ Email validasyonu
- ✅ Şifre validasyonu
- ✅ Şifre eşleşme kontrolü
- ✅ Şifre güç göstergesi
- ✅ Loading state
- ✅ Hata gösterimi
- ✅ KVKK/Kullanım şartları kabulü
- ✅ Keyboard navigation

### Örnekler

#### Basit Kullanım

```typescript
function RegisterScreen() {
  const navigation = useNavigation();

  return (
    <AuthContainer>
      <AuthHeader title="Kayıt Ol" />
      <RegisterForm
        onNavigateToLogin={() => navigation.navigate('Login')}
      />
    </AuthContainer>
  );
}
```

#### Legal Links ile

```typescript
function RegisterScreen() {
  const navigation = useNavigation();

  return (
    <AuthContainer>
      <AuthHeader title="Kayıt Ol" />
      <RegisterForm
        onNavigateToLogin={() => navigation.navigate('Login')}
        termsUrl="https://example.com/terms"
        privacyUrl="https://example.com/privacy"
      />
    </AuthContainer>
  );
}
```

#### Custom Handlers ile

```typescript
function RegisterScreen() {
  const navigation = useNavigation();

  const handleTermsPress = () => {
    navigation.navigate('WebView', {
      url: 'https://example.com/terms',
      title: 'Kullanım Şartları',
    });
  };

  const handlePrivacyPress = () => {
    navigation.navigate('WebView', {
      url: 'https://example.com/privacy',
      title: 'Gizlilik Politikası',
    });
  };

  return (
    <AuthContainer>
      <AuthHeader title="Kayıt Ol" />
      <RegisterForm
        onNavigateToLogin={() => navigation.navigate('Login')}
        onTermsPress={handleTermsPress}
        onPrivacyPress={handlePrivacyPress}
      />
    </AuthContainer>
  );
}
```

#### Social Login ile

```typescript
function RegisterScreen() {
  const navigation = useNavigation();
  const { signInWithGoogle, signInWithApple } = useSocialLogin();

  return (
    <AuthContainer>
      <AuthHeader title="Kayıt Ol" />

      <RegisterForm
        onNavigateToLogin={() => navigation.navigate('Login')}
      />

      <AuthDivider text="veya şununla devam et" />

      <SocialLoginButtons
        onGoogleSignIn={signInWithGoogle}
        onAppleSignIn={signInWithApple}
      />
    </AuthContainer>
  );
}
```

## Form Validasyonu

### LoginForm Validasyonları

| Alan | Validasyon |
|------|------------|
| Email | Boş olamaz, geçerli email formatı |
| Password | Boş olamaz |

### RegisterForm Validasyonları

| Alan | Validasyon |
|------|------------|
| DisplayName | Boş olamaz |
| Email | Boş olamaz, geçerli email formatı |
| Password | Boş olamaz, minimum uzunluk, karmaşıklık |
| Confirm Password | Boş olamaz, password ile eşleşmeli |

## Password Requirements

RegisterForm otomatik olarak şifre gereksinimlerini kontrol eder:

```typescript
{
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
}
```

## Şifre Güç Göstergesi

RegisterForm otomatik olarak [`PasswordStrengthIndicator`](./PasswordStrengthIndicator.md) ve [`PasswordMatchIndicator`](./PasswordMatchIndicator.md) component'lerini kullanır:

```typescript
// Kullanıcı şifre girdikçe
// 1. Şifre gücü gösterilir (Zayıf/Orta/Güçlü)
// 2. Şifreler eşleşiyor mu gösterilir
```

## Hata Yönetimi

Form component'leri otomatik olarak hataları gösterir:

```typescript
// Email hatalı
<input state="error" helperText="Geçersiz email formatı" />

// Şifre çok kısa
<input state="error" helperText="Şifre en az 8 karakter olmalı" />

// Genel hata (Firebase, network vb.)
<AuthErrorDisplay error="Şifre hatalı" />
```

## İlgili Component'ler

- [`AuthContainer`](./AuthContainer.md) - Layout container
- [`AuthHeader`](./AuthHeader.md) - Header component'i
- [`PasswordStrengthIndicator`](./PasswordStrengthIndicator.md) - Şifre güç göstergesi
- [`PasswordMatchIndicator`](./PasswordMatchIndicator.md) - Şifre eşleşme göstergesi
- [`SocialLoginButtons`](./SocialLoginButtons.md) - Social login butonları
- [`AuthLegalLinks`](./AuthLegalLinks.md) - Legal links

## İlgili Hook'lar

- [`useLoginForm`](../hooks/useLoginForm.md) - Login form state yönetimi
- [`useRegisterForm`](../hooks/useRegisterForm.md) - Register form state yönetimi
- [`useAuth`](../hooks/useAuth.md) - Ana auth state yönetimi
