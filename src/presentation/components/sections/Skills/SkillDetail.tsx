'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { Skill } from '@/domain/portfolio/entities/Skill';
import { Badge } from '@/presentation/components/ui/Badge';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/presentation/components/ui/Card';
import { Typography } from '@/presentation/components/ui/Typography';
import { CATEGORY_COLORS } from '@/presentation/three/scenes/SkillsGlobe/domain/SkillNode';
import { cn } from '@/shared/utils/cn';

export interface SkillDetailProps {
  /** Selected skill (null shows empty state) */
  skill: Skill | null;
  /** Callback to close the panel */
  onClose?: () => void;
  /** Additional class names */
  className?: string;
}

/**
 * Proficiency bar component
 */
function ProficiencyBar({
  level,
  className,
}: {
  level: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'h-2 w-full overflow-hidden rounded-full bg-white/10',
        className
      )}
    >
      <motion.div
        className="bg-primary-500 h-full rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${level}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  );
}

/**
 * Slide-in panel showing skill details.
 */
export function SkillDetail({ skill, onClose, className }: SkillDetailProps) {
  return (
    <AnimatePresence mode="wait">
      {skill ? (
        <motion.div
          key={skill.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
          className={className}
        >
          <Card variant="glass" hover={false}>
            <CardHeader className="relative">
              {/* Close button */}
              {onClose && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 rounded-full p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Close details"
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}

              <div className="flex items-start gap-3">
                {/* Category color indicator */}
                <div
                  className="mt-1 h-3 w-3 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[skill.category] }}
                  aria-hidden="true"
                />
                <div>
                  <Typography variant="h4" className="mb-1">
                    {skill.name}
                  </Typography>
                  <Badge variant="primary" size="sm">
                    {skill.getCategoryLabel()}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Proficiency */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <Typography variant="body-sm" muted>
                    Proficiency
                  </Typography>
                  <Typography
                    variant="body-sm"
                    className="text-white capitalize"
                  >
                    {skill.proficiency}
                  </Typography>
                </div>
                <ProficiencyBar level={skill.getProficiencyPercentage()} />
              </div>

              {/* Years of experience */}
              <div className="flex items-center justify-between">
                <Typography variant="body-sm" muted>
                  Experience
                </Typography>
                <Typography variant="body-sm" className="text-white">
                  {skill.yearsOfExperience}{' '}
                  {skill.yearsOfExperience === 1 ? 'year' : 'years'}
                </Typography>
              </div>

              {/* Expert/Advanced badge */}
              {skill.isAdvanced() && (
                <div className="flex justify-end pt-2">
                  <Badge
                    variant={skill.isExpert() ? 'secondary' : 'primary'}
                    size="sm"
                  >
                    {skill.isExpert() ? 'Expert' : 'Advanced'}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={className}
        >
          <Card variant="glass" hover={false}>
            <CardContent className="py-8 text-center">
              <div className="text-primary-500/50 mb-3 text-4xl">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                  />
                </svg>
              </div>
              <Typography variant="body" muted>
                Select a skill to see details
              </Typography>
              <Typography variant="body-sm" muted className="mt-1">
                Click on any skill node on the globe
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
