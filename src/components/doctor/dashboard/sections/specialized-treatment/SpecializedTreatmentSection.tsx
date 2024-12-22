// components/doctor/dashboard/sections/specialized-treatment/SpecializedTreatmentSection.tsx
"use client"

import { useEffect, useState } from "react"
import { getSpecializedTreatments } from "@/lib/actions/specialized-treatment"
import { Card } from "@/components/ui/card"

import { ChatWindow } from "../bookings/ChatWindow"
import { TreatmentList } from "./TreatmentList"

interface SpecializedTreatmentSectionProps {
  doctorId: string
}

export function SpecializedTreatmentSection({ doctorId }: SpecializedTreatmentSectionProps) {
  const [selectedTreatment, setSelectedTreatment] = useState<any>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="p-6">
          <TreatmentList
            doctorId={doctorId}
            onSelectTreatment={(treatment) => {
              setSelectedTreatment(treatment)
              setIsChatOpen(true)
            }}
          />
        </Card>
      </div>
      <div className="lg:col-span-1">
        <Card className="p-6 h-[calc(100vh-240px)] flex flex-col">
          {isChatOpen && selectedTreatment?.status === 'ACCEPTED' ? (
            <ChatWindow
              booking={selectedTreatment}
              doctorId={doctorId}
              onClose={() => {
                setIsChatOpen(false)
                setSelectedTreatment(null)
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              {selectedTreatment?.status !== 'ACCEPTED' 
                ? "Chat available after accepting the treatment request" 
                : "Select an accepted treatment request to start chatting"}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

