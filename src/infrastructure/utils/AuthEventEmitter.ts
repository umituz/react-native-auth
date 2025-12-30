/**
 * Auth Event Emitter
 * Single Responsibility: Emit auth-related events
 */

import { DeviceEventEmitter } from "react-native";

export function emitUserAuthenticated(userId: string): void {
  DeviceEventEmitter.emit("user-authenticated", { userId });
}

export function emitAnonymousModeEnabled(): void {
  DeviceEventEmitter.emit("anonymous-mode-enabled");
}
