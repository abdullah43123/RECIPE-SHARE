import { FaClock, FaHeart, FaSearch, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useMemo } from 'react';
import { DeleteRecipe, FilterData } from '../lib/recipe';
import { Link } from 'react-router-dom';
export default function RecipeHistory({ onBack }) {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const getData = async () => {
      const data = await FilterData({ dataSet: "userId", Id: user.id });
      setRecipes(data);
    };
    getData();
  }, [user]);

  const totalLikes = useMemo(
    () => recipes.reduce((sum, r) => sum + (r.likes ?? 0), 0),
    [recipes]
  );

  async function handleDelete(recipeId) {
    if (!window.confirm('Delete this recipe? This cannot be undone.')) return;

    try {
      const { error } = await DeleteRecipe({ Id: recipeId });
      if (error) throw error;


      setRecipes(prev => prev.filter(r => r.id !== recipeId));
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!"
      });
    }
  }

  const filteredRecipes = recipes.filter(recipe => {
    const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-amber-50 min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="mr-4 p-2 rounded-full hover:bg-amber-100 text-amber-700"
          >
            <FaArrowLeft size={20} />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-amber-900">Your Recipe History</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-amber-500">
            <h3 className="text-sm text-gray-500">Total Recipes</h3>
            {/* <p className="text-2xl font-bold text-amber-800">12</p> */}
            <p className="text-2xl font-bold text-amber-800">{recipes.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
            <h3 className="text-sm text-gray-500">Total Likes</h3>
            {/* <p className="text-2xl font-bold text-green-800">156</p> */}
            <p className="text-2xl font-bold text-green-800">{totalLikes}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
            <h3 className="text-sm text-gray-500">Last Added</h3>
            {/* <p className="text-2xl font-bold text-blue-800">{recipes[recipes.length -1].created_at.slice(0,10)}</p> */}
            <p className="text-2xl font-bold text-blue-800">
              {recipes.length > 0
                ? new Date(recipes[recipes.length - 1].created_at).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })
                : 'No recipes yet'}
            </p>
            {/* <p className="text-2xl font-bold text-blue-800">3 days ago</p> */}
          </div>
        </div>

        {/* Search/Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-grow">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search your recipes..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500">
              <option>All</option>
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
              <option>Dessert</option>
              <option>Vegetarian</option>

            </select>
          </div>
        </div>

        {/* Recipes List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map(recipe => (
            <div key={recipe.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img
                  src={recipe.image_Url}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <h3 className="text-white font-semibold text-lg">{recipe.title}</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500 flex items-center">
                    <FaClock className="mr-1" /> {recipe.date}
                  </span>
                  <span className="text-sm text-red-500 flex items-center">
                    <FaHeart className="mr-1" /> {recipe.likes}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Link to={`/account/recipe_history/${recipe.id}`} className="flex-1 py-2 ps-16 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200">
                    View
                  </Link>
                  <button onClick={() => handleDelete(recipe.id)} className="flex-1 py-2 bg-white border border-red-600 text-amber-700 rounded-lg hover:bg-red-500 hover:text-white">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}