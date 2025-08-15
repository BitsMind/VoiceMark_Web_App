import { Logo } from "../logo/Logo";

export default function Footer() {
  return (
    <footer className="border-3 bg-red-300/10 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 items-center">
          <div className="flex justify-start">
            <Logo width={250} />
          </div>

          <div className="flex justify-center">
            <p className="font-bold text-center">
              © 2025 VoiceMark. All Rights Reserved.
            </p>
          </div>

          <div />
        </div>
      </div>
    </footer>
  );
}
