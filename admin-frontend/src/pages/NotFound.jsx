// admin-frontend/src/pages/NotFound.jsx

import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-gray-600 mt-4 text-lg">This page doesn't exist.</p>
      <Link
        to="/"
        className="inline-block mt-6 px-6 py-2.5 bg-primary text-white font-semibold rounded-full
                   hover:bg-primary-dark transition-colors duration-200"
      >
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
