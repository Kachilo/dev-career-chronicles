
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Book, Headphones, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SlideProps {
  imageUrl: string;
  title: string;
  subtitle: string;
}

const slides: SlideProps[] = [
  {
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1920&auto=format&fit=crop",
    title: "Insights That Transform",
    subtitle: "Explore our collection of articles, guides, and resources for modern professionals.",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1920&auto=format&fit=crop",
    title: "Career Growth Strategies",
    subtitle: "Discover proven methods to accelerate your professional development.",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1920&auto=format&fit=crop",
    title: "Freelancing Excellence",
    subtitle: "Build a thriving independent career with our expert insights.",
  }
];

export const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const nextSlide = () => {
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  };
  
  const prevSlide = () => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [current]);

  useEffect(() => {
    // Preload images for faster loading
    const preloadImages = () => {
      slides.forEach(slide => {
        const img = new Image();
        img.src = slide.imageUrl;
        img.onload = () => {
          if (slide === slides[0]) {
            setIsLoading(false);
          }
        };
      });
    };
    
    preloadImages();
  }, []);
  
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      )}
      
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${slide.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-8">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight animate-fade-in">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in">
                {slide.subtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
                  asChild
                >
                  <a href="/categories/all"><Book className="mr-2" /> Explore Blogs</a>
                </Button>
                
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto"
                  asChild
                >
                  <a href="/podcasts"><Headphones className="mr-2" /> Listen to Podcasts</a>
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-black/30 text-white border-white hover:bg-black/50 w-full sm:w-auto"
                  asChild
                >
                  <a href="#polls"><BarChart className="mr-2" /> Take a Poll</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <Button
        variant="ghost"
        size="icon"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 text-white hover:bg-black/50 h-10 w-10 rounded-full"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 text-white hover:bg-black/50 h-10 w-10 rounded-full"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
      
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full ${
              index === current ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
