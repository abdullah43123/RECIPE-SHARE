// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import { FaHome, FaUtensils } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-amber-50 flex flex-col justify-center items-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-amber-600 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-amber-900 mb-2">Recipe Not Found</h2>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
          >
            <FaHome /> Go Home
          </Link>
          <Link
            to="/my-recipes"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-amber-600 font-medium rounded-lg border border-amber-600 hover:bg-amber-50 transition-colors"
          >
            <FaUtensils /> My Recipes
          </Link>
        </div>
      </div>
    </div>
  );
}