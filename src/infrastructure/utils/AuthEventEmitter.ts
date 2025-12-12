/**
 * Auth Event Emitter
 * Single Responsibility: Emit auth-related events
 */

import { DeviceEventEmitter } from "react-native";

/**
 * Emit user authenticated event
 */
export function emitUserAuthenticated(userId: string): void {
  /* eslint-disable-next-line no-console */
  if (__DEV__) {
    console.log("[AuthEventEmitter] Emitting user-authenticated event");
  }
  DeviceEventEmitter.emit("user-authenticated", { userId });
}

/**
 * Emit guest mode enabled event
 */
export function emitGuestModeEnabled(): void {
  /* eslint-disable-next-line no-console */
  if (__DEV__) {
    console.log("[AuthEventEmitter] Emitting guest-mode-enabled event");
  }
  DeviceEventEmitter.emit("guest-mode-enabled");
}

