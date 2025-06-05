import Image from "next/image";
// import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
// import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="border bg-red-300/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Contact Info */}
          <div className="flex flex-col space-y-4">
            <Image
              src="/test.svg"
              alt="HoverSprite Logo"
              width={120}
              height={120}
              className="object-contain"
            />
            <p>
              1234 Sprayer Ave,
              <br /> Farming City, FC 56789
            </p>
            <p>Phone: (123) 456-7890</p>
            <p>Email: contact@voicemark.com</p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-2">
            <h4 className="text-lg font-semibold font-bold">Quick Links</h4>
            <a href="#hero" className="hover:underline">
              Home
            </a>
            <a href="#services" className="hover:underline">
              Services
            </a>
            <a href="#about" className="hover:underline">
              About Us
            </a>
          </div>

          {/* Social Media and Message */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-lg font-semibold font-bold">Github:</h4>
            <p className="text">You can find the source code here: </p>
            <div className="flex space-x-4"></div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-center">
          <p className="font-bold">© 2025 VoiceMark. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
