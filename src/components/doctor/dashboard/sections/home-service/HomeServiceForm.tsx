import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import { HomeServiceSpecializationForm } from "./SpecializationForm"
import { HomeServiceSlotsForm } from "./SlotsForm"
import { getHomeService } from "@/lib/actions/home-service"
import { useHomeServiceStore } from "@/store/useHomeServiceStore"
import { Loader2 } from "lucide-react"

  
  // HomeServiceForm.tsx
export function HomeServiceForm({ onCancel }: { onCancel: () => void }) {
  const [activeTab, setActiveTab] = useState<"specializations" | "slots">("specializations");
  const store = useHomeServiceStore();
  const [isLoading, setIsLoading] = useState(true);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getHomeService();
        if (response.data?.homeService) {
          store.setSpecializations(response.data.homeService.specializations);
          store.setSlots(response.data.homeService.slots);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
 
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
 
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList>
          <TabsTrigger value="specializations">Specializations & Pricing</TabsTrigger>
          <TabsTrigger value="slots">Availability Slots</TabsTrigger>
        </TabsList>
        
        <TabsContent value="specializations">
          <HomeServiceSpecializationForm onNext={() => setActiveTab("slots")} />
        </TabsContent>
        
        <TabsContent value="slots">
          <HomeServiceSlotsForm
            onPrevious={() => setActiveTab("specializations")}
            onComplete={onCancel}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
 }
  
  
 