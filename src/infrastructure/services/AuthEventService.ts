/**
 * Auth Event Service
 * Handles authentication event emission and management
 */

import { DeviceEventEmitter } from "react-native";

interface AuthEventPayload {
  userId?: string;
  error?: string;
  timestamp: number;
}

interface AuthEventListener {
  (payload: AuthEventPayload): void;
}

class AuthEventService {
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

  emitAnonymousModeEnabled(): void {
    const payload: AuthEventPayload = {
      timestamp: Date.now(),
    };

    DeviceEventEmitter.emit("anonymous-mode-enabled", payload);
    this.notifyListeners("anonymous-mode-enabled", payload);
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
    let eventListeners = this.listeners.get(event);
    if (!eventListeners) {
      eventListeners = [];
      this.listeners.set(event, eventListeners);
    }

    eventListeners.push(listener);

    // Return cleanup function
    return () => {
      const index = eventListeners.indexOf(listener);
      if (index > -1) {
        eventListeners.splice(index, 1);
        // Clean up empty arrays to prevent memory leaks
        if (eventListeners.length === 0) {
          this.listeners.delete(event);
        }
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
      // Copy array before iterating to prevent issues if a listener
      // removes itself or other listeners during notification
      const snapshot = [...eventListeners];
      for (const listener of snapshot) {
        try {
          listener(payload);
        } catch (error) {
          console.error(`[AuthEventService] Listener error for "${event}":`, error);
        }
      }
    }
  }
}

export const authEventService = AuthEventService.getInstance();

export function emitAnonymousModeEnabled(): void {
  authEventService.emitAnonymousModeEnabled();
}

