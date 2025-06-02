import React from "react";
import { Home } from "lucide-react";


export default async function Page() {
  return (
    <div className="p-6">
      <div className="text-gray-900 mb-10">
        <h1 className="text-3xl font-semibold flex items-center gap-4">
          <Home className="w-8 h-8" />
          Landing Page
        </h1>
        <p className="text-sm text-gray-600">
          Landing page here
        </p>
      </div>
    </div>
  );
}