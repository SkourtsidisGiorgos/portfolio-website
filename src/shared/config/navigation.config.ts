export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export const navigationConfig: NavItem[] = [
  { id: 'hero', label: 'Home', href: '#hero' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'skills', label: 'Skills', href: '#skills' },
  { id: 'experience', label: 'Experience', href: '#experience' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'contact', label: 'Contact', href: '#contact' },
] as const;

export const sectionIds = navigationConfig.map(item => item.id);

export type SectionId = (typeof sectionIds)[number];
