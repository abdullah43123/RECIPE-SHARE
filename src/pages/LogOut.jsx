// src/pages/Logout.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { SignOutUser } from '../lib/users';
export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    
    const timer = setTimeout(async () => {
        await SignOutUser();
        navigate('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col justify-center items-center">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
        <div className="flex justify-center text-amber-600 mb-4">
          <FaSignOutAlt size={48} />
        </div>
        <h2 className="text-2xl font-bold text-amber-900 mb-4">Logging Out</h2>
        <p className="text-gray-600">You are being signed out of your account...</p>
        <div className="mt-6">
          <div className="w-full bg-amber-100 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-600 h-2 rounded-full animate-progress"></div>
          </div>
        </div>
      </div>
    </div>
  );
}