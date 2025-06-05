import Image from "next/image";

export default function Features() {
  return (
    <section
      id="services"
      className="min-h-screen w-full max-w-7xl mx-auto py-16 px-4 flex flex-col justify-center"
    >
      {/* About Us Section */}
      <section
        id="about-us"
        className="py-12 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-slate-600/50 rounded-2xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* About Us Text */}
            <div className="flex-1" data-aos="fade-right">
              <h2 className="text-3xl font-bold text-white mb-4">
                What is VoiceMark?
              </h2>
              <p className="text-zinc-200 mb-4 text-justify">
                VoiceMark is a solution for safeguarding audio authenticity in
                the age of AI-generated speech. By combining classic signal
                processing with neural networks, VoiceMark embeds imperceptible
                watermarks into voice recordings — helping users protect their
                identity, verify content, and prevent misuse.
              </p>
              <p className="text-zinc-200 text-justify">
                Our mission is to redefine trust in digital communication by
                offering accessible, secure, and resilient watermarking tools.
                Whether you're a creator, educator, or everyday user, VoiceMark
                empowers you to take control of your audio and preserve
                authenticity in an increasingly synthetic world.
              </p>
            </div>

            {/* About Us Image */}
            <div>
              <Image
                src="/gura.jpg"
                alt="About VoiceMark"
                width={300}
                height={80}
                className="rounded-lg shadow-lg object-fill"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <h2
        className="text-4xl font-bold text-white text-center mt-12 mb-12"
        data-aos="fade-right"
      >
        Why VoiceMark?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-5">
        {/* Feature Cards */}
        {[
          {
            title: "Preserves Voice Integrity",
            description:
              "Maintains audio quality while embedding imperceptible watermarks - no distortion, no compromise.",
            image: "/gura.jpg",
          },
          {
            title: "Accessible & Easy to Use",
            description:
              "Simple and intuitive interface designed for all technical skill levels.",
            image: "/gura.jpg",
          },
          {
            title: "Authentication You Can Trust",
            description:
              "Verify the origin of audio content quickly and securely, supporting ethical use and digital accountability.",
            image: "/gura.jpg",
          },
          {
            title: "Save and Manage Your Files",
            description:
              "Embedded audio files can be effortlessly saved and managed in your account.",
            image: "/gura.jpg",
          },
        ].map((feature, i) => (
          <div
            key={i}
            className="text-center p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/5 backdrop-blur-sm border border-white/10"
            data-aos="zoom-in"
          >
            <div className="mb-4 mx-[-2rem] mt-[-2rem] rounded-t-lg overflow-hidden">
              <Image
                src={feature.image}
                alt={feature.title}
                width={500}
                height={128}
                className="w-full h-32 object-fill"
              />
            </div>

            <h3 className="text-xl font-semibold text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-zinc-200">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
