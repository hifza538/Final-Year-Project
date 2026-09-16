// customer-frontend/src/components/home/Hero.jsx

import { Search } from "lucide-react";

// Hero section for the Home page — headline, functional search bar, and a
// real (not fabricated) restaurant count once loaded. The illustration on
// the right extends the same SVG language used in AuthLayout (plate, steam,
// delivery box) rather than a stock photo, so it stays copyright-safe.
const Hero = ({ searchTerm, onSearchChange, restaurantCount, isLoading }) => {
  return (
    <section className="relative overflow-hidden bg-stone-50 border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: headline + search */}
          <div className="animate-hero-in">
            <h1 className="text-4xl sm:text-5xl font-black text-secondary leading-[1.05] tracking-tight">
              Your neighborhood's
              <br />
              best food, delivered.
            </h1>
            <p className="text-gray-500 text-lg mt-4 max-w-md">
              Order from local restaurants across Gujranwala. Real food, real fast.
            </p>

            <div className="relative mt-8 max-w-md">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search restaurants by name..."
                className="w-full pl-11 pr-4 py-3.5 rounded-full border border-stone-200 bg-white
                           shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/30
                           focus:border-primary transition-all duration-200"
              />
            </div>

            <div className="mt-5 h-5">
              {!isLoading && (
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-secondary">{restaurantCount}</span>{" "}
                  restaurant{restaurantCount !== 1 ? "s" : ""} ready to deliver to you
                </p>
              )}
            </div>
          </div>

          {/* Right: illustration */}
          <div className="relative hidden lg:block animate-hero-in-delayed">
            <svg viewBox="0 0 480 420" className="w-full max-w-md mx-auto" fill="none">
              <circle cx="270" cy="210" r="185" fill="#FFF1E6" />

              <circle cx="220" cy="230" r="135" fill="#FDFDFC" stroke="#EFE9E2" strokeWidth="2" />
              <circle cx="220" cy="230" r="112" fill="#292524" fillOpacity="0.035" />

              <ellipse cx="200" cy="245" rx="72" ry="58" fill="#FBEFDD" />
              <g fill="#F3DFC0">
                <circle cx="175" cy="230" r="3" />
                <circle cx="190" cy="255" r="2.5" />
                <circle cx="215" cy="220" r="3" />
                <circle cx="160" cy="255" r="2.5" />
                <circle cx="205" cy="270" r="2.5" />
              </g>

              <rect x="235" y="195" width="34" height="24" rx="6" fill="#C2410C" transform="rotate(12 252 207)" />
              <rect x="250" y="225" width="30" height="22" rx="6" fill="#E8590C" transform="rotate(-8 265 236)" />
              <line x1="242" y1="200" x2="262" y2="212" stroke="#8a2e08" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
              <line x1="256" y1="230" x2="274" y2="240" stroke="#8a2e08" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

              <g fill="#8BA888">
                <ellipse cx="175" cy="290" rx="10" ry="6" transform="rotate(-20 175 290)" />
                <ellipse cx="192" cy="298" rx="9" ry="5" transform="rotate(10 192 298)" />
                <ellipse cx="255" cy="270" rx="8" ry="5" transform="rotate(30 255 270)" />
              </g>

              <circle cx="150" cy="215" r="7" fill="#E8590C" />
              <circle cx="148" cy="212" r="2" fill="#FBEFDD" opacity="0.6" />
              <circle cx="235" cy="285" r="6" fill="#C2410C" />

              <g fill="#FBEFDD">
                <circle cx="248" cy="203" r="1.5" />
                <circle cx="256" cy="209" r="1.5" />
                <circle cx="262" cy="233" r="1.5" />
              </g>

              <path d="M195 130 Q188 108 195 86" stroke="#E8590C" strokeWidth="4" strokeLinecap="round" opacity="0.45" />
              <path d="M220 124 Q213 100 220 74" stroke="#E8590C" strokeWidth="4" strokeLinecap="round" opacity="0.65" />
              <path d="M245 130 Q238 108 245 86" stroke="#E8590C" strokeWidth="4" strokeLinecap="round" opacity="0.45" />

              <g transform="translate(330, 300)">
                <circle cx="18" cy="46" r="16" fill="none" stroke="#292524" strokeWidth="4" />
                <circle cx="70" cy="46" r="16" fill="none" stroke="#292524" strokeWidth="4" />
                <path d="M18 46 L40 20 L58 20 M40 20 L48 46 M58 20 L70 46 M48 46 L18 46"
                      stroke="#292524" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <rect x="52" y="10" width="16" height="12" rx="3" fill="#E8590C" />
                <circle cx="58" cy="20" r="3" fill="#292524" />
              </g>

              <g transform="translate(30, 55)">
                <rect x="0" y="0" width="148" height="54" rx="14" fill="white" />
                <rect x="0" y="0" width="148" height="54" rx="14" fill="none" stroke="#EFE9E2" strokeWidth="1.5" />
                <circle cx="30" cy="27" r="14" fill="#FFF1E6" />
                <path d="M24 27h12M30 21v12" stroke="#E8590C" strokeWidth="2.5" strokeLinecap="round" />
                <text x="54" y="23" fontSize="11.5" fontWeight="700" fill="#292524">Fast delivery</text>
                <text x="54" y="38" fontSize="10" fill="#78716C">Straight to your door</text>
              </g>

              <g transform="translate(300, 25)">
                <rect x="0" y="0" width="150" height="54" rx="14" fill="white" />
                <rect x="0" y="0" width="150" height="54" rx="14" fill="none" stroke="#EFE9E2" strokeWidth="1.5" />
                <circle cx="30" cy="27" r="14" fill="#FFF1E6" />
                <path d="M23 32l7-11 7 11M21 32h18" stroke="#E8590C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <text x="54" y="23" fontSize="11.5" fontWeight="700" fill="#292524">All local</text>
                <text x="54" y="38" fontSize="10" fill="#78716C">Gujranwala's own kitchens</text>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;