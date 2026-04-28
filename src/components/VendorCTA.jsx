const VendorCTA = () => {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-black text-white py-20 text-center">
      <h2 className="text-4xl font-bold">
        Are You a Food Vendor?
      </h2>

      <p className="mt-4 text-gray-300 max-w-xl mx-auto">
        Join thousands of local vendors growing their business with
        StreetBite.
      </p>

      <div className="mt-6 flex justify-center gap-4">
        <button className="bg-orange-500 px-6 py-3 rounded">
          Start Selling Today
        </button>
        <button className="border px-6 py-3 rounded">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default VendorCTA;
