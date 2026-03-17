/**
 * Auth Error Display Component
 * Displays authentication errors using design system tokens
 * PERFORMANCE: Memoized to prevent unnecessary re-renders when parent updates
 */

import React, { memo } from "react";
import { AlertInline, AlertService, AlertMode } from "@umituz/react-native-design-system/molecules";

interface AuthErrorDisplayProps {
  error: string | null;
}

export const AuthErrorDisplay = memo<AuthErrorDisplayProps>(({ error }) => {
  const alert = React.useMemo(() => {
    if (!error) return null;
    return AlertService.createErrorAlert(error, undefined, {
      mode: AlertMode.INLINE,
    });
  }, [error]);

  if (!alert) {
    return null;
  }

  return <AlertInline alert={alert} />;
});

AuthErrorDisplay.displayName = 'AuthErrorDisplay';











