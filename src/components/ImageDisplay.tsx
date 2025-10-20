import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";

interface ImageDisplayProps {
  imageUrl: string | null;
  isGenerating: boolean;
}

export const ImageDisplay = ({ imageUrl, isGenerating }: ImageDisplayProps) => {
  if (isGenerating) {
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-lg">
        <Skeleton className="h-full w-full" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-card/50 backdrop-blur-sm">
          <Sparkles className="h-12 w-12 animate-pulse text-primary" />
          <p className="text-sm font-medium">Generating your image...</p>
        </div>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted/30">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground">
          <Sparkles className="h-12 w-12" />
          <p className="text-sm">Your generated image will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-lg">
      <img
        src={imageUrl}
        alt="Generated artwork"
        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>
  );
};
