'use client';

import { motion } from 'framer-motion';
import type { Skill, SkillCategory } from '@/domain/portfolio/entities/Skill';
import { Badge } from '@/presentation/components/ui/Badge';
import { Card, CardContent } from '@/presentation/components/ui/Card';
import { Typography } from '@/presentation/components/ui/Typography';
import { CATEGORY_COLORS } from '@/presentation/three/scenes/SkillsGlobe/domain/SkillNode';
import { cn } from '@/shared/utils/cn';

export interface SkillsListProps {
  /** Skills to display */
  skills: Skill[];
  /** Whether to group by category */
  groupByCategory?: boolean;
  /** Selected category filter (null = show all) */
  selectedCategory?: SkillCategory | null;
  /** Currently selected skill */
  selectedSkill?: Skill | null;
  /** Callback when skill is clicked */
  onSkillClick?: (skill: Skill) => void;
  /** Additional class names */
  className?: string;
}

/**
 * Proficiency bar component
 */
function ProficiencyBar({ level, color }: { level: number; color: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${level}%` }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
      />
    </div>
  );
}

/**
 * Single skill card component
 */
function SkillCard({
  skill,
  selected,
  onClick,
  delay = 0,
}: {
  skill: Skill;
  selected: boolean;
  onClick?: () => void;
  delay?: number;
}) {
  const color = CATEGORY_COLORS[skill.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card
        variant={selected ? 'solid' : 'glass'}
        hover
        className={cn(
          'cursor-pointer transition-all',
          selected && 'ring-primary-500/50 ring-2'
        )}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: color }}
                aria-hidden="true"
              />
              <Typography variant="body" className="font-medium">
                {skill.name}
              </Typography>
            </div>
            <Badge
              variant="default"
              size="sm"
              animated={false}
              className="capitalize"
            >
              {skill.proficiency}
            </Badge>
          </div>
          <ProficiencyBar
            level={skill.getProficiencyPercentage()}
            color={color}
          />
          <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
            <span>{skill.getCategoryLabel()}</span>
            <span>
              {skill.yearsOfExperience}{' '}
              {skill.yearsOfExperience === 1 ? 'yr' : 'yrs'}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/**
 * Category labels
 */
const CATEGORY_LABELS: Record<SkillCategory, string> = {
  languages: 'Languages',
  bigdata: 'Big Data',
  devops: 'DevOps',
  aiml: 'AI/ML',
  databases: 'Databases',
  backend: 'Backend',
  frontend: 'Frontend',
  other: 'Other',
};

/**
 * Category order
 */
const CATEGORY_ORDER: SkillCategory[] = [
  'languages',
  'bigdata',
  'devops',
  'databases',
  'backend',
  'aiml',
  'frontend',
  'other',
];

/**
 * Mobile-friendly skills list fallback.
 * Groups skills by category with expandable sections.
 */
export function SkillsList({
  skills,
  groupByCategory = true,
  selectedCategory = null,
  selectedSkill = null,
  onSkillClick,
  className,
}: SkillsListProps) {
  // Filter skills by category if selected
  const filteredSkills =
    selectedCategory === null
      ? skills
      : skills.filter(s => s.category === selectedCategory);

  // Group skills by category
  const groupedSkills = groupByCategory
    ? CATEGORY_ORDER.reduce(
        (acc, category) => {
          const categorySkills = filteredSkills.filter(
            s => s.category === category
          );
          if (categorySkills.length > 0) {
            acc[category] = categorySkills;
          }
          return acc;
        },
        {} as Record<SkillCategory, Skill[]>
      )
    : null;

  if (groupByCategory && groupedSkills) {
    return (
      <div className={cn('space-y-6', className)}>
        {Object.entries(groupedSkills).map(
          ([category, categorySkills], groupIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: groupIndex * 0.1 }}
            >
              <div className="mb-3 flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: CATEGORY_COLORS[category as SkillCategory],
                  }}
                  aria-hidden="true"
                />
                <Typography variant="h5">
                  {CATEGORY_LABELS[category as SkillCategory]}
                </Typography>
                <Badge variant="default" size="sm" animated={false}>
                  {categorySkills.length}
                </Badge>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {categorySkills.map((skill, index) => (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                    selected={selectedSkill?.id === skill.id}
                    onClick={() => onSkillClick?.(skill)}
                    delay={index * 0.05}
                  />
                ))}
              </div>
            </motion.div>
          )
        )}
      </div>
    );
  }

  // Flat list
  return (
    <div className={cn('grid gap-3 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {filteredSkills.map((skill, index) => (
        <SkillCard
          key={skill.id}
          skill={skill}
          selected={selectedSkill?.id === skill.id}
          onClick={() => onSkillClick?.(skill)}
          delay={index * 0.05}
        />
      ))}
    </div>
  );
}

export default SkillsList;
