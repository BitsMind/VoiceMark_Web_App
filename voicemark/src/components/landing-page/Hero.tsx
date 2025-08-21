import { Logo } from "../logo/Logo";

export default function Hero() {
  return (
    <section
      className="relative min-h-screen w-full flex items-center justify-center bg-contain bg-center"
      id="hero"
      style={{ backgroundImage: "url('/hero.png')" }}
    >
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 text-center px-4 ">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight md:leading-tight drop-shadow-md">
          Audio-watermarking made simple
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-12 leading-relaxed drop-shadow-md">
          Reimagining audio trust through neural watermarking.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <a
            href="#services"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
          >
            Explore Features
          </a>
          <a
            href="/login"
            className="px-8 py-3 bg-transparent border border-white text-white rounded-lg shadow-lg hover:bg-white/10 transition-transform transform hover:scale-105"
          >
            Try VoiceMark
          </a>
        </div>
      </div>
    </section>
  );
}
