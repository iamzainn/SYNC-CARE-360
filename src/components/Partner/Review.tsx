import { Card, CardContent } from "../ui/card";
import { Carousel, CarouselItem } from "../ui/carousel";

interface ReviewProps {
    text: string;
    author: string;
  }
  
  const ReviewCard: React.FC<ReviewProps> = ({ text, author }) => {
    return (
      <Card className="bg-white shadow-md">
        <CardContent>
          <p className="text-gray-800 mb-4">{text}</p>
          <p className="text-gray-600 font-medium">{author}</p>
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
      <section className="my-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Our Customers Love Us</h2>
        <Carousel className="mx-auto max-w-4xl">
          {reviews.map((review, index) => (
            <CarouselItem key={index}>
              <ReviewCard text={review.text} author={review.author} />
            </CarouselItem>
          ))}
        </Carousel>
      </section>
    );
  };
  
  export { ReviewsSection };