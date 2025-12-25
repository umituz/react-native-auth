/**
 * UI Provider Adapter
 * Adapts external UI implementations to our IUIProvider interface
 */

import type { DesignTokens } from "@umituz/react-native-design-system";
import type { IUIProvider } from "../services/AuthPackage";

export class UIProviderAdapter implements IUIProvider {
  private theme: DesignTokens | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private localization: any = null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(theme?: DesignTokens, localization?: any) {
    this.theme = theme || null;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.localization = localization || null;
  }

  getTheme(): DesignTokens | null {
    return this.theme;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getLocalization(): any {
    return this.localization;
  }

  updateTheme(theme: DesignTokens): void {
    this.theme = theme;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateLocalization(localization: any): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.localization = localization;
  }
}

/**
 * Create UI provider from theme and localization implementations
 */
export function createUIProvider(
  theme?: DesignTokens,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  localization?: any
): IUIProvider {
  return new UIProviderAdapter(theme, localization);
}