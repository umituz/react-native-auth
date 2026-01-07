/**
 * UI Provider Interface
 * Generic interface for theme and localization providers
 */

import type { DesignTokens } from "@umituz/react-native-design-system";

export interface IUIProvider {
  getTheme(): DesignTokens | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getLocalization(): any;
}
