import Image from "next/image";

export function BackgroundEffects() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Dark base */}
      <div className="absolute inset-0 bg-black" />

      {/* Enhanced Aurora gradient orbs - spread out across the entire viewport */}
      {/* Responsive: fewer and dimmer on mobile, full effect on desktop */}

      {/* Top left corner */}
      <div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-cyan-500/5 md:bg-cyan-500/12 lg:bg-cyan-500/40 rounded-full blur-3xl animate-pulse-slow" />

      {/* Top right corner */}
      <div className="absolute -top-32 -right-40 w-[800px] h-[800px] bg-purple-500/5 md:bg-purple-500/12 lg:bg-purple-500/35 rounded-full blur-3xl animate-pulse-slow" />

      {/* Top center - hidden on mobile and tablet */}
      <div className="hidden lg:block absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-400/30 rounded-full blur-[120px] animate-pulse-slower" />

      {/* Middle right edge - hidden on small/medium, visible on large */}
      <div className="hidden lg:block absolute top-1/2 -right-48 w-[650px] h-[650px] bg-violet-400/30 rounded-full blur-[100px] animate-pulse-slower" />

      {/* Middle left edge - hidden on small/medium, visible on large */}
      <div className="hidden lg:block absolute top-1/2 -left-48 w-[650px] h-[650px] bg-indigo-500/30 rounded-full blur-3xl animate-pulse-slower" />

      {/* Bottom left corner */}
      <div className="absolute -bottom-40 -left-40 w-[750px] h-[750px] bg-teal-500/5 md:bg-teal-500/12 lg:bg-teal-500/30 rounded-full blur-3xl animate-pulse-slower" />

      {/* Bottom right corner */}
      <div className="absolute -bottom-40 -right-40 w-[750px] h-[750px] bg-blue-500/5 md:bg-blue-500/12 lg:bg-blue-500/30 rounded-full blur-[120px] animate-pulse-slow" />

      {/* Bottom center - hidden on mobile and tablet */}
      <div className="hidden lg:block absolute bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/25 rounded-full blur-[110px] animate-pulse-slower" />

      {/* Scattered accent - upper middle left - hidden on mobile and tablet */}
      <div className="hidden lg:block absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-pink-500/25 rounded-full blur-[100px] animate-pulse-slow" />

      {/* Scattered accent - lower middle right - hidden on mobile and tablet */}
      <div className="hidden lg:block absolute bottom-1/3 right-1/4 w-[550px] h-[550px] bg-cyan-400/25 rounded-full blur-[110px] animate-pulse-slower" />


      {/* 3D Lines overlay - positioned at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[600px] opacity-45 mix-blend-screen pointer-events-none">
        <Image
          src="/3d-lines.svg"
          alt=""
          fill
          className="object-cover object-bottom"
          loading="eager"
        />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />

      {/* Starry effect */}
      <div className="absolute inset-0 bg-stars opacity-30" />

      {/* Radial gradient flares */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-linear-to-b from-cyan-500/10 via-transparent to-transparent" />

      {/* Subtle gradient overlay for depth - much lighter */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/20 to-black/60" />

      {/* Very subtle vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_60%,black_100%)] opacity-30" />
    </div>
  );
}
