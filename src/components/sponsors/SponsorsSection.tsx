import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import type { SponsorCard } from '@/types';

const sponsorsData: SponsorCard[] = [
  {
    title: "Haleon Oral Health Care",
    description: "Your ultimate guide to oral health",
    href: "/oral-health"
  },
  {
    title: "BOLO Health for youth",
    description: "Family planning & reproduction health services",
    href: "/youth-health"
  }
];

export function SponsorsSection() {
  return (
    <section className="w-full px-4 md:px-6 lg:px-8 py-8 md:py-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8">
          Get specialized health care
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {sponsorsData.map((sponsor) => (
            <Link href={sponsor.href} key={sponsor.title}>
              <Card className="h-full transition-transform hover:scale-[1.02] cursor-pointer">
                <CardContent className="p-4 md:p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold mb-2">
                        {sponsor.title}
                      </h3>
                      <p className="text-sm md:text-base text-gray-600">
                        {sponsor.description}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gray-100 rounded-full" /> {/* Placeholder for logo */}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}