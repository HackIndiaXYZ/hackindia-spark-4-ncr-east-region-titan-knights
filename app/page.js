import { Nav } from '@/components/ui/Nav';
import { Hero } from '@/components/landing/Hero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Benefits } from '@/components/landing/Benefits';

export default function LandingPage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <Benefits />
      </main>
    </>
  );
}
