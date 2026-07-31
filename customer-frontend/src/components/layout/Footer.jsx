// customer-frontend/src/components/layout/Footer.jsx

import { Link } from "react-router-dom";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
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
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  className="hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="hover:text-primary transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/help"
                  className="hover:text-primary transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-3">Follow Us</h4>
            <div className="flex gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="p-2 bg-gray-800 rounded-full hover:bg-primary transition-colors duration-200"
              >
                <FacebookIcon size={18} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="p-2 bg-gray-800 rounded-full hover:bg-primary transition-colors duration-200"
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="p-2 bg-gray-800 rounded-full hover:bg-primary transition-colors duration-200"
              >
                <TwitterIcon size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
          © {currentYear} LocalBites for academic purposes only.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
