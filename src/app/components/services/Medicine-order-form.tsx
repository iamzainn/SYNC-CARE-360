/// components/services/medicine-order-form.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";







import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, ImageIcon, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  medicineOrderSchema,
  type MedicineOrderForm
  
} from "@/lib/validations/medicine-order";

import { UploadDropzone } from "@/utils/uploadthing";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createOrder, createPaymentIntent } from "@/lib/actions/ServiceOrder";
import { Medicine, medicines, pharmacies } from "@/lib/data/medicines";
import { StripePaymentForm } from "../payments/stripe-payment-form";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface UploadedFile {
  url: string;
  name: string;
}



export function MedicineOrderForm() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter()
  const [isPaymentPending, setIsPaymentPending] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [selectedMedicines, setSelectedMedicines] = useState<Medicine[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const { toast } = useToast();
  const [paymentIntent, setPaymentIntent] = useState<string>("");
  const [showPayment, setShowPayment] = useState(false);
  const SERVICE_CHARGE = 200; // Fixed service charge





  const form = useForm<MedicineOrderForm>({
    resolver: zodResolver(medicineOrderSchema),
    defaultValues: {
      medicines: [],
      prescriptionUrl: "",
      address: "",
      email: "",
      phoneNumber: "",
      patientName: "",
      pharmacyName: "",
      paymentMethod: "CASH_ON_DELIVERY",
      totalAmount: 0,
    },
  });

  // Calculate total amount whenever selected medicines change
  useEffect(() => {
    const medicineTotal = selectedMedicines.reduce(
      (sum, medicine) => sum + medicine.price,
      0
    );
    const total = medicineTotal + SERVICE_CHARGE;
    setTotalAmount(total);
    form.setValue("totalAmount", total);
  }, [selectedMedicines, form]);

  const handleMedicineSelect = (medicineId: string) => {
    const medicine = medicines.find(m => m.id === medicineId);
    if (!medicine) return;
  
    const isSelected = selectedMedicines.some(m => m.id === medicineId);
    if (!isSelected) {
      const newSelected = [...selectedMedicines, medicine];
      setSelectedMedicines(newSelected);
      form.setValue('medicines', newSelected.map(m => m.id));
    }
  };
  
  const handleMedicineRemove = (medicineId: string) => {
    const newSelected = selectedMedicines.filter(m => m.id !== medicineId);
    setSelectedMedicines(newSelected);
    form.setValue('medicines', newSelected.map(m => m.id));
  };

  const handleOrderSuccess = () => {
    toast({
      title: "Order Placed Successfully!",
      description: "We'll contact you shortly to confirm your order.",
    })
    
    // Reset form state
    form.reset()
    setUploadedFile(null)
    setSelectedMedicines([])
    setTotalAmount(0)
    
    // Redirect to home page
    router.push('/')
  }

  // Handle order failure
  const handleOrderFailure = (error: any) => {
    toast({
      variant: "destructive",
      title: "Order Failed",
      description: error?.message || "Something went wrong. Please try again.",
    })
    setIsPending(false)
    setIsPaymentPending(false)
  }

  

  async function handlePayment(orderData: MedicineOrderForm) {
    setIsPaymentPending(true);
    try {
      const paymentResult = await createPaymentIntent(totalAmount);
      if (!paymentResult.success) {
        throw new Error(paymentResult.error);
      }
      setPaymentIntent(paymentResult.clientSecret ?? "");
      setShowPayment(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initialize payment",
      });
    } finally {
      setIsPaymentPending(false);
    }
  }

  const handlePaymentSuccess = async () => {
    setIsPending(true)
    try {
      const formData = form.getValues()
      const result = await createOrder({
        ...formData,
        paymentMethod: "CARD",
        amount: totalAmount,
        stripePaymentId: paymentIntent
      })

      if (!result.success) {
        throw new Error(result.error)
      }

      setShowPayment(false)
      handleOrderSuccess()
    } catch (error) {
      handleOrderFailure(error)
    }
  }

  // Handle Payment Cancel
  const handlePaymentCancel = () => {
    setShowPayment(false)
    setPaymentIntent("")
    setIsPaymentPending(false)
  }

  const handleFileRemove = () => {
    setUploadedFile(null)
    form.setValue('prescriptionUrl', '')
    // Reset validation state for the field
    form.clearErrors('prescriptionUrl')
  }

  async function handleCashOnDelivery(data: MedicineOrderForm) {
    setIsPending(true);
    try {
      const result = await createOrder({
        ...data,
        
        paymentMethod: "CASH_ON_DELIVERY",
        totalAmount: totalAmount,

      });

      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: "Order Placed!",
        description: "We'll contact you shortly to confirm your order.",
      });

      form.reset();
      setUploadedFile(null);
      setSelectedMedicines([]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to place order. Please try again.",
      });
    } finally {
      setIsPending(false);
    }
  }

  async function onSubmit(data: MedicineOrderForm) {
    if (selectedMedicines.length === 0 && !data.prescriptionUrl) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select medicines or upload a prescription",
      });
      return;
    }

    if (data.paymentMethod === "CARD") {
      await handlePayment(data);
    } else {
      await handleCashOnDelivery(data);
    }
  }

  return (
    <section
      id="order-form"
      className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
          Order Medicine Online At Your Doorstep
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Fill out the following form please:
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Medicine Selection */}
            {/* Replace the existing Medicine Selection FormField with this: */}
<FormField
  control={form.control}
  name="medicines"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Select Medicines</FormLabel>
      <Select
        onValueChange={(value) => {
          const medicine = medicines.find(m => m.id === value);
          if (medicine) {
            handleMedicineSelect(medicine.id);
          }
        }}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a medicine" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {medicines.map((medicine) => (
            <SelectItem
              key={medicine.id}
              value={medicine.id}
            >
              {medicine.name} - Rs. {medicine.price}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Selected Medicines Display */}
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedMedicines.map((medicine) => (
          <Badge
            key={medicine.id}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {medicine.name} - Rs. {medicine.price}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-auto p-0 px-1"
              onClick={() => handleMedicineRemove(medicine.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>

      {/* Total Amount Display */}
      {selectedMedicines.length > 0 && (
        <div className="mt-2 text-sm text-gray-600">
          <div>Medicines Total: Rs. {totalAmount - SERVICE_CHARGE}</div>
          <div>Service Charge: Rs. {SERVICE_CHARGE}</div>
          <div className="font-bold">Total Amount: Rs. {totalAmount}</div>
        </div>
      )}
      <FormMessage />
    </FormItem>
  )}
/>

            <div className="text-center text-gray-500 text-sm my-4">OR</div>

            {/* UploadThing Integration */}
            <FormField
              control={form.control}
              name="prescriptionUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attach your prescription form</FormLabel>
                  <FormControl>
                    <div className="flex flex-col space-y-4">
                      {!uploadedFile ? (
                        <UploadDropzone
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            if (res && res[0]) {
                              setUploadedFile({
                                url: res[0].url,
                                name: res[0].name,
                              });
                              field.onChange(res[0].url);
                            }
                            toast({
                              title: "Upload Complete",
                              description: "Prescription uploaded successfully",
                            });
                          }}
                          onUploadError={(error: Error) => {
                            toast({
                              variant: "destructive",
                              title: "Error",
                              description:
                                error.message || "Failed to upload file",
                            });
                          }}
                          appearance={{
                            container:
                              "p-6 border-2 border-dashed border-gray-300 rounded-lg",
                            allowedContent: "text-sm text-gray-500",
                            button: cn(
                              "bg-blue-600 hover:bg-blue-700 text-white",
                              "ut-uploading:bg-blue-500 ut-uploading:cursor-not-allowed"
                            ),
                          }}
                        />
                      ) : (
                        <div className="relative flex items-center p-4 bg-gray-50 rounded-lg">
                          <ImageIcon className="h-8 w-8 text-blue-500 mr-3" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {uploadedFile.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Upload complete
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="ml-2"
                            onClick={handleFileRemove}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Write your address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your complete delivery address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone and Patient Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="03XX XXXXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="patientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Add Patient s Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Patient Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Pharmacy Name */}
            <FormField
              control={form.control}
              name="pharmacyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Pharmacy</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a pharmacy" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pharmacies.map((pharmacy) => (
                        <SelectItem
                          key={pharmacy.id}
                          value={pharmacy.name}
                          className="relative"
                        >
                          <div className="flex flex-col">
                            <span>{pharmacy.name}</span>
                            <span className="text-sm text-gray-500">
                              {pharmacy.city} - {pharmacy.metadata?.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Payment Method */}
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="CASH_ON_DELIVERY" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Cash on Delivery
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="CARD" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Pay with Card
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isPending || isPaymentPending}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </div>
              ) : isPaymentPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Initializing Payment...
                </div>
              ) : (
                "Place Order"
              )}
            </Button>
          </form>
        </Form>
        <Dialog open={showPayment} onOpenChange={setShowPayment}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Complete Payment</DialogTitle>
            </DialogHeader>
            {paymentIntent && (
              <StripePaymentForm
                clientSecret={paymentIntent}
                amount={totalAmount}
                onSuccess={handlePaymentSuccess}
                onCancel={handlePaymentCancel}
                orderDetails={{
                  name: form.getValues('patientName'),
                  address: form.getValues('address'),
                  phone: form.getValues('phoneNumber'),
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
