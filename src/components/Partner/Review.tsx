import { Card, CardContent } from "../ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { QuoteIcon } from "lucide-react";

interface ReviewProps {
  text: string;
  author: string;
  avatarUrl?: string;
}

const ReviewCard: React.FC<ReviewProps> = ({ text, author, avatarUrl }) => {
  return (
    <Card className="bg-white border-none shadow-md h-full">
      <CardContent className="p-6 relative bg-primary/10 rounded-md h-full flex flex-col">
        <div className="flex justify-center -mt-12 mb-4">
          <Avatar className="h-16 w-16 border-4 border-white shadow-sm">
            <AvatarImage src={avatarUrl} alt={author} />
            <AvatarFallback className="bg-primary/20">
              {author.split(' ').map(name => name[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <QuoteIcon className="text-primary/30 h-8 w-8 absolute left-4 top-12" />
        
        <div className="mt-4 flex-grow">
          <p className="text-gray-800 mb-5 px-4 text-center relative z-10">
            {text}
          </p>
        </div>
        
        <div className="text-center mt-auto">
          <p className="text-primary font-semibold uppercase text-sm tracking-wider">{author}</p>
        </div>
        
        <QuoteIcon className="text-primary/30 h-8 w-8 absolute right-4 bottom-12 rotate-180" />
      </CardContent>
    </Card>
  );
};

const ReviewsSection = () => {
  const reviews = [
    {
      text: '"Great platform, very efficient and works really well on both phone and web. I think this is the most easiest way of booking appointments in Pakistan as it has made the whole process much more efficient."',
      author: 'Umer Fayyaz',
    },
    {
      text: '"A very helpful app for booking appointments and searching for the required doctors. Has made my life a lot easy. I would strongly recommend this to all"',
      author: 'Aneeb Ryan',
    },
    {
      text: '"Literally the best website for booking appointments online for Doctors. Everything is great, helpline guys are very hassle through different things now."',
      author: 'Zainab Tariq',
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-primary uppercase font-medium tracking-wider mb-2">TESTIMONIALS</h3>
          <h2 className="text-3xl font-bold">What Our Clients Say</h2>
        </div>
        
        <div className="relative">
          <Carousel className="mx-auto max-w-6xl">
            <CarouselContent className="py-8">
              {reviews.map((review, index) => (
                <CarouselItem key={index} className="md:basis-1/3 px-4">
                  <div className="h-full pt-12">
                    <ReviewCard 
                      text={review.text} 
                      author={review.author} 
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2" />
            <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2" />
          </Carousel>
          
          <div className="flex justify-center mt-6 gap-2">
            {reviews.map((_, index) => (
              <div key={index} className={`h-2 w-2 rounded-full ${index === 0 ? 'bg-primary' : 'bg-primary/30'}`}></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { ReviewsSection };