import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { SITE_CONFIG } from '@/shared/config/site';
import { Header } from '@/presentation/components/layout/Header';
import { Footer } from '@/presentation/components/layout/Footer';
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
    'Spark',
    'Data Engineering',
    'Cloud',
    'Machine Learning',
    'Portfolio',
  ],
  authors: [{ name: SITE_CONFIG.author.name }],
  creator: SITE_CONFIG.author.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.siteUrl,
    title: SITE_CONFIG.siteTitle,
    description: SITE_CONFIG.siteDescription,
    siteName: SITE_CONFIG.author.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.siteTitle,
    description: SITE_CONFIG.siteDescription,
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
};

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} bg-gray-900 font-sans text-white antialiased`}
      >
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
