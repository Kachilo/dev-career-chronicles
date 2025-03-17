
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
}

export const LazyImage = ({
  src,
  alt,
  placeholderSrc = "/placeholder.svg",
  className,
  ...props
}: LazyImageProps) => {
  const [imageSrc, setImageSrc] = useState<string>(placeholderSrc);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
  }, [src]);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={cn(
        "transition-opacity duration-300",
        isLoaded ? "opacity-100" : "opacity-50",
        className
      )}
      loading="lazy"
      {...props}
    />
  );
};
