import { ConditionsSection } from "@/components/conditions/ConditionsSection";
import { HeroSection } from "@/components/search/HeroSection"
import { ServiceSection } from "@/components/ServiceSection/page";
import { SpecialistsSection } from "@/components/specialists/SpecialistsSection";
import { SponsorsSection } from "@/components/sponsors/SponsorsSection";



export default function Home() {
  return (
    <main>
      <HeroSection />
      <ServiceSection/>
      <SponsorsSection />
      <SpecialistsSection />
      <ConditionsSection />
    
   
  </main>
  );
}
