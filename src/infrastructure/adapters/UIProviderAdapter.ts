/**
 * UI Provider Adapter
 * Adapts external UI implementations to our IUIProvider interface
 */

import type { DesignTokens } from "@umituz/react-native-design-system";
import type { IUIProvider } from "../types/UI.types";

export class UIProviderAdapter implements IUIProvider {
  private theme: DesignTokens | null = null;
  private localization: Record<string, unknown> | null = null;

  constructor(theme?: DesignTokens, localization?: Record<string, unknown>) {
    this.theme = theme || null;
    this.localization = localization || null;
  }

  getTheme(): DesignTokens | null {
    return this.theme;
  }

  getLocalization(): Record<string, unknown> | null {
    return this.localization;
  }

  updateTheme(theme: DesignTokens): void {
    this.theme = theme;
  }

  updateLocalization(localization: Record<string, unknown>): void {
    this.localization = localization;
  }
}

/**
 * Create UI provider from theme and localization implementations
 */
export function createUIProvider(
  theme?: DesignTokens,
  localization?: Record<string, unknown>
): IUIProvider {
  return new UIProviderAdapter(theme, localization);
}
