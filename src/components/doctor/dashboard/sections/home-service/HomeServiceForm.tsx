import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { HomeServiceSpecializationForm } from "./SpecializationForm"
import { HomeServiceSlotsForm } from "./SlotsForm"
import { HomeServiceData } from "@/types"

interface HomeServiceFormProps {
    initialData?: HomeServiceData
    onCancel: () => void
  }
  
  export function HomeServiceForm({ initialData, onCancel }: HomeServiceFormProps) {
    const [activeTab, setActiveTab] = useState<"specializations" | "slots">("specializations")
  
    return (
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList>
            <TabsTrigger value="specializations">Specializations & Pricing</TabsTrigger>
            <TabsTrigger value="slots">Availability Slots</TabsTrigger>
          </TabsList>
          
          <TabsContent value="specializations">
            <HomeServiceSpecializationForm 
              initialData={initialData?.specializations}
              onNext={() => setActiveTab("slots")}
            />
          </TabsContent>
          
          <TabsContent value="slots">
            <HomeServiceSlotsForm
              initialData={initialData?.slots}
              onPrevious={() => setActiveTab("specializations")}
              onComplete={onCancel}
            />
          </TabsContent>
        </Tabs>
      </div>
    )
  }
  
 