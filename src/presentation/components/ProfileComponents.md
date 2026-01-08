# Profile Components

Kullanıcı profili ve hesap yönetimi için component'ler.

## Component'ler

- **[`ProfileSection`](#profilesection)** - Profil bölümü
- **[`AccountActions`](#accountactions)** - Hesap işlemleri

---

## ProfileSection

Kullanıcı profil bilgilerini gösteren component. Avatar, isim ve kullanıcı ID'si içerir.

### Kullanım

```typescript
import { ProfileSection } from '@umituz/react-native-auth';

function SettingsScreen() {
  const profile = useUserProfile({
    accountRoute: 'AccountSettings',
  });

  const navigation = useNavigation();

  return (
    <View>
      <ProfileSection
        profile={{
          displayName: profile?.displayName,
          userId: profile?.userId,
          isAnonymous: profile?.isAnonymous || false,
          avatarUrl: profile?.avatarUrl,
          accountSettingsRoute: profile?.accountSettingsRoute,
        }}
        onPress={() => navigation.navigate('EditProfile')}
        onSignIn={() => navigation.navigate('Login')}
        signInText="Giriş Yap"
        anonymousText="Misafir"
      />
    </View>
  );
}
```

### Props

| Prop | Tip | Required | Açıklama |
|------|-----|----------|----------|
| `profile` | `ProfileSectionConfig` | Yes | Profil konfigürasyonu |
| `onPress` | `() => void` | No | Press handler (authenticated kullanıcılar için) |
| `onSignIn` | `() => void` | No | Sign-in handler (anonymous kullanıcılar için) |
| `signInText` | `string` | No | "Giriş Yap" metni |
| `anonymousText` | `string` | No | Anonymous kullanıcı metni |

#### ProfileSectionConfig

```typescript
interface ProfileSectionConfig {
  displayName?: string;        // Görünen ad
  userId?: string;             // Kullanıcı ID'si
  isAnonymous: boolean;        // Anonymous mu
  avatarUrl?: string;          // Profil fotoğrafı URL'si
  accountSettingsRoute?: string; // Hesap ayarları route'u
  benefits?: string[];         // Faydalar listesi
}
```

### Örnekler

#### Authenticated Kullanıcı

```typescript
function ProfileSection() {
  const { user } = useAuth();

  const profile = {
    displayName: user?.displayName || user?.email,
    userId: user?.uid,
    isAnonymous: false,
    avatarUrl: user?.photoURL,
    accountSettingsRoute: 'AccountSettings',
  };

  const navigation = useNavigation();

  return (
    <ProfileSection
      profile={profile}
      onPress={() => navigation.navigate('EditProfile')}
    />
  );
}
```

#### Anonymous Kullanıcı

```typescript
function ProfileSection() {
  const { user } = useAuth();

  const profile = {
    displayName: 'Misafir Kullanıcı',
    userId: undefined,
    isAnonymous: true,
    avatarUrl: undefined,
  };

  const navigation = useNavigation();

  return (
    <ProfileSection
      profile={profile}
      onSignIn={() => navigation.navigate('Login')}
      signInText="Giriş Yap"
    />
  );
}
```

#### Benefits ile

```typescript
function PremiumProfileSection() {
  const { user } = useAuth();

  const profile = {
    displayName: user?.displayName,
    userId: user?.uid,
    isAnonymous: false,
    avatarUrl: user?.photoURL,
    benefits: [
      'Premium içeriklere erişim',
      'Reklamsız deneyim',
      'Özel indirimler',
    ],
  };

  return <ProfileSection profile={profile} />;
}
```

#### Dynamic Profile

```typescript
function DynamicProfileSection() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const profile = useUserProfile();

  const handlePress = () => {
    if (profile?.isAnonymous) {
      navigation.navigate('Login');
    } else {
      navigation.navigate('EditProfile');
    }
  };

  return (
    <ProfileSection
      profile={{
        displayName: profile?.displayName,
        userId: profile?.userId,
        isAnonymous: profile?.isAnonymous || false,
        avatarUrl: profile?.avatarUrl,
        benefits: profile?.isAnonymous
          ? ['Hesap oluşturarak daha fazla özelliğe erişin']
          : ['Premium üyelik alın', 'Ayrıcalıklı içeriklere erişin'],
      }}
      onPress={handlePress}
    />
  );
}
```

---

## AccountActions

Hesap yönetimi işlemlerini içeren component. Çıkış yapma, şifre değiştirme ve hesap silme butonlarını sağlar.

### Kullanım

```typescript
import { AccountActions } from '@umituz/react-native-auth';

function AccountSettingsScreen() {
  const { logout, deleteAccount } = useAccountManagement();
  const navigation = useNavigation();

  const config = {
    logoutText: 'Çıkış Yap',
    deleteAccountText: 'Hesabı Sil',
    changePasswordText: 'Şifre Değiştir',
    logoutConfirmTitle: 'Çıkış Yap',
    logoutConfirmMessage: 'Çıkış yapmak istediğinizden emin misiniz?',
    deleteConfirmTitle: 'Hesabı Sil',
    deleteConfirmMessage: 'Bu işlem geri alınamaz. Devam etmek istiyor musunuz?',
    deleteErrorTitle: 'Hata',
    deleteErrorMessage: 'Hesap silinemedi. Lütfen tekrar deneyin.',
    onLogout: async () => {
      await logout();
      navigation.replace('Login');
    },
    onDeleteAccount: async () => {
      await deleteAccount();
      navigation.replace('Login');
    },
    showChangePassword: true,
    onChangePassword: () => {
      navigation.navigate('ChangePassword');
    },
  };

  return (
    <View>
      <AccountActions config={config} />
    </View>
  );
}
```

### Props

| Prop | Tip | Required | Açıklama |
|------|-----|----------|----------|
| `config` | `AccountActionsConfig` | Yes | Hesap işlemleri konfigürasyonu |

#### AccountActionsConfig

```typescript
interface AccountActionsConfig {
  logoutText: string;                  // "Çıkış Yap" butonu metni
  deleteAccountText: string;           // "Hesabı Sil" butonu metni
  changePasswordText?: string;         // "Şifre Değiştir" butonu metni
  logoutConfirmTitle: string;          // Çıkış onay başlığı
  logoutConfirmMessage: string;        // Çıkış onay mesajı
  deleteConfirmTitle: string;          // Silme onay başlığı
  deleteConfirmMessage: string;        // Silme onay mesajı
  deleteErrorTitle?: string;           // Silme hata başlığı
  deleteErrorMessage?: string;         // Silme hata mesajı
  onLogout: () => Promise<void>;       // Çıkış handler
  onDeleteAccount: () => Promise<void>; // Silme handler
  onChangePassword?: () => void;       // Şifre değiştirme handler
  showChangePassword?: boolean;        // Şifre değiştirme butonu göster
}
```

### Örnekler

#### Basit Kullanım

```typescript
function SimpleAccountActions() {
  const { logout, deleteAccount } = useAccountManagement();

  const config = {
    logoutText: 'Çıkış Yap',
    deleteAccountText: 'Hesabı Sil',
    logoutConfirmTitle: 'Çıkış Yap',
    logoutConfirmMessage: 'Çıkış yapmak istiyor musunuz?',
    deleteConfirmTitle: 'Hesabı Sil',
    deleteConfirmMessage: 'Hesabınızı silmek istediğinizden emin misiniz?',
    onLogout: logout,
    onDeleteAccount: deleteAccount,
  };

  return <AccountActions config={config} />;
}
```

#### Şifre Değiştirme ile

```typescript
function AccountActionsWithPasswordChange() {
  const { logout, deleteAccount } = useAccountManagement();
  const navigation = useNavigation();

  const config = {
    logoutText: 'Çıkış Yap',
    deleteAccountText: 'Hesabı Sil',
    changePasswordText: 'Şifre Değiştir',
    logoutConfirmTitle: 'Çıkış Yap',
    logoutConfirmMessage: 'Çıkış yapmak istiyor musunuz?',
    deleteConfirmTitle: 'Hesabı Sil',
    deleteConfirmMessage: 'Hesabınızı silmek istediğinizden emin misiniz?',
    onLogout: async () => {
      await logout();
      navigation.replace('Login');
    },
    onDeleteAccount: async () => {
      await deleteAccount();
      navigation.replace('Login');
    },
    showChangePassword: true,
    onChangePassword: () => {
      navigation.navigate('ChangePassword');
    },
  };

  return <AccountActions config={config} />;
}
```

#### Custom Error Handling

```typescript
function AccountActionsWithErrorHandling() {
  const { logout, deleteAccount } = useAccountManagement();
  const navigation = useNavigation();

  const config = {
    logoutText: 'Çıkış Yap',
    deleteAccountText: 'Hesabı Sil',
    logoutConfirmTitle: 'Çıkış Yap',
    logoutConfirmMessage: 'Çıkış yapmak istiyor musunuz?',
    deleteConfirmTitle: 'Hesabı Sil',
    deleteConfirmMessage: 'Bu işlem geri alınamaz. Emin misiniz?',
    deleteErrorTitle: 'Hesap Silinemedi',
    deleteErrorMessage: 'Hesabınız silinirken bir hata oluştu. Lütfen daha sonra tekrar deneyin veya destek ile iletişime geçin.',
    onLogout: async () => {
      try {
        await logout();
        navigation.replace('Login');
      } catch (error) {
        Alert.alert('Hata', 'Çıkış yapılamadı');
      }
    },
    onDeleteAccount: async () => {
      try {
        await deleteAccount();
        Alert.alert('Başarılı', 'Hesabınız silindi');
        navigation.replace('Login');
      } catch (error) {
        // Hata otomatik olarak gösterilir (deleteErrorMessage)
        throw error;
      }
    },
  };

  return <AccountActions config={config} />;
}
```

#### Anonymous Kullanıcı İçin

```typescript
function AccountActionsAnonymous() {
  const { isAnonymous } = useAuth();

  if (isAnonymous) {
    return (
      <Button onPress={() => navigation.navigate('Register')}>
        Hesap Oluştur
      </Button>
    );
  }

  const config = {
    logoutText: 'Çıkış Yap',
    deleteAccountText: 'Hesabı Sil',
    logoutConfirmTitle: 'Çıkış Yap',
    logoutConfirmMessage: 'Çıkış yapmak istiyor musunuz?',
    deleteConfirmTitle: 'Hesabı Sil',
    deleteConfirmMessage: 'Hesabınızı silmek istediğinizden emin misiniz?',
    onLogout: logout,
    onDeleteAccount: deleteAccount,
  };

  return <AccountActions config={config} />;
}
```

## Birlikte Kullanım

```typescript
function AccountSettingsScreen() {
  const profile = useUserProfile();
  const { logout, deleteAccount } = useAccountManagement();
  const navigation = useNavigation();

  return (
    <ScrollView>
      {/* Profil bölümü */}
      <ProfileSection
        profile={{
          displayName: profile?.displayName,
          userId: profile?.userId,
          isAnonymous: profile?.isAnonymous || false,
          avatarUrl: profile?.avatarUrl,
        }}
        onPress={() => navigation.navigate('EditProfile')}
      />

      {/* Hesap işlemleri */}
      {!profile?.isAnonymous && (
        <AccountActions
          config={{
            logoutText: 'Çıkış Yap',
            deleteAccountText: 'Hesabı Sil',
            logoutConfirmTitle: 'Çıkış Yap',
            logoutConfirmMessage: 'Çıkış yapmak istiyor musunuz?',
            deleteConfirmTitle: 'Hesabı Sil',
            deleteConfirmMessage: 'Bu işlem geri alınamaz. Emin misiniz?',
            onLogout: async () => {
              await logout();
              navigation.replace('Login');
            },
            onDeleteAccount: async () => {
              await deleteAccount();
              navigation.replace('Login');
            },
          }}
        />
      )}
    </ScrollView>
  );
}
```

## İlgili Component'ler

- [`EditProfileForm`](./EditProfileForm.md) - Profil düzenleme formu
- [`EditProfileAvatar`](./EditProfileAvatar.md) - Profil fotoğrafı düzenleme

## İlgili Hook'lar

- [`useUserProfile`](../hooks/useUserProfile.md) - Profil verileri hook'u
- [`useAccountManagement`](../hooks/useAccountManagement.md) - Hesap yönetimi hook'u
- [`useAuth`](../hooks/useAuth.md) - Ana auth state yönetimi
