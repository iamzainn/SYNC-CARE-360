import { DesktopFilters } from "./DesktopFilters"
import { MobileFilters } from "./MobileFilters"

export function DoctorsFilters() {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full">
      <div className="container max-w-6xl mx-auto">
        <div className="flex items-center justify-center space-x-4">
          <MobileFilters />
          <DesktopFilters />
        </div>
      </div>
    </div>
  )
}