'use client';

import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '@/domain/portfolio/entities/Project';
import { Badge } from '@/presentation/components/ui/Badge';
import { Button } from '@/presentation/components/ui/Button';
import { Typography } from '@/presentation/components/ui/Typography';
import { useFocusManagement } from '@/presentation/hooks/useFocusManagement';
import { cn } from '@/shared/utils/cn';

export interface ProjectModalProps {
  /** Project to display (null to close modal) */
  project: Project | null;
  /** Close handler */
  onClose: () => void;
}

/**
 * Type badge color mapping
 */
const TYPE_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  oss: {
    bg: 'bg-success-500/20',
    text: 'text-success-400',
    border: 'border-success-500/30',
  },
  professional: {
    bg: 'bg-accent-500/20',
    text: 'text-accent-400',
    border: 'border-accent-500/30',
  },
  personal: {
    bg: 'bg-primary-500/20',
    text: 'text-primary-400',
    border: 'border-primary-500/30',
  },
};

/**
 * Type labels
 */
const TYPE_LABELS: Record<string, string> = {
  oss: 'Open Source',
  professional: 'Professional',
  personal: 'Personal',
};

/**
 * GitHub icon component
 */
function GitHubIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10Z" />
    </svg>
  );
}

/**
 * External link icon component
 */
function ExternalLinkIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
      />
    </svg>
  );
}

/**
 * Close icon component
 */
function CloseIcon() {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

/**
 * Project detail modal with focus trap and escape to close.
 * Follows WCAG 2.1 AA accessibility guidelines.
 */
export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Use the reusable focus management hook
  useFocusManagement({
    containerRef: modalRef,
    enabled: !!project,
    restoreFocus: true,
    initialFocusRef: closeButtonRef,
  });

  // Handle escape key
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  // Setup keyboard listeners and body scroll lock
  useEffect(() => {
    if (!project) return;

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [project, handleKeyDown]);

  const typeColor = project
    ? TYPE_COLORS[project.type] || TYPE_COLORS.personal
    : TYPE_COLORS.personal;
  const typeLabel = project ? TYPE_LABELS[project.type] || project.type : '';

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            aria-describedby="project-modal-description"
            className={cn(
              'fixed top-1/2 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2',
              'max-h-[90vh] overflow-y-auto',
              'rounded-2xl border border-white/10 bg-gray-900/95 shadow-2xl backdrop-blur-md',
              'focus:outline-none'
            )}
            tabIndex={-1}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/10 p-6">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      typeColor.bg,
                      typeColor.text,
                      typeColor.border
                    )}
                  >
                    {typeLabel}
                  </Badge>
                  {project.featured && (
                    <Badge
                      variant="secondary"
                      className="border-amber-500/30 bg-amber-500/20 text-amber-400"
                    >
                      Featured
                    </Badge>
                  )}
                </div>
                <Typography
                  id="project-modal-title"
                  variant="h3"
                  className="leading-tight"
                >
                  {project.title}
                </Typography>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="focus:ring-primary-500 rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white focus:ring-2 focus:outline-none"
                aria-label="Close modal"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Description */}
              <div className="mb-6">
                <Typography variant="h5" className="mb-2">
                  About
                </Typography>
                <Typography
                  id="project-modal-description"
                  variant="body"
                  muted
                  className="leading-relaxed"
                >
                  {project.description}
                </Typography>
              </div>

              {/* Technologies */}
              <div className="mb-6">
                <Typography variant="h5" className="mb-3">
                  Technologies
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.items.map(tech => (
                    <Badge key={tech} variant="primary" size="md">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Links */}
              {(project.hasGithub() || project.hasLiveDemo()) && (
                <div>
                  <Typography variant="h5" className="mb-3">
                    Links
                  </Typography>
                  <div className="flex flex-wrap gap-3">
                    {project.hasGithub() && (
                      <Button
                        variant="outline"
                        leftIcon={<GitHubIcon />}
                        onClick={() =>
                          window.open(
                            project.githubUrl!,
                            '_blank',
                            'noopener,noreferrer'
                          )
                        }
                      >
                        View on GitHub
                      </Button>
                    )}
                    {project.hasLiveDemo() && (
                      <Button
                        variant="primary"
                        leftIcon={<ExternalLinkIcon />}
                        onClick={() =>
                          window.open(
                            project.liveUrl!,
                            '_blank',
                            'noopener,noreferrer'
                          )
                        }
                      >
                        Live Demo
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ProjectModal;
