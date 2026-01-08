# Password Indicators

Şifre validasyonu ve kullanıcı feedback'i için component'ler.

## Component'ler

- **[`PasswordStrengthIndicator`](#passwordstrengthindicator)** - Şifre güç göstergesi
- **[`PasswordMatchIndicator`](#passwordmatchindicator)** - Şifre eşleşme göstergesi

---

## PasswordStrengthIndicator

Şifre gereksinimlerini görsel olarak gösterir. Kullanıcı şifre girdikçe hangi gereksinimleri karşıladığını gösterir.

### Kullanım

```typescript
import { PasswordStrengthIndicator } from '@umituz/react-native-auth';

function RegisterForm() {
  const [password, setPassword] = useState('');
  const requirements = validatePasswordRequirements(password);

  return (
    <View>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Şifre"
        secureTextEntry
      />

      <PasswordStrengthIndicator requirements={requirements} />
    </View>
  );
}
```

### Props

| Prop | Tip | Required | Default | Açıklama |
|------|-----|----------|---------|----------|
| `requirements` | `PasswordRequirements` | Yes | - | Şifre gereksinimleri objesi |
| `showLabels` | `boolean` | No | `true` | Label'lar gösterilsin mi |

#### PasswordRequirements

```typescript
interface PasswordRequirements {
  hasMinLength: boolean;      // Minimum uzunluk (varsayılan: 8)
  hasUppercase: boolean;      // Büyük harf içeriyor
  hasLowercase: boolean;      // Küçük harf içeriyor
  hasNumber: boolean;         // Rakam içeriyor
  hasSpecialChar: boolean;    // Özel karakter içeriyor
}
```

### Örnekler

#### Tam Kullanım (Label'larla)

```typescript
function PasswordField() {
  const [password, setPassword] = useState('');

  const requirements: PasswordRequirements = {
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  return (
    <View>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Şifre"
        secureTextEntry
      />

      <PasswordStrengthIndicator
        requirements={requirements}
        showLabels={true}
      />
    </View>
  );
}
```

#### Sadece Dot'lar (Label'sız)

```typescript
function CompactPasswordField() {
  const [password, setPassword] = useState('');

  const requirements: PasswordRequirements = {
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  return (
    <View>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Şifre"
        secureTextEntry
      />

      <PasswordStrengthIndicator
        requirements={requirements}
        showLabels={false}
      />
    </View>
  );
}
```

#### Custom Validasyon ile

```typescript
function CustomPasswordField() {
  const [password, setPassword] = useState('');

  const requirements: PasswordRequirements = {
    hasMinLength: password.length >= 12, // Özel: 12 karakter
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  return (
    <View>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Şifre (en az 12 karakter)"
        secureTextEntry
      />

      <PasswordStrengthIndicator
        requirements={requirements}
      />

      {password.length > 0 && password.length < 12 && (
        <Text style={styles.warning}>
          Şifre en az 12 karakter olmalıdır
        </Text>
      )}
    </View>
  );
}
```

#### Custom Validation Hook ile

```typescript
function usePasswordValidation(minLength = 8) {
  const [password, setPassword] = useState('');

  const requirements = useMemo(() => ({
    hasMinLength: password.length >= minLength,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }), [password, minLength]);

  const allRequirementsMet = useMemo(() =>
    Object.values(requirements).every(Boolean),
    [requirements]
  );

  return {
    password,
    setPassword,
    requirements,
    allRequirementsMet,
  };
}

function RegisterForm() {
  const { password, setPassword, requirements, allRequirementsMet } = usePasswordValidation();

  return (
    <View>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Şifre"
        secureTextEntry
      />

      <PasswordStrengthIndicator requirements={requirements} />

      <Button
        onPress={handleRegister}
        disabled={!allRequirementsMet}
      >
        Kayıt Ol
      </Button>
    </View>
  );
}
```

### Görünüm

Label'lı modda:
```
● En az 8 karakter
● Büyük harf
● Küçük harf
● Rakam
● Özel karakter
```

Label'sız modda:
```
● ● ● ● ●
```

Yeşil dot ✓ = Gereklilik karşılandı
Gri dot ○ = Gereklilik karşılanmadı

---

## PasswordMatchIndicator

İki şifre alanının eşleşip eşleşmediğini gösterir.

### Kullanım

```typescript
import { PasswordMatchIndicator } from '@umituz/react-native-auth';

function RegisterForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const passwordsMatch = password === confirmPassword && password.length > 0;

  return (
    <View>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Şifre"
        secureTextEntry
      />

      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Şifre Tekrar"
        secureTextEntry
      />

      <PasswordMatchIndicator isMatch={passwordsMatch} />
    </View>
  );
}
```

### Props

| Prop | Tip | Required | Açıklama |
|------|-----|----------|----------|
| `isMatch` | `boolean` | Yes | Şifreler eşleşiyor mu |

### Örnekler

#### Basit Kullanım

```typescript
function ConfirmPasswordField() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const passwordsMatch = password === confirmPassword && password.length > 0;

  return (
    <View>
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Şifre Tekrar"
        secureTextEntry
      />

      {confirmPassword.length > 0 && (
        <PasswordMatchIndicator isMatch={passwordsMatch} />
      )}
    </View>
  );
}
```

#### Buton Disabled State ile

```typescript
function RegisterForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const passwordsMatch = password === confirmPassword && password.length > 0;
  const canSubmit = passwordsMatch && password.length >= 8;

  return (
    <View>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Şifre"
        secureTextEntry
      />

      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Şifre Tekrar"
        secureTextEntry
      />

      <PasswordMatchIndicator isMatch={passwordsMatch} />

      <Button
        onPress={handleRegister}
        disabled={!canSubmit}
      >
        Kayıt Ol
      </Button>
    </View>
  );
}
```

#### Custom Validation ile

```typescript
function SecureRegisterForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const passwordsMatch = password === confirmPassword && password.length > 0;

  // Şifre güvenliği kontrolü
  const isPasswordSecure = useMemo(() => {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    return hasMinLength && hasUppercase && hasLowercase && hasNumber;
  }, [password]);

  const canSubmit = passwordsMatch && isPasswordSecure;

  return (
    <View>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Şifre"
        secureTextEntry
      />

      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Şifre Tekrar"
        secureTextEntry
      />

      {confirmPassword.length > 0 && (
        <PasswordMatchIndicator isMatch={passwordsMatch} />
      )}

      <Button
        onPress={handleRegister}
        disabled={!canSubmit}
      >
        Kayıt Ol
      </Button>
    </View>
  );
}
```

### Görünüm

Eşleşiyor ✓:
```
● Şifreler eşleşiyor
```
(Yeşil renk)

Eşleşmiyor ✗:
```
● Şifreler eşleşmiyor
```
(Kırmızı renk)

## Birlikte Kullanım

```typescript
function CompleteRegisterForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const requirements: PasswordRequirements = {
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const allRequirementsMet = Object.values(requirements).every(Boolean);
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const canSubmit = allRequirementsMet && passwordsMatch;

  return (
    <View>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Şifre"
        secureTextEntry
      />

      <PasswordStrengthIndicator requirements={requirements} />

      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Şifre Tekrar"
        secureTextEntry
      />

      {confirmPassword.length > 0 && (
        <PasswordMatchIndicator isMatch={passwordsMatch} />
      )}

      <Button
        onPress={handleRegister}
        disabled={!canSubmit}
      >
        Kayıt Ol
      </Button>
    </View>
  );
}
```

## İlgili Component'ler

- [`RegisterForm`](./LoginForm.md#registerform) - Kayıt formu
- [`useRegisterForm`](../hooks/useRegisterForm.md) - Register form hook'u

## İlgili Util'ler

- [`validatePasswordForRegister`](../../infrastructure/utils/AuthValidation.ts) - Şifre validasyonu
- [`DEFAULT_VAL_CONFIG`](../../infrastructure/utils/AuthValidation.ts) - Varsayılan validasyon konfigürasyonu
