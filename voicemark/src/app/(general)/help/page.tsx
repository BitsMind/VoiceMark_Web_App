"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type FAQ = {
  question: string;
  answer: string;
};

type FAQCategory = {
  category: string;
  faqs: FAQ[];
};

const faqCategories: FAQCategory[] = [
  {
    category: "Getting Started",
    faqs: [
      { question: "How do I sign up for VoiceMark?", answer: "Simply click 'Sign Up' on the landing page or login page and follow the instructions. You’ll need a valid email address." },
      { question: "Do I need to verify my email before uploading files?", answer: "Yes, email verification ensures your account security before allowing uploads." },
      { question: "Can I use VoiceMark on mobile devices?", answer: "Yes, VoiceMark works on both desktop and mobile browsers, but in order to provide the best experience, small screen phones won't be able to use the app." },
      { question: "Is there a desktop app available?", answer: "Currently no, but a desktop client is planned for the future." },
    ],
  },
  {
    category: "File Management",
    faqs: [
      { question: "What is the maximum file size I can upload?", answer: "Currently, we are in a pilot run of the application, so we are restricting you to files up to 20 MB in size until further development." },
      { question: "Can I upload multiple files at once?", answer: "Yes, batch uploads are supported through the drag-and-drop interface." },
      { question: "Can I delete my uploaded files?", answer: "Yes, you can delete your files in your account page. Keep in mind, doing so will delete all data related to that file" },
      { question: "Can I organize files into folders or playlists?", answer: "Currently no, but tagging and folder support are planned." },
    ],
  },
  {
    category: "Account & Storage",
    faqs: [
      { question: "How can I upgrade my storage limit?", answer: "As of now, we are doing a pilot run. So we are limiting all account to 500MB storage. Further upgrade are planned" },
      { question: "Can I transfer files between accounts?", answer: "No, files are bound to the account that uploaded them." },
      { question: "How do I check which files take up the most space?", answer: "Go to 'Account' to see file sizes sorted in the mfile management table." },
    ],
  },
  {
    category: "Security",
    faqs: [
      { question: "How does VoiceMark protect against unauthorized downloads?", answer: "Download links are tokenized and expire after a short time." },
      { question: "Can someone remove my watermark?", answer: "Watermarks are resilient against most tampering, though no system is 100% foolproof." },
      { question: "Is watermarking reversible?", answer: "No, once embedded, a watermark cannot be removed without audio degradation." },
      { question: "Are uploaded files encrypted?", answer: "Yes, all files are encrypted both in transit and at rest." },
    ],
  },
  {
    category: "Troubleshooting",
    faqs: [
      { question: "Why is my audio watermark not showing during verification?", answer: "Ensure the file hasn’t been altered significantly (e.g., heavy compression, cut,... Or check your Internet connection." },
      { question: "Upload stuck — what should I do?", answer: "Try refreshing and re-uploading. Large files may take longer to finalize. Check your internet connection" },
      { question: "Why do I hear distortion in my uploaded file?", answer: "This may happen if the original file was already low-quality or compressed multiple times." },
      { question: "My download link expired, how can I re-generate it?", answer: "Go to your file list and click 'Download' again to create a fresh link." },
    ],
  },
  {
    category: "Advanced / Technical",
    faqs: [
      { question: "What algorithm is used for watermarking?", answer: "We use a hybrid of traditional signal processing and neural network-based embedding using our custom-built AudioSeal model from Meta." },
      { question: "Does watermarking affect audio bitrate or compression?", answer: "No, watermarks are imperceptible and do not reduce audio quality." },
    ],
  },
];

export default function HelpPage() {
  const [search, setSearch] = useState("");

  const filteredCategories = faqCategories.map((category) => ({
    ...category,
    faqs: category.faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer.toLowerCase().includes(search.toLowerCase())
    ),
  }));

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Help & FAQs</h1>
        <p className="text-gray-300 text-center mb-8">
          Find answers to common questions and troubleshoot issues with VoiceMark.
        </p>

        <div className="mb-8">
          <Input
            type="text"
            placeholder="Search FAQs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <div className="space-y-10">
          {filteredCategories.map(
            (category) =>
              category.faqs.length > 0 && (
                <div key={category.category}>
                  <h2 className="text-2xl font-semibold mb-4">{category.category}</h2>
                  <Accordion type="single" collapsible className="space-y-2">
                    {category.faqs.map((faq, idx) => (
                      <AccordionItem key={idx} value={`${category.category}-${idx}`} className="border border-gray-700 rounded-lg">
                        <AccordionTrigger className="px-4 py-2 hover:bg-gray-800">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-2 text-gray-300">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
}
