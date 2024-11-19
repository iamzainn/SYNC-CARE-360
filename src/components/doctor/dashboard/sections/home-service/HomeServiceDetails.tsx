import { Badge } from "@/components/ui/badge";
import { DAYS, HOME_SPECIALIZATIONS } from "@/lib/constants/home-services";
import { HomeServiceData } from "@/types";


export function HomeServiceDetails({ data }: { data?: HomeServiceData }) {
    if (!data) return null;
  
    return (
      <div className="space-y-6">
        {/* Specializations */}
        <div className="rounded-lg border p-4">
          <h3 className="font-medium mb-3">Service Specializations & Pricing</h3>
          <div className="grid gap-4">
            {data.specializations.map((spec, index) => {
              const specData = HOME_SPECIALIZATIONS.find(s => s.id === spec.type)
              return (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium">{specData?.label}</span>
                  <Badge variant="secondary">Rs. {spec.price}</Badge>
                </div>
              )
            })}
          </div>
        </div>
  
        {/* Time Slots */}
        <div className="rounded-lg border p-4">
          <h3 className="font-medium mb-3">Availability Schedule</h3>
          <div className="grid gap-4">
            {DAYS.map(day => {
              const daySlots = data.slots.filter(slot => slot.dayOfWeek === day)
              if (daySlots.length === 0) return null;
  
              return (
                <div key={day} className="space-y-2">
                  <h4 className="text-sm text-muted-foreground">
                    {day.charAt(0) + day.slice(1).toLowerCase()}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {daySlots.map((slot, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50">
                        {slot.startTime} - {slot.endTime}
                      </Badge>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  }