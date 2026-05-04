import React from "react";
import { cuisines } from "../../data/HomeData";

const CuisinesSection = () => {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h3 className="text-3xl font-bold text-slate-900">Popular Cuisines</h3>
          <p className="mt-2 text-slate-500">
            Browse your favorite food categories
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {cuisines.map((cuisine, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="h-36 overflow-hidden">
                <img
                  src={cuisine.image}
                  alt={cuisine.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                />
              </div>
              <div className="p-4 text-center">
                <h4 className="font-semibold text-orange-500">{cuisine.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CuisinesSection;