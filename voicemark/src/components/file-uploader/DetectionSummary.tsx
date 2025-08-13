"use client";

import { ShieldAlert, ShieldX, UserCheck } from "lucide-react";
import { WatermarkDetectionResult } from "@/hooks/useWatermarkDetection";
import { cn } from "@/lib/utils";

export default function DetectionSummary({
  result,
}: {
  result: WatermarkDetectionResult;
}) {
  if (!result) return null;

  const { hasWatermark, isOwner } = result;

  const icon = hasWatermark ? (
    isOwner ? (
      <UserCheck className="text-green-500 w-5 h-5" />
    ) : (
      <ShieldAlert className="text-yellow-400 w-5 h-5" />
    )
  ) : (
    <ShieldX className="text-red-500 w-5 h-5" />
  );

  const summaryText = hasWatermark
    ? isOwner
      ? "This file contains a watermark, and you are the original creator."
      : "This file contains a watermark, but you are not the owner."
    : "No watermark was detected in this file.";

  return (
    <div className="rounded-md bg-muted/10 p-4 text-sm border border-border flex items-start gap-3 animate-fade-in">
      {icon}
      <p className={cn("text-sm leading-relaxed")}>{summaryText}</p>
    </div>
  );
}
