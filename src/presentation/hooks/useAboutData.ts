import { useMemo } from 'react';
import aboutData from '@/data/about.json';
import {
  AboutConfig,
  type ProfileInfo,
  type HighlightInfo,
} from '@/presentation/components/sections/About/domain/AboutConfig';
import {
  AboutMetric,
  type AboutMetricIcon,
} from '@/presentation/components/sections/About/domain/AboutMetric';

/**
 * Raw metric data from JSON
 */
interface RawMetric {
  value: string | number;
  label: string;
  icon: string;
  description?: string;
}

/**
 * Raw highlight data from JSON
 */
interface RawHighlight {
  id: string;
  title: string;
  content: string;
  icon: string;
  link?: string;
}

/**
 * Return type for useAboutData hook
 */
export interface UseAboutDataReturn {
  config: AboutConfig;
  profile: ProfileInfo;
  metrics: AboutMetric[];
  highlights: HighlightInfo[];
  isLoading: boolean;
}

/**
 * Custom hook for about section data.
 * Single Responsibility: only handles data fetching and transformation.
 * Follows Dependency Inversion: returns domain value objects.
 */
export function useAboutData(): UseAboutDataReturn {
  const config = useMemo(() => {
    // Transform raw metrics to AboutMetric value objects
    const metrics = (aboutData.metrics as RawMetric[]).map(raw =>
      AboutMetric.create({
        value: raw.value,
        label: raw.label,
        icon: raw.icon as AboutMetricIcon,
        description: raw.description,
      })
    );

    // Transform highlights with proper typing
    const highlights: HighlightInfo[] = (
      aboutData.highlights as RawHighlight[]
    ).map(raw => ({
      id: raw.id,
      title: raw.title,
      content: raw.content,
      icon: raw.icon as AboutMetricIcon,
      link: raw.link,
    }));

    // Create AboutConfig from data
    return AboutConfig.fromData({
      profile: aboutData.profile as ProfileInfo,
      metrics,
      highlights,
    });
  }, []);

  return {
    config,
    profile: config.getProfileInfo(),
    metrics: [...config.getMetrics()],
    highlights: [...config.getHighlights()],
    isLoading: false,
  };
}
