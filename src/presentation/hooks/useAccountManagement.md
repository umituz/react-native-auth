# useAccountManagement

Hesap yönetimi işlemleri için hook. Çıkış yapma ve hesap silme işlevselliği sağlar.

## Özellikler

- Güvenli çıkış yapma
- Hesap silme (reauthentication gerektirir)
- Reauthentication callback desteği
- Loading state yönetimi

## Kullanım

```typescript
import { useAccountManagement } from '@umituz/react-native-auth';

function AccountSettings() {
  const { logout, deleteAccount, isLoading, isDeletingAccount } = useAccountManagement({
    onReauthRequired: async () => {
      // Google/Apple ile yeniden authentication
      const result = await reauthenticateWithGoogle();
      return result.success;
    },
    onPasswordRequired: async () => {
      // Şifre prompt göster
      const password = await showPasswordPrompt();
      return password;
    },
  });

  const handleLogout = async () => {
    Alert.alert(
      'Çıkış Yap',
      'Çıkış yapmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış',
          onPress: logout,
        },
      ]
    );
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Hesabı Sil',
      'Bu işlem geri alınamaz. Hesabınızı silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: deleteAccount,
        },
      ]
    );
  };

  return (
    <View>
      <Button onPress={handleLogout} disabled={isLoading}>
        Çıkış Yap
      </Button>
      <Button
        onPress={handleDeleteAccount}
        disabled={isDeletingAccount}
        style={{ backgroundColor: 'red' }}
      >
        {isDeletingAccount ? 'Siliniyor...' : 'Hesabı Sil'}
      </Button>
    </View>
  );
}
```

## API

### Parameters

| Param | Tip | Required | Açıklama |
|-------|------|----------|----------|
| `onReauthRequired` | `() => Promise<boolean>` | No | Google/Apple ile yeniden authentication callback'i |
| `onPasswordRequired` | `() => Promise<string \| null>` | No | Şifre ile yeniden authentication callback'i |

### Return Value

| Prop | Tip | Açıklama |
|------|-----|----------|
| `logout` | `() => Promise<void>` | Çıkış yapma fonksiyonu |
| `deleteAccount` | `() => Promise<void>` | Hesap silme fonksiyonu |
| `isLoading` | `boolean` | Genel loading durumu |
| `isDeletingAccount` | `boolean` | Hesap silme loading durumu |

## Reauthentication

Hesap silme işlemi hassas bir işlem olduğu için Firebase, kullanıcının son zamanlarda giriş yapmasını gerektirir. Bu hook size reauthentication için callback'ler sağlar.

### onReauthRequired

Google veya Apple ile giriş yapmış kullanıcılar için:

```typescript
const { deleteAccount } = useAccountManagement({
  onReauthRequired: async () => {
    try {
      // Google ile yeniden authentication
      const result = await signInWithGooglePopup();

      if (result.user) {
        Alert.alert('Başarılı', 'Lütfen hesap silme işlemine devam edin');
        return true;
      }

      return false;
    } catch (error) {
      Alert.alert('Hata', 'Reauthentication başarısız');
      return false;
    }
  },
});
```

### onPasswordRequired

Email/password ile giriş yapmış kullanıcılar için:

```typescript
const { deleteAccount } = useAccountManagement({
  onPasswordRequired: async () => {
    return new Promise((resolve) => {
      // Şifre prompt göster
      Alert.prompt(
        'Şifre Girin',
        'Hesabınızı silmek için şifrenizi girin',
        [
          {
            text: 'İptal',
            onPress: () => resolve(null),
            style: 'cancel',
          },
          {
            text: 'Tamam',
            onPress: (password) => resolve(password || null),
          },
        ],
        'secure-text'
      );
    });
  },
});
```

## Örnekler

### Basit Hesap Ayarları Ekranı

```typescript
function AccountSettingsScreen() {
  const { logout, deleteAccount, isDeletingAccount } = useAccountManagement();
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await logout();
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Hata', 'Çıkış yapılamadı');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      navigation.replace('Login');
      Alert.alert('Başarılı', 'Hesabınız silindi');
    } catch (error) {
      Alert.alert('Hata', 'Hesap silinemedi');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Section title="Oturum">
        <MenuItem
          title="Çıkış Yap"
          icon="log-out"
          onPress={handleLogout}
        />
      </Section>

      <Section title="Tehlikeli Bölge">
        <MenuItem
          title="Hesabı Sil"
          icon="trash"
          onPress={handleDeleteAccount}
          destructive
          disabled={isDeletingAccount}
        />
        {isDeletingAccount && <ActivityIndicator />}
      </Section>
    </ScrollView>
  );
}
```

### Custom Reauthentication UI

```typescript
function DeleteAccountScreen() {
  const [showReauth, setShowReauth] = useState(false);
  const [reauthMethod, setReauthMethod] = useState<'password' | 'google' | 'apple'>('password');

  const { deleteAccount, isDeletingAccount } = useAccountManagement({
    onReauthRequired: async () => {
      setShowReauth(true);
      return new Promise((resolve) => {
        // Custom reauthentication UI
        const handleResult = (success: boolean) => {
          setShowReauth(false);
          resolve(success);
        };

        // UI'ı göster ve sonucu bekle
        showCustomReauthUI(reauthMethod, handleResult);
      });
    },
    onPasswordRequired: async () => {
      setShowReauth(true);
      return new Promise((resolve) => {
        // Custom password prompt
        showPasswordPrompt((password) => {
          setShowReauth(false);
          resolve(password);
        });
      });
    },
  });

  const handleDelete = async () => {
    try {
      await deleteAccount();
      Alert.alert('Başarılı', 'Hesabınız silindi');
    } catch (error) {
      Alert.alert('Hata', error.message);
    }
  };

  return (
    <View>
      <Button onPress={handleDelete} disabled={isDeletingAccount}>
        Hesabı Sil
      </Button>

      {showReauth && (
        <ReauthenticationModal
          method={reauthMethod}
          onComplete={() => {
            // Reauthentication başarılı, deleteAccount devam eder
          }}
        />
      )}
    </View>
  );
}
```

### Hesap Silme Onayı

```typescript
function DeleteAccountConfirmation() {
  const { deleteAccount, isDeletingAccount } = useAccountManagement();
  const [agreed, setAgreed] = useState(false);

  const handleDelete = async () => {
    if (!agreed) {
      Alert.alert('Uyarı', 'Lütfen koşulları kabul edin');
      return;
    }

    Alert.alert(
      'Hesabı Sil',
      'Bu işlem geri alınamaz. Devam etmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: deleteAccount,
        },
      ]
    );
  };

  return (
    <View>
      <Text style={styles.warning}>
        Hesabınızı silerseniz:
      </Text>
      <Text>• Tüm verileriniz kalıcı olarak silinir</Text>
      <Text>• İşlemler geri alınamaz</Text>
      <Text>• Aynı hesapla tekrar giriş yapamazsınız</Text>

      <CheckBox
        value={agreed}
        onValueChange={setAgreed}
        label="Hesap silme koşullarını kabul ediyorum"
      />

      <Button
        onPress={handleDelete}
        disabled={!agreed || isDeletingAccount}
        style={{ backgroundColor: 'red' }}
      >
        {isDeletingAccount ? 'Siliniyor...' : 'Hesabı Kalıcı Olarak Sil'}
      </Button>
    </View>
  );
}
```

## Hata Yönetimi

```typescript
function AccountSettings() {
  const { logout, deleteAccount } = useAccountManagement();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      if (error.code === 'auth/network-request-failed') {
        Alert.alert('Bağlantı Hatası', 'İnternet bağlantınızı kontrol edin');
      } else {
        Alert.alert('Hata', 'Çıkış yapılamadı');
      }
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        Alert.alert(
          'Giriş Gerekiyor',
          'Hesabınızı silmek için lütfen tekrar giriş yapın'
        );
      } else if (error.code === 'auth/too-many-requests') {
        Alert.alert(
          'Çok Fazla Deneme',
          'Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin'
        );
      } else {
        Alert.alert('Hata', 'Hesap silinemedi');
      }
    }
  };

  return (
    <View>
      <Button onPress={handleLogout}>Çıkış Yap</Button>
      <Button onPress={handleDeleteAccount}>Hesabı Sil</Button>
    </View>
  );
}
```

## Önemli Notlar

1. **Reauthentication Gerekli**: Firebase, hesap silme işlemi için son zamanlarda giriş yapmayı gerektirir
2. **Anonymous Kullanıcılar**: Anonymous hesaplar silinemez
3. **Geri Alınamaz**: Hesap silme işlemi geri alınamaz
4. **Callback'ler**: `onReauthRequired` ve `onPasswordRequired` callback'lerini sağlamazsanız, hatalar fırlatılır

## İlgili Hooks

- [`useAuth`](./useAuth.md) - Ana auth state yönetimi
- [`useSignOut`](./useAuth.md) - Çıkış yapma fonksiyonu
- [`useUserProfile`](./useUserProfile.md) - Profil bilgileri
