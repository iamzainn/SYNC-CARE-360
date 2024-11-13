// /lib/doctors/specialists.ts
import { BrainCog, Baby, Stethoscope, Eye, Bone, LucideIcon } from 'lucide-react'
import {  FaBone, FaChild,FaLungs as Lung } from 'react-icons/fa'
import { IconType } from 'react-icons'

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
  }
]