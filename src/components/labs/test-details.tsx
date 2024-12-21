// components/labs/test-details.tsx

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Test } from "@/lib/types/lab-test"

interface TestDetailsProps {
  test: Test
}

export function TestDetails({ test }: TestDetailsProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">{test.name}</h1>
        <p className="text-gray-600 mt-1">Known as {test.knownAs}</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">About this Test</h2>
        <p className="text-gray-600">{test.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <span className="text-sm text-gray-500">Sample Type</span>
            <p className="font-medium">{test.sampleType}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Age Group</span>
            <p className="font-medium">{test.ageGroup}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Category</span>
            <p className="font-medium">{test.category}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Report Time</span>
            <p className="font-medium">{test.turnaroundTime}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Preparation Instructions</h2>
        <ul className="space-y-2">
          {test.preparations.map((prep, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="rounded-full bg-blue-100 p-1 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              </div>
              <span className="text-gray-600">{prep.instruction}</span>
            </li>
          ))}
        </ul>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {test.faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}