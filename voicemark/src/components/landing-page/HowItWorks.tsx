import { Fingerprint, Globe, CheckCheck } from "lucide-react";
import { HowItWorksCard } from "../help-card/HowItWorksCard";

const steps = [
  {
    icon: Fingerprint,
    title: "Watermark Embedding",
    description:
      "VoiceMark invisibly embeds a digital watermark into the audio using a hybrid of signal processing and neural encoding. The goal is to make these watermarks hard to notice by ear, but potentially resilient to tampering attempts",
  },
  {
    icon: Globe,
    title: "Secure Distribution",
    description:
      "Once embedded, watermarked audio can be shared freely across platforms. The watermark should remain intact through common processing like compression or re-recording.",
  },
  {
    icon: CheckCheck,
    title: "Verification & Authentication",
    description:
      "Our detector can instantly detect and verify the watermark, confirming authenticity and origin. This allows anyone to validate audio with confidence and protect against deepfakes.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-12">How it works</h2>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <HowItWorksCard
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
