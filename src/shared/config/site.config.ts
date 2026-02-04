export const siteConfig = {
  name: 'Giorgos Skourtsidis',
  title: 'Giorgos Skourtsidis | Big Data & Software Engineer',
  description:
    'Portfolio of Giorgos Skourtsidis, a Big Data & Software Engineer with 4+ years of experience in telecommunications and fintech. Specializing in ETL pipelines, distributed systems, and data engineering.',
  url: 'https://giorgos-skourtsidis.dev',
  author: {
    name: 'Giorgos Skourtsidis',
    email: 'gskourtsidis@gmail.com',
    role: 'Big Data & Software Engineer',
    location: 'Athens, Greece',
  },
  social: {
    github: 'https://github.com/SkourtsidisGiorgos',
    linkedin: 'https://linkedin.com/in/gskourtsidis',
    email: 'mailto:gskourtsidis@gmail.com',
  },
  keywords: [
    'Big Data Engineer',
    'Software Engineer',
    'Data Engineering',
    'ETL',
    'Apache Spark',
    'Kubernetes',
    'Python',
    'Java',
    'TypeScript',
  ],
} as const;

export type SiteConfig = typeof siteConfig;

// Alias for backward compatibility with imports expecting SITE_CONFIG
export const SITE_CONFIG = {
  siteTitle: siteConfig.title,
  siteDescription: siteConfig.description,
  siteUrl: siteConfig.url,
  author: siteConfig.author,
  social: siteConfig.social,
  socialLinks: siteConfig.social, // Alias for Footer component
  keywords: siteConfig.keywords,
} as const;
