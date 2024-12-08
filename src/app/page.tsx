import { ConditionsSection } from "@/components/conditions/ConditionsSection";
import { PartnersSection } from "@/components/Partner/PartnerSection";
import {  ReviewsSection } from "@/components/Partner/Review";

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
      <PartnersSection></PartnersSection>
      <ReviewsSection></ReviewsSection>
    
   
  </main>
  );
}
