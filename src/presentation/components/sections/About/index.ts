// Main component
export { About } from './About';
export type { AboutProps } from './About';

// Layout components
export { BentoGrid } from './BentoGrid';
export type { BentoGridProps } from './BentoGrid';

export { BentoCell } from './BentoCell';
export type { BentoCellProps, BentoCellSize } from './BentoCell';

// Card components
export { AboutCard } from './AboutCard';
export type { AboutCardProps, AboutCardVariant } from './AboutCard';

export { MetricCard } from './MetricCard';
export type { MetricCardProps } from './MetricCard';

export { HighlightCard } from './HighlightCard';
export type { HighlightCardProps } from './HighlightCard';

export { ProfileImage } from './ProfileImage';
export type { ProfileImageProps } from './ProfileImage';

// Domain exports
export {
  AboutMetric,
  AboutConfig,
  type AboutMetricIcon,
  type AboutMetricOptions,
  type ProfileInfo,
  type HighlightInfo,
  type BentoSize,
  type GridItem,
  type AboutConfigOptions,
} from './domain';
