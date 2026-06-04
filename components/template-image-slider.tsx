import { useState, TouchEvent } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateImageSliderProps {
  images: string[];
  onImageClick: (imageUrl: string) => void;
  title: string;
}

export function TemplateImageSlider({ images, onImageClick, title }: TemplateImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handleDotClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(index);
  };

  // Touch handlers for swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    } else if (isRightSwipe) {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div 
      className="relative group/slider w-full aspect-[2/1] overflow-hidden rounded-xl border border-border/50 bg-muted/20 select-none cursor-pointer"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={() => onImageClick(images[currentIndex])}
    >
      {/* Images container */}
      <div 
        className="flex w-full h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, i) => (
          <div key={i} className="w-full h-full shrink-0 relative">
            <img 
              src={img} 
              alt={`${title} preview ${i + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Dark gradient overlay on hover */}
            <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="p-2.5 rounded-full bg-background/90 backdrop-blur-xs text-foreground shadow-lg transform translate-y-2 group-hover/slider:translate-y-0 transition-all duration-300">
                <Maximize2 className="h-4 w-4 text-emerald-500 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-xs border border-white/10 text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer z-10"
            title="Sebelumnya"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-xs border border-white/10 text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer z-10"
            title="Berikutnya"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}

      {/* Indicator Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 py-1 px-2 rounded-full bg-black/40 backdrop-blur-xs">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => handleDotClick(i, e)}
              className={cn(
                "h-1.5 transition-all duration-300 rounded-full cursor-pointer",
                i === currentIndex ? "w-4 bg-emerald-500" : "w-1.5 bg-white/40 hover:bg-white/60"
              )}
              title={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
