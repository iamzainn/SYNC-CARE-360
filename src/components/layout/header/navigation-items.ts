interface SubItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface LocationItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  items: SubItem[];
}

interface NavigationItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  items: (LocationItem | SubItem)[];
  hasLocations?: boolean;
}

// Type guard to check if an item has sub-items
export function hasSubItems(item: LocationItem | SubItem): item is LocationItem {
  return 'items' in item;
}

// navigation-items.ts
import { 
  Stethoscope, Building2,MSquare,
  Pill, Brain, Database, MapPin
} from 'lucide-react';

export const navigationItems: NavigationItem[] = [
  {
    title: "Doctors",
    href: "/doctors",
    icon: Stethoscope,
    hasLocations: true,
    items: [
      {
        title: "Lahore",
        href: "/pakistan/lahore/dermatologist",
        icon: MapPin,
        items: [
          { title: "Dermatologist", href: "/pakistan/lahore/dermatologist" },
          { title: "Neurologist", href: "/pakistan/lahore/neurologist" },
          { title: "Dentist", href: "/pakistan/lahore/dentist" },
          { title: "Pediatrician", href: "/pakistan/lahore/pediatrician" },
          { title: "Urologist", href: "/pakistan/lahore/urologist" },
          { title: "ENT Specialist", href: "/pakistan/lahore/ent-specialist" }
        ]
      },
      // Karachi and Islamabad similar structure
      {
        title: "Islamabad",
        href: "/pakistan/islamabad/dermatologist",
        icon: MapPin,
        items: [
          { title: "Dermatologist", href: "/pakistan/islamabad/dermatologist" },
          { title: "Neurologist", href: "/pakistan/islamabad/neurologist" },
          { title: "Dentist", href: "/pakistan/islamabad/dentist" },
          { title: "Pediatrician", href: "/pakistan/islamabad/pediatrician" },
          { title: "Urologist", href: "/pakistan/islamabad/urologist" },
          { title: "ENT Specialist", href: "/pakistan/islamabad/ent-specialist" }
        ] 
      },
      {
        title: "Karachi",
        href: "/pakistan/karachi/dermatologist",
        icon: MapPin,
        items: [
          { title: "Dermatologist", href: "/pakistan/karachi/dermatologist" },
          { title: "Neurologist", href: "/pakistan/karachi/neurologist" },
          { title: "Dentist", href: "/pakistan/karachi/dentist" },
          { title: "Pediatrician", href: "/pakistan/karachi/pediatrician" },
          { title: "Urologist", href: "/pakistan/karachi/urologist" },
          { title: "ENT Specialist", href: "/pakistan/karachi/ent-specialist" }
        ]
      }
    ]
  },
  {
    title: "Hospitals",
    href: "/pakistan/lahore/hospitals/doctors-hospital",
    icon: Building2,
    hasLocations: true,
    items: [
      {
        title: "Lahore",
        href: "/pakistan/lahore/hospitals/doctors-hospital",
        icon: MapPin,
        items: [
          { title: "Doctors Hospital", href: "/pakistan/lahore/hospitals/doctors-hospital" },
          { title: "Hameed Latif", href: "/pakistan/lahore/hospitals/hameed-latif" },
          { title: "Ever Care Hospital", href: "/pakistan/lahore/hospitals/ever-care" }
        ]
      },
      {
        title: "Karachi",
        href: "/pakistan/karachi/hospitals/patel-hospital",
        icon: MapPin,
        items: [
          { title: "Patel Hospital", href: "/pakistan/karachi/hospitals/patel-hospital" }
        ]
      },
      {
        title: "Islamabad",
        href: "/pakistan/islamabad/hospitals/shifa-hospital",
        icon: MapPin,
        items: [
          
          { title: "Shifa Hospital", href: "/pakistan/islamabad/hospitals/shifa-hospital" },
          
        ]
      }
    ]
  },
  {
    title: "Labs & Diagnostic",
    href: "/labs",
    icon: MSquare,
    
    items: [
      {
        title: "Chughtai Lab (LHR)",
        href: "/labs/chughtai-lhr",
        icon: MapPin,
      
      },
      {
        title: "Dr. Essa Lab (LHR)",
        href: "/labs/essa",
        icon: MapPin,
        
      },
      {
        title: "Metro Pole Lab (ISL)",
        href: "/labs/metropole",
        icon: MapPin, 
      },
      {
        title:"Ali Medical Center (ISL)",
        href:"/labs/amc",
        icon:MapPin
      },
      {
        title:"Chugatai Lab Karachi",
        href:"labs/chughtai-khi",
        icon:MapPin
      },
      {
        title:"One Health Lab Karachi",
        href:"labs/onehealth",
        icon:MapPin
      }
    ]
  },
  {
    title: "Services",
    href: "/Services/home-visits/lahore",
    icon: MSquare,
    hasLocations: false,
    items: [
      {
        title: "Home Visits",
        href: "/Services/home-visits/lahore",
        icon: MSquare,
        items: [
          {
            title: "Lahore",
            href: "/Services/home-visits/lahore",
            icon: MapPin
          },
          {
            title: "Karachi",
            href: "/Services/home-visits/karachi",
            icon: MapPin
          },
          {
            title: "Islamabad",
            href: "/Services/home-visits/islamabad",
            icon: MapPin
          }
        ]
      },
      { 
        title: "Medicines", 
        href: "/Services/Medicines",
        icon: Pill 
      },
      { 
        title: "Specialized Medical Treatment", 
        href: "/Services/specialized-medical-treatment",
        icon: Brain 
      },
      { 
        title: "Data Management", 
        href: "/Services/DataManagement",
        icon: Database 
      }
    ]
  }
];