/**
 * User Profile Types
 * Domain types for user profile management across all apps
 */

export interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    isAnonymous: boolean;
    createdAt: Date | null;
    lastLoginAt: Date | null;
}

export interface UpdateProfileParams {
    displayName?: string;
    photoURL?: string;
}
