// components/conditions/ConditionsSection.tsx
'use client'

import { useRouter } from 'next/navigation';
import { 
  Thermometer, Heart, Baby, 
  Activity, Droplets, SmilePlus 
} from 'lucide-react';
import { GiWalk } from "react-icons/gi";
import { useLocationStore } from '@/store/useLocationStore';
import type { ConditionCard } from '@/types';
import { ConditionsDialog } from './ConditionsDialog';
import { useState } from 'react';

const conditionsData: ConditionCard[] = [
  { 
    icon: "Thermometer", 
    title: "Fever", 
    urlPath: "fever"
  },
  { 
    icon: "Heart", 
    title: "Heart Attack", 
    urlPath: "heart-attack"
  },
  { 
    icon: "Baby", 
    title: "Pregnancy", 
    urlPath: "pregnancy"
  },
  { 
    icon: "Activity", 
    title: "High Blood Pressure", 
    urlPath: "blood-pressure"
  },
  { 
    icon: "GiWalk", 
    title: "Piles", 
    urlPath: "piles"
  },
  { 
    icon: "Droplets", 
    title: "Diarrhea", 
    urlPath: "diarrhea"
  },
  { 
    icon: "SmilePlus", 
    title: "Acne", 
    urlPath: "acne"
  }
];

const conditionIcons = {
  Thermometer,
  Heart,
  Baby,
  Activity,
  GiWalk,
  Droplets,
  SmilePlus,
};

export function ConditionsSection() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const location = useLocationStore(state => state.location);

  const handleConditionClick = (urlPath: string) => {
    const currentLocation = location || 'lahore';
    router.push(`/pakistan/${currentLocation}/condition/${urlPath}`);
  };

  return (
    <section className="w-full px-4 md:px-6 lg:px-8 py-8 md:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold">
            Search doctor by condition
          </h2>
          <button 
            onClick={() => setIsDialogOpen(true)}
            className="text-primary hover:underline text-sm md:text-base"
          >
            View All
          </button>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6">
          {conditionsData.map((condition) => {
            const IconComponent = conditionIcons[condition.icon as keyof typeof conditionIcons];
            return (
              <button 
                key={condition.title}
                onClick={() => handleConditionClick(condition.urlPath)}
                className="group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-50 flex items-center justify-center mb-2 group-hover:bg-blue-100 transition-colors">
                    <IconComponent className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
                  </div>
                  <span className="text-center text-sm md:text-base font-medium">
                    {condition.title}
                  </span>
                </div>
              </button>
            );
          })}
          
        </div>
        <ConditionsDialog 
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      </div>
    </section>
  );
}


