import { About } from '@/presentation/components/sections/About';
import { Contact } from '@/presentation/components/sections/Contact';
import { Experience } from '@/presentation/components/sections/Experience';
import { Hero } from '@/presentation/components/sections/Hero';
import { Projects } from '@/presentation/components/sections/Projects';
import { Skills } from '@/presentation/components/sections/Skills';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <About />

      {/* Skills Section */}
      <Skills className="bg-gray-900/50" />

      {/* Experience Section */}
      <Experience />

      {/* Projects Section */}
      <Projects className="bg-gray-900/50" />

      {/* Contact Section */}
      <Contact />
    </>
  );
}
