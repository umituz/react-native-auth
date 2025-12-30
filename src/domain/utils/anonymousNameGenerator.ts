/**
 * Anonymous User Name Generator
 * Generates friendly, random names for anonymous users
 * Fully generic - no app-specific content
 */

const DEFAULT_NAMES = [
    'Alex',
    'Sam',
    'Jordan',
    'Taylor',
    'Morgan',
    'Casey',
    'Riley',
    'Avery',
    'Quinn',
    'Blake',
    'Charlie',
    'Dakota',
    'Eden',
    'Finley',
    'Harper',
    'Sage',
    'River',
    'Skylar',
    'Rowan',
    'Phoenix',
];

export interface AnonymousNameConfig {
    names?: string[];
    prefixes?: string[];
    usePrefixes?: boolean;
}

/**
 * Generate a random anonymous name
 * Uses userId to ensure consistency per user
 */
export function generateAnonymousName(
    userId?: string,
    config?: AnonymousNameConfig,
): string {
    const names = config?.names || DEFAULT_NAMES;
    const prefixes = config?.prefixes || [];
    const usePrefixes = config?.usePrefixes ?? false;

    if (!userId) {
        const randomIndex = Math.floor(Math.random() * names.length);
        return names[randomIndex] ?? "Anonymous";
    }

    // Use userId hash for consistent name per user
    const hash = userId.split('').reduce((acc, char) => {
        return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
    }, 0);

    const nameIndex = Math.abs(hash) % names.length;
    const name = names[nameIndex] ?? "Anonymous";

    if (usePrefixes && prefixes.length > 0) {
        const prefixIndex = Math.abs(hash >> 8) % prefixes.length;
        return `${prefixes[prefixIndex]} ${name}`;
    }

    return name;
}

/**
 * Get anonymous display name with fallback
 */
export function getAnonymousDisplayName(
    userId?: string,
    fallback = 'Anonymous',
    config?: AnonymousNameConfig,
): string {
    if (!userId) return fallback;
    return generateAnonymousName(userId, config);
}
