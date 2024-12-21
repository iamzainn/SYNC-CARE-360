// data/labs.ts

import { Lab, Test } from "@/lib/types/lab-test"


export const labs: Lab[] = [
  {
    id: "chughtai",
    name: "Chughtai Lab",
    description: "Leading diagnostic laboratory providing quality healthcare services",
    phone: "042-111-456-789",
    city: "Lahore",
    services: ["Free Home Sample", "24/7 Service", "Online Reports", "Same Day Reports"],
    logo: "/labs/chughtai.png"
  },
  {
    id: "idc",
    name: "Islamabad Diagnostic Center",
    description: "Premier diagnostic facility with state-of-the-art equipment",
    phone: "051-111-123-456",
    city: "Islamabad",
    services: ["Free Home Sample", "Same Day Reports", "Online Reports"],
    logo: "/labs/idc.png"
  }
]

export const tests: Test[] = [
  {
    id: "cbc",
    name: "Complete Blood Count",
    knownAs: "Blood CP Test",
    sampleType: "Blood",
    basePrice: 800,
    description: "A complete blood count (CBC) is a blood test used to evaluate your overall health and detect a wide range of disorders.",
    ageGroup: "All ages",
    category: "Hematology",
    turnaroundTime: "Same Day",
    preparations: [
      { instruction: "Wear a short sleeved shirt or one that can be easily rolled up" },
      { instruction: "No fasting required unless specified by your doctor" },
      { instruction: "Inform the lab if you're on any blood thinners" }
    ],
    faqs: [
      {
        question: "What is a CBC test?",
        answer: "A CBC test measures several components of your blood, including red blood cells, white blood cells, and platelets."
      },
      {
        question: "When should I get a CBC test?",
        answer: "Your doctor might recommend a CBC test as part of a routine checkup or if you're experiencing symptoms like fatigue, weakness, or fever."
      }
    ],
    labPricing: [
      {
        labId: "chughtai",
        price: 850,
        discount: { percentage: 20, validUntil: new Date("2024-12-31") }
      },
      { labId: "idc", price: 840 }
    ]
  },
  {
    id: "lipid-profile",
    name: "Lipid Profile",
    knownAs: "Cholesterol Test",
    sampleType: "Blood",
    basePrice: 2200,
    description: "A lipid profile measures the levels of fats and fatty substances in your blood.",
    ageGroup: "Adults",
    category: "Biochemistry",
    turnaroundTime: "Same Day",
    preparations: [
      { instruction: "Fasting for 9-12 hours before the test" },
      { instruction: "Only water is allowed during fasting" },
      { instruction: "Avoid heavy meals the night before" }
    ],
    faqs: [
      {
        question: "Why is fasting required?",
        answer: "Fasting ensures accurate measurement of lipid levels, as food can temporarily affect these values."
      }
    ],
    labPricing: [
      { labId: "chughtai", price: 2400 },
      { 
        labId: "idc", 
        price: 2600,
        discount: { percentage: 15, validUntil: new Date("2024-12-31") }
      }
    ]
  },
  {
    id: "hba1c",
    name: "Glycated Hemoglobin",
    knownAs: "HbA1c",
    sampleType: "Blood",
    basePrice: 1800,
    description: "Measures average blood sugar levels over the past 2-3 months.",
    ageGroup: "Adults",
    category: "Diabetes",
    turnaroundTime: "Same Day",
    preparations: [
      { instruction: "No fasting required" },
      { instruction: "Continue regular medications" }
    ],
    labPricing: [
      { labId: "chughtai", price: 1900 },
      { labId: "idc", price: 1850 }
    ],
    faqs: [
      {
        question: "How often should I get an HbA1c test?",
        answer: "Typically every 3-6 months for diabetic patients, or as recommended by your doctor."
      }
    ]
  },
  {
    id: "tft",
    name: "Thyroid Function Test",
    knownAs: "TFT",
    sampleType: "Blood",
    basePrice: 2500,
    description: "Measures thyroid hormone levels to evaluate thyroid function.",
    ageGroup: "All ages",
    category: "Endocrinology",
    turnaroundTime: "Next Day",
    preparations: [
      { instruction: "No fasting required" },
      { instruction: "Inform about thyroid medications" }
    ],
    labPricing: [
      { 
        labId: "chughtai", 
        price: 2800,
        discount: { percentage: 10, validUntil: new Date("2024-12-31") }
      },
      { labId: "idc", price: 2600 }
    ],
    faqs: [
      {
        question: "What does TFT measure?",
        answer: "TFT measures TSH, T3, and T4 hormones to assess thyroid function."
      }
    ]
  },
  {
    id: "dengue",
    name: "Dengue Test",
    knownAs: "NS1 Antigen",
    sampleType: "Blood",
    basePrice: 2000,
    description: "Detects dengue virus infection in early stages.",
    ageGroup: "All ages",
    category: "Infectious Disease",
    turnaroundTime: "Same Day",
    preparations: [
      { instruction: "No special preparation required" }
    ],
    labPricing: [
      { labId: "chughtai", price: 2200 },
      { labId: "idc", price: 2100 }
    ],
    faqs: [
      {
        question: "When should I get tested?",
        answer: "If you experience fever, body aches, or other dengue symptoms within 5 days."
      }
    ]
  },
  {
    id: "covid",
    name: "COVID-19 PCR Test",
    knownAs: "Corona Test",
    sampleType: "Nasopharyngeal Swab",
    basePrice: 3500,
    description: "Detects current COVID-19 infection.",
    ageGroup: "All ages",
    category: "Infectious Disease",
    turnaroundTime: "24 Hours",
    preparations: [
      { instruction: "No eating, drinking, or smoking 30 minutes before test" }
    ],
    labPricing: [
      { 
        labId: "chughtai", 
        price: 3800,
        discount: { percentage: 25, validUntil: new Date("2024-12-31") }
      },
      { labId: "idc", price: 3600 }
    ],
    faqs: [
      {
        question: "Is this test suitable for travel?",
        answer: "Yes, it meets international travel requirements. Report includes QR code."
      }
    ]
  },
  {
    id: "liver-function",
    name: "Liver Function Test",
    knownAs: "LFT",
    sampleType: "Blood",
    basePrice: 1500,
    description: "Evaluates liver health and function.",
    ageGroup: "All ages",
    category: "Biochemistry",
    turnaroundTime: "Same Day",
    preparations: [
      { instruction: "8-12 hours fasting required" },
      { instruction: "Avoid alcohol for 24 hours before test" }
    ],
    labPricing: [
      { labId: "chughtai", price: 1600 },
      { 
        labId: "idc", 
        price: 1700,
        discount: { percentage: 15, validUntil: new Date("2024-12-31") }
      }
    ],
    faqs: [
      {
        question: "What does LFT measure?",
        answer: "It measures various proteins, enzymes, and substances to assess liver function."
      }
    ]
  }
]