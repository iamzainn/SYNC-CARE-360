'use client'

import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface PartnerProps {
  logo: React.ReactNode;
  name: string;
}

const Partner: React.FC<PartnerProps> = ({ logo, name }) => {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-none shadow-sm hover:shadow-md transition-all">
        <CardContent className="p-6 flex flex-col items-center justify-center gap-4">
          <div className="h-16 flex items-center justify-center">
            {logo}
          </div>
          <p className="text-center font-medium text-sm text-gray-700">{name}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const PartnersSection = () => {
  const partners = [
    { logo: <img src="/Services/Partner/partner-1.png" alt="Partner 1" className="" />, name: 'Partner 1' },
    { logo: <img src="/Services/Partner/partner-1.png" alt="Partner 2" className="" />, name: 'Partner 2' },
    { logo: <img src="/Services/Partner/partner-1.png" alt="Partner 3" className="" />, name: 'Partner 3' },
    { logo: <img src="/Services/Partner/partner-1.png" alt="Partner 4" className="" />, name: 'Partner 4' },
    { logo: <img src="/Services/Partner/partner-1.png" alt="Partner 5" className="" />, name: 'Partner 5' },
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-primary uppercase font-medium tracking-wider mb-2">Our Network</h3>
          <h2 className="text-3xl font-bold">Our Trusted Partners</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            We work with industry-leading organizations to provide the best healthcare services to our patients.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {partners.map((partner, index) => (
            <Partner key={index} logo={partner.logo} name={partner.name} />
          ))}
        </div>
        
        
      </div>
    </section>
  );
};