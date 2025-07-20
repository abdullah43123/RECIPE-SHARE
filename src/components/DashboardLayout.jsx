import { Link, Outlet } from 'react-router-dom';
import { FaHome, FaUtensils, FaHeart, FaSearch, FaPlus, FaUser } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { GetAllUser } from '../lib/users';
import { useEffect, useState } from 'react';
import { TbLogin } from "react-icons/tb";
import { GetAllRecipes } from '../lib/recipe';
import { useAuth } from '../context/AuthContext';
export default function DashboardLayout() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [recipies, setRecipies] = useState([]);
  // const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    async function getData() {
      let data = await GetAllUser();
      let recipeData = await GetAllRecipes();
      setRecipies(recipeData)
      setUsers(data);
    }
    getData();
  }, [])


  return (
    <div className="min-h-screen bg-amber-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-amber-800 text-white p-4 hidden md:block">
        <h1 className="text-2xl font-bold mb-8">RecipeShare</h1>
        <nav className="space-y-2">
          <Link to="/" className="flex items-center p-2 rounded hover:bg-amber-700">
            <FaHome className="mr-3" /> Home
          </Link>
          <Link to="/my-recipes" className="flex items-center p-2 rounded hover:bg-amber-700">
            <FaUtensils className="mr-3" /> My Recipes
          </Link>
          <Link to="/favorites" className="flex items-center p-2 rounded hover:bg-amber-700">
            <FaHeart className="mr-3" /> Favorites
          </Link>
          {user ? <Link to="/create" className="flex items-center p-2 rounded hover:bg-amber-700">
            <FaPlus className="mr-3" /> Add Recipe
          </Link> : <Link to="/login" className="flex items-center p-2 rounded hover:bg-amber-700">
            <FaPlus className="mr-3" /> Add Recipe
          </Link>}
          <Link to="/account" className="flex items-center p-2 rounded hover:bg-amber-700">
            <FaUser className="mr-3" /> Account
          </Link>
          {user ? <Link to="/logout" className="flex items-center p-2 rounded hover:bg-amber-700">
            <FiLogOut className="mr-3" /> Logout
          </Link> : <Link to="/login" className="flex items-center p-2 rounded hover:bg-amber-700">
            <TbLogin className="mr-3" /> Login
          </Link>}
        </nav>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-amber-800 text-white p-2 flex justify-around md:hidden">
        <Link to="/" className="p-2"><FaHome size={20} /></Link>
        <Link to="/my-recipes" className="p-2"><FaUtensils size={20} /></Link>
        {user ? <Link to="/create" className="p-2"><FaPlus size={20} /></Link> : <Link to="/login" className="p-2"><FaPlus size={20} /></Link>}
        <Link to="/account" className="p-2"><FaUser size={20} /></Link>
        {user ? <Link to="/logout" className="p-2"><FiLogOut size={20} /></Link> : <Link to="/login" className="p-2"><TbLogin size={20} /></Link>}
      </div>

      {/* Main Content */}
      <div className="md:ml-64 pb-16 md:pb-0">
        {/* Dashboard Stats */}
        <div className="bg-white p-4 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-amber-100 p-4 rounded-lg border-l-4 border-amber-500">
              <h3 className="font-semibold text-amber-800">Total Recipes</h3>
              {/* <p className="text-2xl font-bold">1.2k</p> */}
              <p className="text-2xl font-bold">{recipies.length}</p>
              <p className="text-sm text-green-600">↑ 12% since last month</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <h3 className="font-semibold text-green-800">Active Users</h3>
              {/* <p className="text-2xl font-bold">1.6k</p> */}
              <p className="text-2xl font-bold">{users.length}</p>
              <p className="text-sm text-green-600">↑ 15% since last month</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
              <h3 className="font-semibold text-red-800">Completion Rate</h3>
              <p className="text-2xl font-bold">75.5%</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h3 className="font-semibold text-blue-800">Monthly Traffic</h3>
              <p className="text-2xl font-bold">15k</p>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}