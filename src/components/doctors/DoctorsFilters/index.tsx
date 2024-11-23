import { DesktopFilters } from "./DesktopFilters"
import { MobileFilters } from "./MobileFilters"

export function DoctorsFilters() {
  return (
    <div className="sticky top-0 z-10 bg-black border-b  py-4 items-center justify-center">
      <div className="container items-center">
        <div className="flex items-center justify-between">
          <MobileFilters />
          <DesktopFilters />
        </div>
      </div>
    </div>
  )
}