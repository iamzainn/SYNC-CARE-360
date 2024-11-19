import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { HomeServiceSpecializationForm } from "./SpecializationForm"
import { HomeServiceSlotsForm } from "./SlotsForm"
import { HomeServiceData } from "@/types"
import { useHomeServiceStore } from "@/store/useHomeServiceStore"
import { useToast } from "@/hooks/use-toast"
import { updateHomeService } from "@/lib/actions/home-service"

interface HomeServiceFormProps {
    initialData?: HomeServiceData
    onCancel: () => void
  }
  
  export function HomeServiceForm({ onCancel }: { onCancel: () => void }) {
    const store = useHomeServiceStore()
    const { toast } = useToast()
    const [isPending, setIsPending] = useState(false)
    const [activeTab, setActiveTab] = useState<"specializations" | "slots">("specializations")

    const handleComplete = async () => {
      setIsPending(true)
      try {
        const response = await updateHomeService({
          isActive: true,
          specializations: store.specializations,
          slots: store.slots
        })
  
        if (response.error) throw new Error(response.error)
  
        toast({
          title: "Success",
          description: "Home service settings saved successfully"
        })
        onCancel()
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to save settings",
          variant: "destructive"
        })
      } finally {
        setIsPending(false)
      }
    }
  
    return (
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList>
            <TabsTrigger value="specializations">Specializations & Pricing</TabsTrigger>
            <TabsTrigger value="slots">Availability Slots</TabsTrigger>
          </TabsList>
          
          <TabsContent value="specializations">
            <HomeServiceSpecializationForm 
              onNext={() => setActiveTab("slots")}
            />
          </TabsContent>
          
          <TabsContent value="slots">
            <HomeServiceSlotsForm
              onPrevious={() => setActiveTab("specializations")}
              onComplete={onCancel}
            />
          </TabsContent>
        </Tabs>
      </div>
    )
  }
  
  
 