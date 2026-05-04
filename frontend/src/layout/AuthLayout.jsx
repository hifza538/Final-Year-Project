import React from "react";
import { UtensilsCrossed, CheckCircle2 } from "lucide-react";

const AuthLayout = ({ children, title, subtitle, benefits }) => {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Background gradient */}
      <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.25),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.18),transparent_30%),linear-gradient(135deg,#0f172a,#111827,#1e1b4b)]">
        {/* Decorative blur circles */}
        <div className="absolute left-[-80px] top-[-80px] h-72 w-72 rounded-full bg-orange-500/20 blur-3xl"></div>
        <div className="absolute bottom-[-100px] right-[-50px] h-80 w-80 rounded-full bg-pink-500/20 blur-3xl"></div>

        <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
          {/* Left branding section */}
          <div className="hidden lg:block">
            <div className="max-w-xl text-white">
              {/* Brand */}
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-3 text-white shadow-lg shadow-orange-500/30">
                  <UtensilsCrossed size={24} />
                </div>
                <h1 className="text-3xl font-black tracking-tight">
                  Local<span className="text-orange-400">Bites</span>
                </h1>
              </div>

              {/* Badge */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-orange-400"></span>
                {subtitle}
              </div>

              {/* Title */}
              <h2 className="text-5xl font-black leading-tight">
                {title}
              </h2>

              {/* Benefits list */}
              {benefits && (
                <div className="mt-10 space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="text-orange-400" size={22} />
                      <span className="text-base text-slate-200">{benefit}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="mt-10 grid grid-cols-3 gap-4">
                <StatCard title="500+" subtitle="Vendors" />
                <StatCard title="12k+" subtitle="Orders" />
                <StatCard title="4.9★" subtitle="Top Rated" />
              </div>
            </div>
          </div>

          {/* Right content (form card) */}
          <div className="mx-auto w-full max-w-xl">
            {/* Mobile logo */}
            <div className="mb-6 flex items-center justify-center gap-3 lg:hidden">
              <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-3 text-white">
                <UtensilsCrossed size={22} />
              </div>
              <h1 className="text-2xl font-black text-white">
                Local<span className="text-orange-400">Bites</span>
              </h1>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Small stat card component
const StatCard = ({ title, subtitle }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <h4 className="text-2xl font-bold text-white">{title}</h4>
      <p className="text-sm text-slate-300">{subtitle}</p>
    </div>
  );
};

export default AuthLayout;