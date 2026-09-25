// customer-frontend/src/pages/AboutUs.jsx

import { Heart, ShieldCheck, Clock, Users } from "lucide-react";

const VALUES = [
  {
    icon: Heart,
    title: "Local first",
    text: "We only list restaurants from within the city, so every order supports a kitchen in your own neighbourhood.",
  },
  {
    icon: ShieldCheck,
    title: "Verified vendors and riders",
    text: "Every restaurant and delivery rider is reviewed before they can go live, so you know who's cooking and who's delivering.",
  },
  {
    icon: Clock,
    title: "On-time, or we notice",
    text: "We track how quickly restaurants accept and prepare orders, so persistent delays get addressed, not ignored.",
  },
  {
    icon: Users,
    title: "Built for everyone",
    text: "Customers, restaurant owners, and riders all get tools designed around how they actually use the app.",
  },
];

const AboutUs = () => (
  <div className="bg-white">
    {/* Header */}
    <section className="bg-primary">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 text-center">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Food from your own city, delivered.
        </h1>
        <p className="text-orange-50 mt-3 max-w-xl mx-auto">
          LocalBites connects local restaurants with the customers around them, one order at a
          time.
        </p>
      </div>
    </section>

    {/* Story */}
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14 text-sm text-gray-600 leading-relaxed space-y-4">
      <h2 className="text-xl font-bold text-secondary mb-2">Our Story</h2>
      <p>
        LocalBites started with a simple observation: the best food in the city rarely comes from
        a big chain - it comes from small, local kitchens that don't always have the reach to be
        found online. We built LocalBites to close that gap, giving local restaurants a proper
        storefront and giving customers an easy way to discover them.
      </p>
      <p>
        Every restaurant on LocalBites is reviewed before it goes live, every delivery rider is
        verified, and every order is tracked from the moment it's placed to the moment it arrives
        at your door.
      </p>
    </section>

    {/* Values */}
    <section className="bg-stone-50 border-y border-stone-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <h2 className="text-xl font-bold text-secondary mb-8 text-center">What we care about</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="w-11 h-11 rounded-xl bg-primary-light flex items-center justify-center mb-4">
                <Icon size={20} className="text-primary" />
              </div>
              <h3 className="font-semibold text-secondary text-sm mb-1.5">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
    
  </div>
);

export default AboutUs;