import { ReactNode } from 'react';

// Generic component props
export interface BaseProps {
  className?: string;
  children?: ReactNode;
}

// ID type for entities
export type EntityId = string;

// Result type for operations that can fail
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// Async result type
export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

// Nullable type helper
export type Nullable<T> = T | null;

// Optional type helper
export type Optional<T> = T | undefined;

// Deep partial type
export type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

// Props with required children
export interface WithChildren {
  children: ReactNode;
}

// Props with optional children
export interface WithOptionalChildren {
  children?: ReactNode;
}

// Generic callback types
export type VoidCallback = () => void;
export type AsyncCallback = () => Promise<void>;
export type ValueCallback<T> = (value: T) => void;

// Status types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: Nullable<T>;
  status: LoadingState;
  error: Nullable<Error>;
}

// Pagination
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
