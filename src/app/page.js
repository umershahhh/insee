import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/Navbar";

export default function HomePage() {
  
  function StepCard({ step, title, desc, img }) {
    return (
      <div className="group group/card bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300">
        <div className="relative h-44 overflow-hidden">
          <Image
            src={img}
            alt={title}
            fill
            className="object-cover group-hover/card:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
          <span className="absolute top-4 left-4 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg shadow-lg">
            {step}
          </span>
        </div>
        <div className="p-6 text-left">
          <h3 className="font-bold text-xl mb-2 text-slate-900 group-hover/card:text-blue-600 transition-colors">{title}</h3>
          <p className="text-slate-600 leading-relaxed">{desc}</p>
        </div>
      </div>
    );
  }
  
  function FeatureCard({ title, desc, img, icon }) {
    return (
      <div className="group group/card bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-2 transition-all duration-300">
        <div className="relative h-36 overflow-hidden">
          <Image
            src={img}
            alt={title}
            fill
            className="object-cover group-hover/card:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
          <span className="absolute top-3 right-3 text-2xl drop-shadow">{icon}</span>
        </div>
        <div className="p-5 text-left">
          <h3 className="font-bold text-lg mb-1.5 text-slate-900 group-hover/card:text-blue-600 transition-colors">{title}</h3>
          <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Navbar />
      <main className="bg-slate-50 text-slate-900 overflow-hidden">

        {/* HERO — Full-bleed with gradient and CTA */}
        <section className="relative h-[92vh] min-h-[560px] flex items-center justify-center">
          <Image
            src="/assets/landing-banner.jpg"
            alt="Smart Cane Banner"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_20%,rgba(59,130,246,0.15),transparent)]" />

          <div className="relative z-10 max-w-4xl text-center px-6">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-5 tracking-tight leading-tight animate-fade-in">
              Empowering Independence for the Visually Impaired
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-2xl mx-auto animate-fade-in animate-delay-150">
              A smart cane system that enhances safety, mobility, and real-time monitoring.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 animate-fade-in animate-delay-300"
            >
              Get Started
            </Link>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
        </section>

        {/* PURPOSE */}
        <section id="purpose" className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <span className="text-blue-500 font-semibold text-sm uppercase tracking-wider">Our Mission</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-5 text-slate-900">
                Purpose of the Smart Cane
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                The Smart Cane is designed to assist visually impaired individuals
                by detecting obstacles, sending alerts, tracking activity, and
                allowing caretakers to monitor safety through a web dashboard.
              </p>
            </div>
            <div className="order-1 md:order-2 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500" />
              <Image
                src="/assets/purpose.jpg"
                alt="Smart Cane Purpose"
                width={560}
                height={380}
                className="relative rounded-2xl shadow-xl object-cover ring-1 ring-slate-200/50 group-hover:scale-[1.02] transition duration-500"
              />
            </div>
          </div>
        </section>

        {/* HOW IT WORKS — Cards with images and hover */}
        <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <span className="text-blue-500 font-semibold text-sm uppercase tracking-wider">Process</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-14 mt-2 text-slate-900">How the System Works</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <StepCard
                step={1}
                title="Sense Obstacles"
                desc="Sensors in the cane detect nearby obstacles in real time."
                img="/assets/purpose.jpg"
              />
              <StepCard
                step={2}
                title="Alert the User"
                desc="Audio or vibration alerts notify the user instantly."
                img="/assets/banner.jpg"
              />
              <StepCard
                step={3}
                title="Monitor Remotely"
                desc="Caretakers can monitor live location and activity via the web app."
                img="/assets/benefits.jpg"
              />
            </div>
          </div>
        </section>

        {/* KEY FEATURES — 4 cards with images */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="text-blue-500 font-semibold text-sm uppercase tracking-wider">Capabilities</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 text-slate-900">Key Features</h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard
                title="Obstacle Detection"
                desc="Detects obstacles ahead to prevent accidents"
                img="/assets/purpose.jpg"
                icon="🛡️"
              />
              <FeatureCard
                title="Instant Alerts"
                desc="Audio & vibration alerts for quick response"
                img="/assets/banner.jpg"
                icon="🔔"
              />
              <FeatureCard
                title="Activity Tracking"
                desc="Tracks movement and walking patterns"
                img="/assets/landing-banner.jpg"
                icon="📊"
              />
              <FeatureCard
                title="Web Monitoring"
                desc="Caretaker dashboard for live tracking"
                img="/assets/benefits.jpg"
                icon="🖥️"
              />
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-35 transition duration-500" />
              <Image
                src="/assets/benefits.jpg"
                alt="Benefits"
                width={560}
                height={380}
                className="relative rounded-2xl shadow-xl object-cover ring-1 ring-slate-200/50 group-hover:scale-[1.02] transition duration-500"
              />
            </div>

            <div>
              <span className="text-blue-500 font-semibold text-sm uppercase tracking-wider">Impact</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
                Benefits for the Visually Impaired
              </h2>
              <ul className="space-y-4 text-slate-600 text-lg">
                {[
                  "Greater independence and confidence",
                  "Improved personal safety",
                  "Faster response during emergencies",
                  "Peace of mind for caretakers and family",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 group/item">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center text-sm font-bold group-hover/item:bg-blue-500/20 transition">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-slate-800" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(255,255,255,0.08),transparent)]" />
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_40%,rgba(255,255,255,0.04)_50%,transparent_60%)] bg-[length:56px_56px] bg-repeat opacity-70" />
          <div className="relative z-10 text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Take the Next Step Towards Independence
            </h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
              Join thousands who have gained confidence and safety with the Smart Cane system.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-slate-100 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Join Us Today
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

