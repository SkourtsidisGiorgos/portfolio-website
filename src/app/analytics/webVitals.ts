/**
 * Web Vitals Tracking
 *
 * Tracks Core Web Vitals and reports to analytics.
 * Single Responsibility: metrics collection.
 *
 * @module webVitals
 */

import { WEB_VITALS_THRESHOLDS } from '@/shared/config/performance.config';

/**
 * Web Vital metric types
 * Note: FID was deprecated in web-vitals v4+ in favor of INP
 */
export type WebVitalName = 'CLS' | 'FCP' | 'LCP' | 'TTFB' | 'INP';

/**
 * Web Vital metric data
 */
export interface WebVitalMetric {
  /** Metric name */
  name: WebVitalName;
  /** Metric value */
  value: number;
  /** Rating: good, needs-improvement, or poor */
  rating: 'good' | 'needs-improvement' | 'poor';
  /** Delta from previous measurement */
  delta: number;
  /** Metric ID for deduplication */
  id: string;
  /** Navigation type */
  navigationType: string;
}

/**
 * Callback for handling Web Vital metrics
 */
export type WebVitalCallback = (metric: WebVitalMetric) => void;

/**
 * Determines the rating for a metric based on thresholds.
 *
 * @param name - Metric name
 * @param value - Metric value
 * @returns Rating string
 */
function getRating(
  name: WebVitalName,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = WEB_VITALS_THRESHOLDS[name];
  if (!thresholds) return 'needs-improvement';

  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Default callback that logs to console in development.
 */
const defaultCallback: WebVitalCallback = metric => {
  if (process.env.NODE_ENV === 'development') {
    const emoji =
      metric.rating === 'good' ? '✅' : metric.rating === 'poor' ? '❌' : '⚠️';

    console.log(
      `${emoji} ${metric.name}:`,
      `${metric.value.toFixed(metric.name === 'CLS' ? 3 : 0)}`,
      `(${metric.rating})`
    );
  }
};

/**
 * Stored callbacks for metrics
 */
let callbacks: WebVitalCallback[] = [defaultCallback];

/**
 * Registers a callback for Web Vital metrics.
 *
 * @param callback - Callback function to receive metrics
 */
export function onWebVitals(callback: WebVitalCallback): void {
  callbacks.push(callback);
}

/**
 * Removes a callback.
 *
 * @param callback - Callback to remove
 */
export function offWebVitals(callback: WebVitalCallback): void {
  callbacks = callbacks.filter(cb => cb !== callback);
}

/**
 * Reports a metric to all registered callbacks.
 *
 * @param metric - Metric to report
 */
function reportMetric(metric: WebVitalMetric): void {
  callbacks.forEach(callback => {
    try {
      callback(metric);
    } catch (error) {
      console.error('Error in Web Vitals callback:', error);
    }
  });
}

/**
 * Creates a metric object from web-vitals library format.
 */
function createMetric(
  name: WebVitalName,
  value: number,
  delta: number,
  id: string,
  navigationType: string
): WebVitalMetric {
  return {
    name,
    value,
    rating: getRating(name, value),
    delta,
    id,
    navigationType,
  };
}

/**
 * Initializes Web Vitals tracking.
 * Call this once at app initialization.
 *
 * @example
 * ```tsx
 * // In _app.tsx or layout.tsx
 * useEffect(() => {
 *   initWebVitals();
 * }, []);
 * ```
 */
export async function initWebVitals(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    // Dynamic import to avoid bundling in SSR
    // Note: web-vitals v4+ removed onFID in favor of onINP
    const { onCLS, onFCP, onLCP, onTTFB, onINP } = await import('web-vitals');

    // Register all metrics
    onCLS(metric => {
      reportMetric(
        createMetric(
          'CLS',
          metric.value,
          metric.delta,
          metric.id,
          metric.navigationType || 'navigate'
        )
      );
    });

    onFCP(metric => {
      reportMetric(
        createMetric(
          'FCP',
          metric.value,
          metric.delta,
          metric.id,
          metric.navigationType || 'navigate'
        )
      );
    });

    onLCP(metric => {
      reportMetric(
        createMetric(
          'LCP',
          metric.value,
          metric.delta,
          metric.id,
          metric.navigationType || 'navigate'
        )
      );
    });

    onTTFB(metric => {
      reportMetric(
        createMetric(
          'TTFB',
          metric.value,
          metric.delta,
          metric.id,
          metric.navigationType || 'navigate'
        )
      );
    });

    onINP(metric => {
      reportMetric(
        createMetric(
          'INP',
          metric.value,
          metric.delta,
          metric.id,
          metric.navigationType || 'navigate'
        )
      );
    });
  } catch (error) {
    // web-vitals not available
    if (process.env.NODE_ENV === 'development') {
      console.warn('Web Vitals not available:', error);
    }
  }
}

/**
 * Sends metrics to an analytics endpoint.
 *
 * @param endpoint - Analytics endpoint URL
 * @returns Callback function for onWebVitals
 */
export function createAnalyticsReporter(endpoint: string): WebVitalCallback {
  return (metric: WebVitalMetric) => {
    // Only report in production
    if (process.env.NODE_ENV !== 'production') return;

    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
      page: window.location.pathname,
      timestamp: Date.now(),
    });

    // Use sendBeacon for reliability
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, body);
    } else {
      // Fallback to fetch
      fetch(endpoint, {
        body,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      }).catch(() => {
        // Ignore errors - analytics should not block
      });
    }
  };
}

/**
 * Gets a summary of all collected metrics.
 * Useful for debugging and testing.
 */
export function getMetricsSummary(): Map<WebVitalName, WebVitalMetric[]> {
  // This would need state storage to work properly
  // For now, return empty map - metrics are reported via callbacks
  return new Map();
}
