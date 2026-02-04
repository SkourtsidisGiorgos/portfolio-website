'use client';

import { motion } from 'framer-motion';
import { Typography } from '@/presentation/components/ui';
import { cn } from '@/shared/utils/cn';

export interface ContactInfoProps {
  email: string;
  location: string;
  availability?: string;
  className?: string;
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  delay?: number;
}

function InfoItem({ icon, label, value, href, delay = 0 }: InfoItemProps) {
  const content = (
    <div className="flex items-start gap-4">
      <div className="bg-primary-500/10 text-primary-400 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
        {icon}
      </div>
      <div>
        <Typography variant="body-sm" muted className="mb-1">
          {label}
        </Typography>
        <Typography
          variant="body"
          className={
            href
              ? 'text-primary-400 hover:text-primary-300 transition-colors'
              : ''
          }
        >
          {value}
        </Typography>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      {href ? (
        <a
          href={href}
          className="focus:ring-primary-500/50 block rounded-lg focus:ring-2 focus:outline-none"
        >
          {content}
        </a>
      ) : (
        content
      )}
    </motion.div>
  );
}

/**
 * Contact information display component.
 * Shows email, location, and availability status.
 */
export function ContactInfo({
  email,
  location,
  availability,
  className,
}: ContactInfoProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <InfoItem
        icon={
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
            />
          </svg>
        }
        label="Email"
        value={email}
        href={`mailto:${email}`}
        delay={0}
      />

      <InfoItem
        icon={
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
            />
          </svg>
        }
        label="Location"
        value={location}
        delay={0.1}
      />

      {availability && (
        <InfoItem
          icon={
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          }
          label="Availability"
          value={availability}
          delay={0.2}
        />
      )}
    </div>
  );
}
