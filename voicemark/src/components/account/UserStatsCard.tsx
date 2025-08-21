import { Card } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { HelpTooltip } from "../help-card/HelpToolTip";

interface Props {
  label: string;
  helpText: string;
  count: number;
  bars?: number[];
}

export function UserStatsCard({ label, count, helpText, bars = [100, 120, 150, 80, 60] }: Props) {
  const [animatedBars, setAnimatedBars] = useState<number[]>(bars.map(() => 0));

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedBars(bars), 100);
    return () => clearTimeout(timeout);
  }, [bars]);

  function getBarColor(value: number): string {
    if (value >= 120) return "bg-green-500";
    if (value >= 80) return "bg-yellow-400";
    return "bg-red-400";
  }

  return (
    <Card className="relative rounded-2xl p-4 shadow-sm h-40 w-full overflow-hidden grid grid-cols-3 gap-4">
      <HelpTooltip text={helpText}/>

      <div className="col-span-2 flex flex-col justify-center">
        <h3 className="text-3xl font-semibold text-muted-foreground">{count}</h3>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>

      <div className="flex justify-end items-end space-x-1">
        {animatedBars.map((h, i) => (
          <div
            key={i}
            className={`w-5 rounded-full transition-all duration-700 ease-out ${getBarColor(h)}`}
            style={{ height: `${h / 2.5}%` }}
          />
        ))}
      </div>
    </Card>
  );
}
