// customer-frontend/src/pages/NotFound.jsx

import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-gray-600 mt-4 text-lg">The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="inline-block mt-6 px-6 py-2.5 bg-primary text-white font-semibold rounded-full
                   hover:bg-primary-dark transition-colors duration-200"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;