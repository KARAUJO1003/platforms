"use client";

import * as React from "react";

import { Progress } from "@/components/ui/progress";

export default function LinearProgressWithLabelDemo() {
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex justify-center items-center gap-3 w-full">
      <Progress
        value={progress}
        className="w-[60%]"
      />
      <span className="text-sm">{progress}%</span>
    </div>
  );
}
