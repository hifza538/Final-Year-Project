import React from "react";

const VendorCTA = () => {
  return (
    <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 py-24 text-white">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h3 className="text-4xl font-bold">Are You a Food Vendor?</h3>
        <p className="mt-4 text-lg text-slate-300">
          Join thousands of local vendors growing their business with LocalBites.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600">
            Start Selling Today
          </button>
          <button className="rounded-xl border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default VendorCTA;