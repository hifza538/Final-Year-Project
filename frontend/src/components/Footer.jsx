const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 px-10 py-10">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-bold">StreetBite</h3>
          <p className="text-sm mt-3">
            Connecting communities through food.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">
            For Customers
          </h4>
          <p>Find Restaurants</p>
          <p>Help Center</p>
          <p>Sign Up</p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">
            For Vendors
          </h4>
          <p>Partner with Us</p>
          <p>Vendor Dashboard</p>
          <p>Support</p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">
            Company
          </h4>
          <p>About</p>
          <p>Contact</p>
          <p>Privacy Policy</p>
        </div>
      </div>

      <p className="text-center text-sm mt-10">
        © 2024 StreetBite. Made with ❤️
      </p>
    </footer>
  );
};

export default Footer;
