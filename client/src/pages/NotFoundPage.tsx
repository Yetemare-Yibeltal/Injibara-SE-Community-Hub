import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white px-4">
      <h1 className="text-6xl font-bold text-primary-500 mb-4">404</h1>
      <p className="text-gray-400 mb-6">This page doesn't exist.</p>
      <Link
        to="/"
        className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}