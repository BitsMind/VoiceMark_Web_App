import React from "react";
import { Home } from "lucide-react";

export default async function Page() {
  return (
    <div className="p-6">
      <div className="text-white mb-10">
        <h1 className="text-3xl font-semibold flex items-center gap-4">
          <Home className="w-8 h-8" />
          Main Page
        </h1>
        <p className="text-sm text-gray-300">
          Main page here
        </p>
      </div>
    </div>
  );
}