/**
 * UI Provider Adapter
 * Adapts external UI implementations to our IUIProvider interface
 */

import type { IUIProvider } from "../services/AuthPackage";

export class UIProviderAdapter implements IUIProvider {
  private theme: any;
  private localization: any;

  constructor(theme?: any, localization?: any) {
    this.theme = theme;
    this.localization = localization;
  }

  getTheme(): any {
    return this.theme;
  }

  getLocalization(): any {
    return this.localization;
  }

  updateTheme(theme: any): void {
    this.theme = theme;
  }

  updateLocalization(localization: any): void {
    this.localization = localization;
  }
}

/**
 * Create UI provider from theme and localization implementations
 */
export function createUIProvider(theme?: any, localization?: any): IUIProvider {
  return new UIProviderAdapter(theme, localization);
}