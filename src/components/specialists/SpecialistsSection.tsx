// components/specialists/SpecialistsSection.tsx
'use client'

import { useState } from 'react';

import { useRouter } from 'next/navigation';
import { 
  UserRound, Stethoscope, Baby, Activity, 
  Droplets, Eye 
} from 'lucide-react';
import { MdHearing } from "react-icons/md";

import { useLocationStore } from '@/store/useLocationStore';

import { TelemedicineDialog } from '../search/TelemedicineSearchDialogue';
import { SpecialistCard } from '@/types';

const specialistsData: SpecialistCard[] = [
  { 
    icon: "UserRound", 
    title: "Gynecologist", 
    urlPath: "gynecologist" 
  },
  { 
    icon: "Stethoscope", 
    title: "Skin Specialist", 
    urlPath: "skin-specialist" 
  },
  { 
    icon: "Baby", 
    title: "Child Specialist", 
    urlPath: "child-specialist" 
  },
  { 
    icon: "Activity", 
    title: "Orthopedic Surgeon", 
    urlPath: "orthopedic-surgeon" 
  },
  { 
    icon: "MdHearing", 
    title: "ENT Specialist", 
    urlPath: "ent-specialist" 
  },
  { 
    icon: "Droplets", 
    title: "Diabetes Specialist", 
    urlPath: "diabetes-specialist" 
  },
  { 
    icon: "Eye", 
    title: "Eye Specialist", 
    urlPath: "eye-specialist" 
  }
];

const iconComponents = {
  UserRound,
  Stethoscope,
  Baby,
  Activity,
  MdHearing,
  Droplets,
  Eye,
};

export function SpecialistsSection() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const location = useLocationStore(state => state.location);

  const handleSpecialistClick = (urlPath: string) => {
    const currentLocation = location || 'lahore';
    router.push(`/pakistan/${currentLocation}/${urlPath}`);
  };

  return (
    <section className="w-full px-4 md:px-6 lg:px-8 py-8 md:py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold">
            Consult best doctors online
          </h2>
          <button 
            onClick={() => setIsDialogOpen(true)}
            className="text-primary hover:underline text-sm md:text-base"
          >
            View All
          </button>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6">
          {specialistsData.map((specialist) => {
            const IconComponent = iconComponents[specialist.icon as keyof typeof iconComponents];
            return (
              <button 
                key={specialist.title}
                onClick={() => handleSpecialistClick(specialist.urlPath)}
                className="group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-100 flex items-center justify-center mb-2 group-hover:bg-blue-200 transition-colors">
                    <IconComponent className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
                  </div>
                  <span className="text-center text-sm md:text-base font-medium">
                    {specialist.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <TelemedicineDialog 
          isOpen={isDialogOpen} 
          onClose={() => setIsDialogOpen(false)} 
        />
      </div>
    </section>
  );
}

