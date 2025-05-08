
import type React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ColorPaletteDisplayProps {
  colors: string[];
}

export const ColorPaletteDisplay: React.FC<ColorPaletteDisplayProps> = ({ colors }) => {
  if (!colors || colors.length === 0) {
    return <p className="text-sm text-muted-foreground">No colors identified.</p>;
  }

  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-3">
        {colors.map((color, index) => (
          <Tooltip key={index} delayDuration={100}>
            <TooltipTrigger asChild>
              <div
                className="w-10 h-10 rounded-md border border-border shadow-sm cursor-default"
                style={{ backgroundColor: color }}
                aria-label={`Color ${color}`}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{color}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};
