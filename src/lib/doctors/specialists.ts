// /lib/doctors/specialists.ts
import { BrainCog, Baby, Stethoscope, Eye, Bone, LucideIcon, Heart, UserRound, Droplets } from 'lucide-react'
import {  FaBone, FaBrain, FaChild,FaTooth,FaLungs as Lung } from 'react-icons/fa'
import { IconType } from 'react-icons'
import { MdHearing } from 'react-icons/md'

export interface Specialty {
  id: string
  title: string
  urlPath: string
  icon: LucideIcon | IconType
}

export const SPECIALTIES: Specialty[] = [
  {
    id: '1',
    title: 'Speech and language Pathologist',
    urlPath: 'speech-pathologist',
    icon: BrainCog
  },
  {
    id: '2',
    title: 'Obstetrician',
    urlPath: 'obstetrician',
    icon: Baby
  },
  {
    id: '3',
    title: 'Liver Check',
    urlPath: 'liver-specialist',
    icon: Stethoscope
  },
  {
    id: '4',
    title: 'Orthopedic',
    urlPath: 'orthopedic',
    icon: Bone
  },
  {
    id: '5',
    title: 'Chest Infection',
    urlPath: 'chest-specialist',
    icon: Lung
  },
  {
    id: '6',
    title: 'Eye specialist',
    urlPath: 'eye-specialist',
    icon: Eye
  },
  {
    id: '7',
    title: 'Knee Specialist',
    urlPath: 'knee-specialist',
    icon: FaBone
  },
  {
    id: '8',
    title: 'Child Specialist',
    urlPath: 'pediatrician',
    icon: FaChild
  },
  {
    id: '9',
    title: 'ENT Specialist',
    urlPath: 'ent-specialist',
    icon: MdHearing
  },
  {
    id: '10',
    title: 'Cardiologist',
    urlPath: 'cardiologist',
    icon: Heart
  },
  {
    id: '11',
    title: 'General Physician',
    urlPath: 'general-physician',
    icon: UserRound
  },
  
  {
    id: '12',
    title: 'Neurologist',
    urlPath: 'neurologist',
    icon: FaBrain
  },
  {
    id: '13',
    title: 'Diabetologist',
    urlPath: 'diabetologist',
    icon: Droplets
  },
  
  {
    id: '14',
    title: 'Dentist',
    urlPath: 'dentist',
    icon: FaTooth
  }
]