/**
 * Auth Conversion Detector
 * Detects anonymous-to-authenticated user conversions
 */

export interface ConversionState {
  previousUserId: string | null;
  wasAnonymous: boolean;
}

interface ConversionResult {
  isConversion: boolean;
  isSameUser: boolean;
  isNewUser: boolean;
}

/**
 * Detects if current auth state represents a conversion
 * from anonymous to authenticated user
 */
export function detectConversion(
  state: ConversionState,
  currentUserId: string,
  isCurrentlyAnonymous: boolean
): ConversionResult {
  const { previousUserId, wasAnonymous } = state;

  // Same UID, anonymous flag changed (linkWithCredential)
  const isSameUser =
    previousUserId === currentUserId && wasAnonymous && !isCurrentlyAnonymous;

  // Different UID after anonymous (account creation with new credentials)
  const isNewUser =
    !!previousUserId &&
    previousUserId !== currentUserId &&
    wasAnonymous &&
    !isCurrentlyAnonymous;

  return {
    isConversion: isSameUser || isNewUser,
    isSameUser,
    isNewUser,
  };
}
