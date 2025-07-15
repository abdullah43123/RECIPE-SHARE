import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { UpdateFavorite } from '../lib/recipe';
import { useState } from 'react';

export default function RecipeCard({ recipe }) {
  const [isFavorite, setIsFavorite] = useState(recipe.isFavorite);

  async function handleToggleFavorite() {
    const next = !isFavorite;
    setIsFavorite(next);         

    try {
      await UpdateFavorite({
        IsFavorite: next,
        RecipeId: recipe.id,
      });
    } catch (err) {
      setIsFavorite(!next);       
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/recipe/${recipe.id}`}>
        <img
          src={recipe.image_Url}
          alt={recipe.title}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <Link to={`/recipe/${recipe.id}`} className="hover:underline">
            <h3 className="font-bold text-lg text-amber-900">{recipe.title}</h3>
          </Link>
          <button
            onClick={handleToggleFavorite}
            className="text-red-500 text-xl"
          >
            {isFavorite ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>
        <div className="mt-2 flex justify-between items-center">
          <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">
            {recipe.category}
          </span>
          <span className="text-gray-600 text-sm flex items-center">
            <FaHeart className="mr-1 text-red-500" />
          </span>
        </div>
      </div>
    </div>
  );
}