import { 
    Thermometer, Heart, Baby, Activity, 
    Droplets, SmilePlus, Stethoscope, 
    Brain, Pill, LucideIcon 
  } from 'lucide-react'
  import { 
    GiWalk, 
    GiNoseSide, 
    GiStomach,
    GiSkeleton,
    GiBrain
  } from 'react-icons/gi'
  import { IconType } from 'react-icons'
  
  export interface Condition {
    id: string
    title: string
    urlPath: string
    icon: LucideIcon | IconType
    description?: string
  }
  
  export const CONDITIONS: Condition[] = [
    {
      id: '1',
      title: 'Fever',
      urlPath: 'fever',
      icon: Thermometer,
      description: 'High temperature and related symptoms'
    },
    {
      id: '2',
      title: 'Heart Attack',
      urlPath: 'heart-attack',
      icon: Heart,
      description: 'Cardiac emergencies and heart conditions'
    },
    {
      id: '3',
      title: 'Pregnancy',
      urlPath: 'pregnancy',
      icon: Baby,
      description: 'Pregnancy care and related concerns'
    },
    {
      id: '4',
      title: 'High Blood Pressure',
      urlPath: 'blood-pressure',
      icon: Activity,
      description: 'Hypertension and blood pressure issues'
    },
    {
      id: '5',
      title: 'Piles',
      urlPath: 'piles',
      icon: GiWalk,
      description: 'Hemorrhoids and related conditions'
    },
    {
      id: '6',
      title: 'Diarrhea',
      urlPath: 'diarrhea',
      icon: Droplets,
      description: 'Stomach and digestive issues'
    },
    {
      id: '7',
      title: 'Acne',
      urlPath: 'acne',
      icon: SmilePlus,
      description: 'Skin conditions and acne treatment'
    },
    {
      id: '8',
      title: 'Migraine',
      urlPath: 'migraine',
      icon: GiBrain,
      description: 'Severe headaches and related symptoms'
    },
    {
      id: '9',
      title: 'Cold & Flu',
      urlPath: 'cold-flu',
      icon: GiNoseSide,
      description: 'Common cold and flu symptoms'
    },
    {
      id: '10',
      title: 'Joint Pain',
      urlPath: 'joint-pain',
      icon: GiSkeleton,
      description: 'Arthritis and joint-related issues'
    },
    {
      id: '11',
      title: 'Depression',
      urlPath: 'depression',
      icon: Brain,
      description: 'Mental health and emotional wellness'
    },
    {
      id: '12',
      title: 'Stomach Pain',
      urlPath: 'stomach-pain',
      icon: GiStomach,
      description: 'Digestive and abdominal issues'
    }
  ]