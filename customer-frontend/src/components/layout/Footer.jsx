// customer-frontend/src/components/layout/Footer.jsx

import { Link } from "react-router-dom";
import {
  FacebookIcon,
  InstagramIcon,
} from "../common/SocialIcons";
import Logo from "../common/Logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="mb-3">
              <Logo size="sm" variant="light" />
            </div>
            <p className="text-sm text-gray-400">
              Delicious food from your favorite local restaurants, delivered
              straight to your door.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="https://www.facebook.com/profile.php?id=61594408156951&mibextid=ZbWKwL"
                aria-label="Facebook"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-primary transition-colors duration-200"
              >
                <FacebookIcon size={18} />
              </a>
              <a
                href="https://www.instagram.com/localbites29?stkn=OHhqanlpaHA2cDE0v"
                aria-label="Instagram"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-primary transition-colors duration-200"
              >
                <InstagramIcon size={18} />
              </a>
            </div>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Partner links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Partner With Us</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://localbites-vendor-zeta.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Become a Vendor
                </a>
              </li>
              <li>
                <a
                  href="https://locatbites-rider.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Become a Rider
                </a>
              </li>
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
          © {currentYear} LocalBites. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;