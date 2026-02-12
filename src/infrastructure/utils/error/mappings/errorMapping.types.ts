/**
 * Error Mapping Types
 * Shared types for error code mappings
 */

export type ErrorConstructor = new (message?: string) => Error;
export type ErrorFactory = () => Error;

export interface ErrorMapping {
  type: "class" | "factory";
  create: ErrorConstructor | ErrorFactory;
}
