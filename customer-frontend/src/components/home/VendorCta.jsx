// customer-frontend/src/components/home/VendorCta.jsx

import { ChefHat, ArrowRight } from "lucide-react";

const VendorCta = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-14">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#C2410C] to-[#9A3412] shadow-xl shadow-primary/25">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-black/10 blur-3xl" />

        <div className="relative flex flex-col sm:flex-row items-center sm:items-center justify-between gap-8 text-center sm:text-left px-6 sm:px-10 lg:px-14 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5">
            <div className="flex w-14 h-14 rounded-2xl bg-white/15 items-center justify-center shrink-0">
              <ChefHat size={26} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Are you a restaurant owner or chef?
              </h2>
              <p className="text-orange-50/90 text-sm sm:text-base mt-2 max-w-md">
                List your menu on LocalBites and start reaching hungry customers across the city. The simple
                setup takes just a few minutes.
              </p>
            </div>
          </div>

          <a
            href="https://localbites-vendor-zeta.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="group shrink-0 inline-flex items-center gap-2 justify-center bg-white text-primary font-semibold
              text-sm sm:text-base px-6 py-3.5 rounded-full hover:bg-orange-50 transition-colors shadow-lg shadow-black/10"
          >
            Register as a Vendor
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default VendorCta;