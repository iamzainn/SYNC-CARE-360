import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PartnerProps {
  logo: React.ReactNode;
  name: string;
}

const Partner: React.FC<PartnerProps> = ({ logo, name }) => {
  return (
    <Card className="flex flex-col items-center justify-center">
      <CardContent>{logo}</CardContent>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
    </Card>
  );
};

export const PartnersSection = () => {
  const partners = [
    { logo: <img src="/partner-logo1.png" alt="Partner 1" />, name: 'Partner 1' },
    { logo: <img src="/partner-logo2.png" alt="Partner 2" />, name: 'Partner 2' },
    { logo: <img src="/partner-logo3.png" alt="Partner 3" />, name: 'Partner 3' },
    { logo: <img src="/partner-logo4.png" alt="Partner 4" />, name: 'Partner 4' },
    { logo: <img src="/partner-logo5.png" alt="Partner 5" />, name: 'Partner 5' },
  ];

  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Our Esteemed Partners</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {partners.map((partner, index) => (
          <Partner key={index} logo={partner.logo} name={partner.name} />
        ))}
      </div>
    </section>
  );
};