/**
 * UI Provider Interface
 * Generic interface for theme and localization providers
 */

import type { DesignTokens } from "@umituz/react-native-design-system";

export interface IUIProvider {
  getTheme(): DesignTokens | null;
  getLocalization(): Record<string, unknown> | null;
}
