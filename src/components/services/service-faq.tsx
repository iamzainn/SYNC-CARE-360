import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  
  const faqs = [
    {
      question: "What medical services are available at home?",
      answer: "Our home medical services include general checkups, wound dressing, physical therapy, elderly care, post-surgery care, and emergency care. Each service is provided by qualified and verified medical professionals."
    },
    {
      question: "How quickly can a doctor arrive?",
      answer: "The arrival time depends on your location and doctor availability. Generally, our doctors can reach you within 1-2 hours for urgent cases, or you can schedule a visit at your preferred time slot."
    },
    {
      question: "Are the doctors verified?",
      answer: "Yes, all our doctors are thoroughly verified. We check their medical licenses, credentials, and professional experience. Only doctors who pass our strict verification process can provide home services."
    },
    {
      question: "What are the payment options?",
      answer: "We accept various payment methods including credit/debit cards, digital wallets, and cash. The payment can be made after the consultation is completed."
    },
    {
      question: "Can I choose a specific doctor?",
      answer: "Yes, you can select a specific doctor based on their specialization, availability, and ratings. You can view doctor profiles and choose the one that best meets your needs."
    }
  ]
  
  export function ServiceFAQ() {
    return (
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Find answers to common questions about our home medical services
          </p>
        </div>
  
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    )
  }