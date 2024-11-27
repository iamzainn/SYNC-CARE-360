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
  Pill, Brain, Database, MapPin, ChevronRight 
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
        href: "/pakistan/lahore",
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
        href: "/pakistan/islamabad",
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
        href: "/pakistan/karachi",
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
    href: "/hospitals",
    icon: Building2,
    hasLocations: true,
    items: [
      {
        title: "Lahore",
        href: "/pakistan/lahore/hospitals",
        icon: MapPin,
        items: [
          { title: "Doctors Hospital", href: "/pakistan/lahore/hospitals/doctors-hospital" },
          { title: "Hameed Latif", href: "/pakistan/lahore/hospitals/hameed-latif" },
          { title: "Ever Care Hospital", href: "/pakistan/lahore/hospitals/ever-care" }
        ]
      },
      {
        title: "Karachi",
        href: "/pakistan/karachi/hospitals",
        icon: MapPin,
        items: [
          { title: "Patel Hospital", href: "/pakistan/karachi/hospitals/patel-hospital" }
        ]
      },
      {
        title: "Islamabad",
        href: "/pakistan/islamabad/hospitals",
        icon: MapPin,
        items: [
          { title: "All Medical Center", href: "/pakistan/islamabad/hospitals/all-medical-center" },
          { title: "Shifa Hospital", href: "/pakistan/islamabad/hospitals/shifa-hospital" },
          { title: "Maroof Hospital", href: "/pakistan/islamabad/hospitals/maroof-hospital" }
        ]
      }
    ]
  },
  {
    title: "Labs & Diagnostic",
    href: "/labs",
    icon: MSquare,
    hasLocations: true,
    items: [
      {
        title: "Lahore",
        href: "/pakistan/lahore/lab",
        icon: MapPin,
        items: [
          { title: "Chughtai Lab", href: "/pakistan/lahore/lab/chughtai" },
          { title: "Dr. Essa Lab", href: "/pakistan/lahore/lab/dr-essa" }
        ]
      },
      {
        title: "Islamabad",
        href: "/pakistan/islamabad/lab",
        icon: MapPin,
        items: [
          { title: "Metropole Lab", href: "/pakistan/islamabad/lab/metropole" },
          { title: "All Medical Center", href: "/pakistan/islamabad/lab/all-medical-center" }
        ]
      },
      {
        title: "Karachi",
        href: "/pakistan/karachi/lab",
        icon: MapPin,
        items: [
          { title: "Chughtai Lab", href: "/pakistan/karachi/lab/chughtai" },
          { title: "One Health Lab", href: "/pakistan/karachi/lab/one-health" }
        ]
      }
    ]
  },
  {
    title: "Services",
    href: "/Services",
    icon: MSquare,
    hasLocations: false,
    items: [
      {
        title: "Home Visits",
        href: "/Services/home-visits",
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