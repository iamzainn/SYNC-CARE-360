export const MAIN_CITIES = ['Lahore', 'Karachi', 'Islamabad','Faisalabad','Rawalpindi','Gujranwala','Multan','Peshawar','Sargodha','Bhawalpur'] as const
type MainCity = typeof MAIN_CITIES[number]

export const determineMainCity = (addressData: any): MainCity | null => {
  
  const {
    city,
    town,
    village,
    suburb,
    district,
    state,
    county,
    display_name
  } = addressData

  // Convert everything to lowercase for comparison
  const locationString = [
    city,
    town,
    village,
    suburb,
    district,
    state,
    county,
    display_name
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  // Check for main cities
  if (locationString.includes('lahore')) return 'Lahore'
  if (locationString.includes('karachi')) return 'Karachi'
  if (locationString.includes('islamabad')) return 'Islamabad'
  if (locationString.includes('faisalabad')) return 'Faisalabad'
  if (locationString.includes('rawalpindi')) return 'Rawalpindi'
  if (locationString.includes('gujranwala')) return 'Gujranwala'
  if (locationString.includes('multan')) return 'Multan'
  if (locationString.includes('peshawar')) return 'Peshawar'
  if (locationString.includes('sargodha')) return 'Sargodha'
  if (locationString.includes('bhawalpur')) return 'Bhawalpur'

  return null
}