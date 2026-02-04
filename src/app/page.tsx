import { Section } from '@/presentation/components/layout/Section';
import { SectionTitle } from '@/presentation/components/layout/Section/SectionTitle';
import { Hero } from '@/presentation/components/sections/Hero';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Placeholder Sections for remaining pages */}
      <Section id="about">
        <SectionTitle
          title="About Me"
          subtitle="Passionate Big Data & Software Engineer with a focus on building scalable, data-driven applications."
        />
        <div className="flex min-h-[400px] items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/5 p-12 text-center text-gray-500">
          <p>This section is under development. Stay tuned!</p>
        </div>
      </Section>

      <Section id="skills" className="bg-gray-900/50">
        <SectionTitle
          title="Skills & Expertise"
          subtitle="My technical toolkit and specialized areas of knowledge in data engineering and software development."
        />
        <div className="flex min-h-[400px] items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/5 p-12 text-center text-gray-500">
          <p>This section is under development. Stay tuned!</p>
        </div>
      </Section>

      <Section id="experience">
        <SectionTitle
          title="Work Experience"
          subtitle="A timeline of my professional journey and key contributions at various organizations."
        />
        <div className="flex min-h-[400px] items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/5 p-12 text-center text-gray-500">
          <p>This section is under development. Stay tuned!</p>
        </div>
      </Section>

      <Section id="projects" className="bg-gray-900/50">
        <SectionTitle
          title="Featured Projects"
          subtitle="A selection of my work ranging from data pipelines to full-stack applications."
        />
        <div className="flex min-h-[400px] items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/5 p-12 text-center text-gray-500">
          <p>This section is under development. Stay tuned!</p>
        </div>
      </Section>

      <Section id="contact">
        <SectionTitle
          title="Get in Touch"
          subtitle="Have a question or want to work together? Feel free to reach out!"
        />
        <div className="flex min-h-[400px] items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/5 p-12 text-center text-gray-500">
          <p>This section is under development. Stay tuned!</p>
        </div>
      </Section>
    </>
  );
}
