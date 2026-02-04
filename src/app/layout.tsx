import { Inter, JetBrains_Mono } from 'next/font/google';
import { Footer } from '@/presentation/components/layout/Footer';
import { Header } from '@/presentation/components/layout/Header';
import { SITE_CONFIG, siteConfig } from '@/shared/config/site';
import type { Metadata, Viewport } from 'next';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.siteUrl),
  title: {
    default: SITE_CONFIG.siteTitle,
    template: `%s | ${SITE_CONFIG.author.name}`,
  },
  description: SITE_CONFIG.siteDescription,
  keywords: [
    'Big Data Engineer',
    'Software Engineer',
    'Python',
    'Apache Spark',
    'Data Engineering',
    'Cloud Architecture',
    'Kubernetes',
    'ETL Pipelines',
    'Machine Learning',
    'Portfolio',
    'Giorgos Skourtsidis',
  ],
  authors: [{ name: SITE_CONFIG.author.name }],
  creator: SITE_CONFIG.author.name,
  publisher: SITE_CONFIG.author.name,
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.siteUrl,
    title: SITE_CONFIG.siteTitle,
    description: SITE_CONFIG.siteDescription,
    siteName: SITE_CONFIG.author.name,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.author.name} - ${SITE_CONFIG.author.role}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.siteTitle,
    description: SITE_CONFIG.siteDescription,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  colorScheme: 'dark',
};

/**
 * JSON-LD structured data for SEO
 */
function JsonLd() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.author.name,
    jobTitle: siteConfig.author.role,
    url: siteConfig.url,
    email: siteConfig.author.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.author.location,
    },
    sameAs: [siteConfig.social.github, siteConfig.social.linkedin],
    knowsAbout: [
      'Big Data',
      'Data Engineering',
      'Apache Spark',
      'Python',
      'Kubernetes',
      'Cloud Computing',
      'ETL Pipelines',
      'Distributed Systems',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <JsonLd />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen bg-[#0a0a0f] font-sans text-white antialiased`}
      >
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-cyan-500 focus:px-4 focus:py-2 focus:text-white focus:outline-none"
        >
          Skip to main content
        </a>

        {/* Navigation header */}
        <Header />

        {/* Main content area */}
        <main id="main-content" className="relative min-h-screen">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
