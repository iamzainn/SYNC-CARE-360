// lib/helpers/specialization-mapping.ts
export const urlToSpecialization = (param: string): string => {
  console.log("par",param) 
    const mappings: Record<string, string> = {
       

      'dermatologist': 'Dermatology',
      'cardiologist': 'Cardiology',
      'gynecologist': 'Obstetrics & Gynecology',
      'neurologist': 'Neurology',
      'pediatrician': 'Pediatrics',
      'orthopedic-surgeon': 'Orthopedics',
      'gastroenterologist': 'Gastroenterology',
      'endocrinologist': 'Endocrinology',
      
    }
    
    
    return mappings[param.toLowerCase()] || param
  }


  export const urlToExpertise = (condition: string) => {
    // Replace any sequence of spaces with a single hyphen
    return condition.trim().replace(/\s+/g, '-');
  }
  
  export const specializationToUrl = (specialization: string): string => {
    const reversed: Record<string, string> = {
      'Dermatology': 'dermatologist',
      'Cardiology': 'cardiologist',
      'Obstetrics & Gynecology': 'gynecologist',
      'Neurology': 'neurologist',
      'Pediatrics': 'pediatrician',
      'Orthopedics': 'orthopedic-surgeon',
      'Gastroenterology': 'gastroenterologist',
      'Endocrinology': 'endocrinologist',
      
    }
    
    return reversed[specialization] || specialization.toLowerCase()
  }

