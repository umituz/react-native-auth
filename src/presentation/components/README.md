# Auth Components

React Native Auth paketi için UI component'leri koleksiyonu. Bu component'ler authentication ekranları ve formları için kullanılır.

## Mevcut Component'ler

### Layout & Container Components
- **[`AuthContainer`](./AuthContainer.tsx)** - Ana auth layout container
- **[`AuthHeader`](./AuthHeader.tsx)** - Auth ekranları için header
- **[`AuthFormCard`](./AuthFormCard.tsx)** - Form kartı container

### Form Components
- **[`LoginForm`](./LoginForm.tsx)** - Giriş formu
- **[`RegisterForm`](./RegisterForm.tsx)** - Kayıt formu
- **[`EditProfileForm`](./EditProfileForm.tsx)** - Profil düzenleme formu
- **[`EditProfileAvatar`](./EditProfileAvatar.tsx)** - Profil fotoğrafı düzenleme

### Password Indicators
- **[`PasswordStrengthIndicator`](./PasswordStrengthIndicator.tsx)** - Şifre güç göstergesi
- **[`PasswordMatchIndicator`](./PasswordMatchIndicator.tsx)** - Şifre eşleşme göstergesi

### Social Login Components
- **[`SocialLoginButtons`](./SocialLoginButtons.tsx)** - Social login button'ları
- **[`AuthBottomSheet`](./AuthBottomSheet.tsx)** - Bottom sheet auth modal

### Profile & Account Components
- **[`ProfileSection`](./ProfileSection.tsx)** - Profil bölümü
- **[`AccountActions`](./AccountActions.tsx)** - Hesap işlemleri
- **[`EditProfileActions`](./EditProfileActions.tsx)** - Profil düzenleme işlemleri

### UI Helper Components
- **[`AuthLegalLinks`](./AuthLegalLinks.tsx)** - KVKK/Kullanım şartları linkleri
- **[`AuthDivider`](./AuthDivider.tsx)** - Ayırıcı çizgi
- **[`AuthLink`](./AuthLink.tsx)** - Navigasyon link'i
- **[`AuthErrorDisplay`](./AuthErrorDisplay.tsx)** - Hata gösterme
- **[`AuthBackground`](./AuthBackground.tsx)** - Standart arkaplan

### Icons
- **[`GoogleIconSvg`](./icons/GoogleIconSvg.tsx)** - Google ikonu
- **[`AppleIconSvg`](./icons/AppleIconSvg.tsx)** - Apple ikonu

## Kullanım

```typescript
import {
  AuthContainer,
  AuthHeader,
  LoginForm,
  SocialLoginButtons,
  PasswordStrengthIndicator,
} from '@umituz/react-native-auth';

function LoginScreen() {
  return (
    <AuthContainer>
      <AuthHeader title="Giriş Yap" />
      <LoginForm />
      <SocialLoginButtons />
      <AuthLegalLinks />
    </AuthContainer>
  );
}
```

## Component Detaylı Dokümantasyon

Her component hakkında detaylı bilgi için ilgili component'in içindeki README.md dosyasına bakın.

## Tasarım Prensipleri

1. **Reusable**: Component'ler farklı context'lerde kullanılabilir
2. **Composable**: Küçük component'ler bir araya getirilerek büyük ekranlar oluşturulur
3. **Type-Safe**: Tüm component'ler TypeScript ile yazılmıştır
4. **Accessible**: Erişilebilirlik standartlarına uygun
5. **Themeable**: Design system ile uyumlu

## Konfigürasyon

### Theme

Component'ler design system theme'ini kullanır:

```typescript
import { ThemeProvider } from '@umituz/react-native-design-system-theme';

function App() {
  return (
    <ThemeProvider theme={yourTheme}>
      <AuthContainer>
        {/* Auth components */}
      </AuthContainer>
    </ThemeProvider>
  );
}
```

### Localization

```typescript
import { LocalizationProvider } from '@umituz/react-native-localization';

function App() {
  return (
    <LocalizationProvider locale="tr">
      <AuthContainer>
        {/* Auth components will use Turkish */}
      </AuthContainer>
    </LocalizationProvider>
  );
}
```

## İlgili Modüller

- **[Hooks](../hooks/README.md)** - Auth hook'ları
- **[Screens](../screens/)** - Auth ekranları
- **[Navigation](../navigation/)** - Auth navigasyonu
