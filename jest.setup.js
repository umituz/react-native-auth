// Jest setup file
global.__DEV__ = true;

// Mock React Native modules
jest.mock('react-native', () => ({
  DeviceEventEmitter: {
    addListener: jest.fn(() => ({ remove: jest.fn() })),
    emit: jest.fn(),
  },
  Platform: {
    OS: 'ios',
    select: jest.fn((obj) => obj.ios),
  },
}));

// Mock external dependencies
jest.mock('@umituz/react-native-firebase-auth', () => ({
  useFirebaseAuth: jest.fn(() => ({
    user: null,
    loading: false,
  })),
}));

jest.mock('@umituz/react-native-localization', () => ({
  useLocalization: jest.fn(() => ({
    t: jest.fn((key, params) => {
      if (typeof params === 'object' && params.defaultValue) {
        return params.defaultValue;
      }
      return key;
    }),
  })),
  useTranslation: jest.fn(() => ({
    t: jest.fn((key, params) => {
      if (typeof params === 'object' && params.defaultValue) {
        return params.defaultValue;
      }
      return key;
    }),
  })),
}));

jest.mock('@umituz/react-native-design-system-theme', () => ({
  useAppDesignTokens: jest.fn(() => ({
    colors: {
      primary: '#007AFF',
      success: '#34C759',
      error: '#FF3B30',
      warning: '#FF9500',
    },
    spacing: {
      sm: 8,
      md: 16,
      lg: 24,
    },
  })),
}));

jest.mock('@umituz/react-native-design-system-atoms', () => ({
  AtomicInput: 'AtomicInput',
  AtomicButton: 'AtomicButton',
  AtomicText: 'Text',
  AtomicView: 'View',
}));

jest.mock('@umituz/react-native-validation', () => ({
  useValidation: jest.fn(() => ({
    validate: jest.fn(),
  })),
  batchValidate: jest.fn(() => ({ isValid: true, errors: {} })),
}));

jest.mock('@umituz/react-native-storage', () => ({
  storageRepository: {
    getString: jest.fn(),
    setString: jest.fn(),
    removeItem: jest.fn(),
  },
  unwrap: jest.fn((result, defaultValue) => result?.value || defaultValue),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({
    top: 44,
    bottom: 34,
    left: 0,
    right: 0,
  })),
}));



jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: jest.fn(() => ({
    Navigator: 'StackNavigator',
    Screen: 'StackScreen',
  })),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
  })),
  useFocusEffect: jest.fn(),
}));