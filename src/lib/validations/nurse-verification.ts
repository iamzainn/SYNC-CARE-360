import { z } from "zod"

export const nurseServicesSchema = z.object({
  services: z.array(z.string()).min(1, "Please select at least one service"),
})

export type NurseServicesValues = z.infer<typeof nurseServicesSchema> 