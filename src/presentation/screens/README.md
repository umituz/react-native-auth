# Auth Screens

React Native Auth paketi için hazır ekran component'leri.

## Mevcut Screen'ler

- **[`LoginScreen`](./LoginScreen.tsx)** - Giriş ekranı
- **[`RegisterScreen`](./RegisterScreen.tsx)** - Kayıt ekranı
- **[`AccountScreen`](./AccountScreen.tsx)** - Hesap ayarları ekranı
- **[`EditProfileScreen`](./EditProfileScreen.tsx)** - Profil düzenleme ekranı

## Kullanım

### LoginScreen

```typescript
import { LoginScreen } from '@umituz/react-native-auth';

function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
```

### RegisterScreen

```typescript
import { RegisterScreen } from '@umituz/react-native-auth';

function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
```

### AccountScreen

```typescript
import { AccountScreen } from '@umituz/react-native-auth';

function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Account"
        component={AccountScreen}
        options={{ title: 'Hesabım' }}
      />
    </Stack.Navigator>
  );
}
```

### EditProfileScreen

```typescript
import { EditProfileScreen } from '@umituz/react-native-auth';

function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Profili Düzenle' }}
      />
    </Stack.Navigator>
  );
}
```

## AuthNavigator

Tüm auth ekranlarını içeren hazır navigator:

```typescript
import { AuthNavigator } from '@umituz/react-native-auth';

function App() {
  return (
    <NavigationContainer>
      <AuthNavigator />
    </NavigationContainer>
  );
}
```

## Konfigürasyon

### AccountScreen Konfigürasyonu

```typescript
import { AccountScreen } from '@umituz/react-native-auth';

function SettingsScreen() {
  return (
    <AccountScreen
      config={{
        showChangePassword: true,
        benefits: ['Premium içeriklere erişim', 'Reklamsız deneyim'],
      }}
    />
  );
}
```

### EditProfileScreen Konfigürasyonu

```typescript
import { EditProfileScreen } from '@umituz/react-native-auth';

function ProfileSettings() {
  return (
    <EditProfileScreen
      config={{
        showAvatar: true,
        allowEmailChange: false,
        maxDisplayNameLength: 50,
      }}
    />
  );
}
```

## Tam Örnek

```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  AuthNavigator,
  LoginScreen,
  RegisterScreen,
  AccountScreen,
  EditProfileScreen,
} from '@umituz/react-native-auth';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Auth ekranları */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />

        {/* Hesap ekranları */}
        <Stack.Screen
          name="Account"
          component={AccountScreen}
          options={{ title: 'Hesabım' }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{ title: 'Profili Düzenle' }}
        />

        {/* Diğer ekranlar */}
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## İlgili Component'ler

- **[Auth Components](../components/README.md)** - Auth UI component'leri
- **[Auth Hooks](../hooks/README.md)** - Auth hook'ları

## İlgili Navigation

- **[AuthNavigator](../navigation/AuthNavigator.tsx)** - Auth navigator
