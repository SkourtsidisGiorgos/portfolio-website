'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Section } from '@/presentation/components/layout/Section';
import { Typography } from '@/presentation/components/ui';
import { siteConfig } from '@/shared/config/site.config';
import { cn } from '@/shared/utils/cn';
import { ContactForm } from './ContactForm';
import { ContactInfo } from './ContactInfo';
import { SocialLinks, type SocialLink } from './SocialLinks';

export interface ContactProps {
  /** Section ID for navigation */
  id?: string;
  /** Additional class names */
  className?: string;
}

/**
 * Contact section container (Composition Root).
 * Composes ContactForm, ContactInfo, and SocialLinks components.
 * Uses Dependency Inversion via configuration.
 */
export function Contact({ id = 'contact', className }: ContactProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Build social links from config
  const socialLinks: SocialLink[] = [
    {
      name: 'GitHub',
      url: siteConfig.social.github,
      icon: 'github',
      label: 'View my GitHub profile',
    },
    {
      name: 'LinkedIn',
      url: siteConfig.social.linkedin,
      icon: 'linkedin',
      label: 'Connect on LinkedIn',
    },
    {
      name: 'Email',
      url: siteConfig.social.email,
      icon: 'email',
      label: 'Send me an email',
    },
  ];

  return (
    <Section
      id={id}
      className={cn('relative overflow-hidden', className)}
      aria-labelledby="contact-heading"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary-500/5 absolute top-1/3 -right-1/4 h-96 w-96 rounded-full blur-3xl" />
        <div className="bg-accent-500/5 absolute bottom-1/3 -left-1/4 h-96 w-96 rounded-full blur-3xl" />
      </div>

      <div ref={sectionRef} className="relative">
        {/* Section header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="caption" className="text-primary-400 mb-2">
            Get In Touch
          </Typography>
          <Typography
            id="contact-heading"
            variant="h2"
            gradient
            className="mb-4"
          >
            Let&apos;s Work Together
          </Typography>
          <Typography variant="body-lg" muted className="mx-auto max-w-2xl">
            Have a project in mind or want to discuss opportunities? I&apos;d
            love to hear from you. Feel free to reach out through the form or
            connect via social media.
          </Typography>
        </motion.div>

        {/* Contact content */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:p-8">
              <Typography variant="h4" className="mb-6">
                Send a Message
              </Typography>
              <ContactForm />
            </div>
          </motion.div>

          {/* Contact info and social links */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col justify-between"
          >
            <div>
              <Typography variant="h4" className="mb-6">
                Contact Information
              </Typography>
              <ContactInfo
                email={siteConfig.author.email}
                location={siteConfig.author.location}
                availability="Open to opportunities"
              />
            </div>

            <div className="mt-12">
              <Typography variant="h5" className="mb-4">
                Follow Me
              </Typography>
              <Typography variant="body" muted className="mb-6">
                Stay connected and follow my work on social media.
              </Typography>
              <SocialLinks links={socialLinks} />
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
