"use client";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

export default function SliderWithArrowStickyLabel({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
  className?: string;
}) {
  const [progress, setProgress] = React.useState([30]);
  return (
    <div className="relative flex flex-col items-center w-full max-w-sm">
      <SliderPrimitive.Root
        className={cn(
          "relative flex items-center w-full touch-none select-none",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track className="relative bg-primary/20 rounded-full w-full h-1.5 overflow-hidden grow">
          <SliderPrimitive.Range className="absolute bg-primary h-full" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block bg-background disabled:opacity-50 shadow border border-primary/50 rounded-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring w-4 h-4 transition-colors disabled:pointer-events-none">
          {/* Sticky label */}
          <Badge className="-top-5 left-1/2 absolute -translate-x-1/2 -translate-y-1/2">
            <span>{props.value?.[0]}%</span>
            {/* Arrow */}
            <div className="top-full left-1/2 absolute border-[6px] border-t-primary border-transparent -translate-x-1/2" />
          </Badge>
        </SliderPrimitive.Thumb>
      </SliderPrimitive.Root>
    </div>
  );
}
