// lib/data/medicines.ts
export interface Medicine {
    id: string;
    name: string;
    price: number;
    description?: string;
  }
  
  export const medicines: Medicine[] = [
    {
      id: "1",
      name: "Panadol (500mg)",
      price: 150,
      description: "Pain Relief"
    },
    {
      id: "2",
      name: "Disprin (300mg)",
      price: 100,
      description: "Pain Relief"
    },
    {
      id: "3",
      name: "Nexium (40mg)",
      price: 450,
      description: "Acid Reflux"
    },
    {
      id: "4",
      name: "Augmentin (625mg)",
      price: 550,
      description: "Antibiotic"
    },
    {
      id: "5",
      name: "Risek (40mg)",
      price: 280,
      description: "Acid Reducer"
    }
  ];
  
  // lib/data/pharmacies.ts
  export const pharmacies = [
    {
      id: "1",
      name: "Aga Khan University Hospital (AKUH) Pharmacies",
      city: "Karachi",
      metadata: {
        description: "A network of comprehensive pharmacies offering genuine medicines",
        location: "Stadium Road, Karachi",
        services: ["24/7 Service", "Home Delivery", "Online Ordering"]
      }
    },
    {
      id: "2",
      name: "Sehat",
      city: "Lahore",
      metadata: {
        description: "Pakistan's premier online pharmacy delivering medicines nationwide",
        location: "Multiple locations in Lahore",
        services: ["Online Ordering", "Multiple Payment Options", "Nationwide Delivery"]
      }
    },
    // Add more pharmacies from your list
  ] as const;