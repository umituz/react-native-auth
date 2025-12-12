/**
 * Auth Event Service
 * Handles authentication event emission and management
 */

import { DeviceEventEmitter } from "react-native";

export interface AuthEventPayload {
  userId?: string;
  error?: string;
  timestamp: number;
}

export interface AuthEventListener {
  (payload: AuthEventPayload): void;
}

export class AuthEventService {
  private static instance: AuthEventService;
  private listeners: Map<string, AuthEventListener[]> = new Map();

  private constructor() {}

  static getInstance(): AuthEventService {
    if (!AuthEventService.instance) {
      AuthEventService.instance = new AuthEventService();
    }
    return AuthEventService.instance;
  }

  emitUserAuthenticated(userId: string): void {
    const payload: AuthEventPayload = {
      userId,
      timestamp: Date.now(),
    };

    DeviceEventEmitter.emit("user-authenticated", payload);
    this.notifyListeners("user-authenticated", payload);
  }

  emitGuestModeEnabled(): void {
    const payload: AuthEventPayload = {
      timestamp: Date.now(),
    };

    DeviceEventEmitter.emit("guest-mode-enabled", payload);
    this.notifyListeners("guest-mode-enabled", payload);
  }

  emitAuthError(error: string): void {
    const payload: AuthEventPayload = {
      error,
      timestamp: Date.now(),
    };

    DeviceEventEmitter.emit("auth-error", payload);
    this.notifyListeners("auth-error", payload);
  }

  addEventListener(event: string, listener: AuthEventListener): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    const eventListeners = this.listeners.get(event)!;
    eventListeners.push(listener);

    // Return cleanup function
    return () => {
      const index = eventListeners.indexOf(listener);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    };
  }

  removeAllListeners(event?: string): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  private notifyListeners(event: string, payload: AuthEventPayload): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(listener => {
        try {
          listener(payload);
        } catch (error) {
          if (__DEV__) {
            console.error(`Error in auth event listener for ${event}:`, error);
          }
        }
      });
    }
  }
}

// Export singleton instance for backward compatibility
export const authEventService = AuthEventService.getInstance();

// Legacy functions for backward compatibility
export function emitUserAuthenticated(userId: string): void {
  authEventService.emitUserAuthenticated(userId);
}

export function emitGuestModeEnabled(): void {
  authEventService.emitGuestModeEnabled();
}

export function emitAuthError(error: string): void {
  authEventService.emitAuthError(error);
}