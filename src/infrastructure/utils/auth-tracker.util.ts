import {
    trackPackageError as sentryTrack,
    addPackageBreadcrumb as sentryBreadcrumb
    // @ts-expect-error - Module def issue in node_modules vs types
} from "@umituz/react-native-sentry";

export const authTracker = {
    logOperationStarted: (operation: string, data?: Record<string, unknown>) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call
        (sentryBreadcrumb as any)("auth", `${operation} started`, data);
    },

    logOperationSuccess: (operation: string, data?: Record<string, unknown>) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call
        (sentryBreadcrumb as any)("auth", `${operation} successful`, data);
    },

    logOperationError: (operation: string, error: unknown, context?: Record<string, unknown>) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call
        (sentryTrack as any)(
            error instanceof Error ? error : new Error(`${operation} failed`),
            {
                packageName: "auth",
                operation,
                ...context,
            }
        );
    }
};
