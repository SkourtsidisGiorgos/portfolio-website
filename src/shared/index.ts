// Config exports
export { siteConfig, type SiteConfig } from './config/site.config';
export {
  navigationConfig,
  sectionIds,
  type NavItem,
  type SectionId,
} from './config/navigation.config';

// Constants exports
export { colors, type Colors } from './constants/colors';
export {
  breakpoints,
  mediaQueries,
  type Breakpoint,
  type MediaQuery,
} from './constants/breakpoints';

// Types exports
export type {
  BaseProps,
  EntityId,
  Result,
  AsyncResult,
  Nullable,
  Optional,
  DeepPartial,
  WithChildren,
  WithOptionalChildren,
  VoidCallback,
  AsyncCallback,
  ValueCallback,
  LoadingState,
  AsyncState,
} from './types/common';

// Utils exports
export { cn } from './utils/cn';
export {
  formatDate,
  formatDateRange,
  calculateDuration,
  truncate,
  capitalize,
  toTitleCase,
  slugify,
} from './utils/formatters';
