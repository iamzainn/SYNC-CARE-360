import { HospitalDetails } from "@/lib/config/hospitals";

export function HospitalLocation({ location }: { location: HospitalDetails['location'] }) {
  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-2xl font-bold mb-6">Location & Directions</h2>
        <div className="aspect-[2/1] w-full rounded-lg overflow-hidden border">
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&q=${location.lat},${location.lng}`}
            allowFullScreen
          />
        </div>
      </div>
    </section>
  )
}
  