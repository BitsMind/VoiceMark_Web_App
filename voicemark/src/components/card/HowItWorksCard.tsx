import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import React from "react";

interface HowItWorksCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function HowItWorksCard({ icon: Icon, title, description }: HowItWorksCardProps) {
  return (
    <Card className="bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4 flex flex-col gap-4">
        <Icon className="w-10 h-10" />
        <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">{title}</h3>
        <p className="text-sm leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}
