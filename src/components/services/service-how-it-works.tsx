export function ServiceHowItWorks() {
    const steps = [
      {
        number: "01",
        title: "Select a Doctor",
        description: "Choose from our verified doctors based on your medical needs"
      },
      {
        number: "02",
        title: "Book Appointment",
        description: "Select a convenient time slot that works best for you"
      },
      {
        number: "03",
        title: "Get Confirmation",
        description: "Receive instant confirmation and doctor's details"
      },
      {
        number: "04",
        title: "Home Visit",
        description: "Doctor arrives at your doorstep at the scheduled time"
      }
    ]
  
    return (
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto bg-gray-50">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg">
            Simple steps to get medical care at home
          </p>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative text-center p-6"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/4 right-0 w-full h-0.5 bg-gray-200 transform translate-y-2" />
              )}
              
              {/* Step Number */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold text-xl mb-4 relative z-10">
                {step.number}
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </section>
    )
  }