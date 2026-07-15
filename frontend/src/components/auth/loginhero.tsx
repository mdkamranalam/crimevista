import kspLogo from "@/assets/ksp-logo.png";
import vidhanaSoudha from "@/assets/vidhana-soudha.png";

export default function LoginHero() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between bg-sidebar text-white overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F3A] via-[#10294d] to-[#08172B]" />

      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative z-10 p-12">

        {/* Logo */}
        <div className="flex items-center gap-5">

          <img
            src={kspLogo}
            alt="Karnataka Police"
            className="h-20 w-20 object-contain"
          />

          <div>

            <h1 className="text-5xl font-black tracking-tight">
              <span className="text-white">Crime</span>
              <span className="text-primary">Vista</span>
            </h1>

            <p className="uppercase tracking-[0.35em] text-sm text-secondary mt-2">
              AI Crime Intelligence Platform
            </p>

            <p className="text-secondary text-sm mt-1">
              Government of Karnataka
            </p>

          </div>

        </div>

        {/* Hero Text */}

        <div className="mt-16 max-w-xl">

          <h2 className="text-4xl font-bold leading-tight">
            Secure.
            <br />
            Intelligent.
            <br />
            Effective.
          </h2>

          <p className="mt-6 text-lg text-secondary leading-8">
            Empowering Karnataka State Police with AI-driven crime analytics,
            predictive policing, relationship intelligence, and real-time
            decision support.
          </p>

        </div>

      </div>

      {/* Vidhana Soudha */}

      <div className="relative z-10 flex justify-center px-10">

        <img
          src={vidhanaSoudha}
          alt="Vidhana Soudha"
          className="w-[80%] opacity-15 object-contain"
        />

      </div>

      {/* Footer */}

      <div className="relative z-10 px-12 pb-10">

        <div className="h-px bg-white/10 mb-6" />

        <div className="flex justify-between text-sm text-secondary">

          <span>Karnataka State Police</span>

          <span>CrimeVista v2.0</span>

        </div>

      </div>

    </div>
  );
}