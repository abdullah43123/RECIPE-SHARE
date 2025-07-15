// src/pages/RecipeDetail.jsx
import { useParams } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaClock, FaUser } from 'react-icons/fa';
import { FilterData } from '../lib/recipe';
import { FilterUser } from '../lib/users';
import { useState, useEffect } from 'react';
export default function RecipeDetail() {
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [recipe, setRecipe] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await FilterData({ dataSet: "id", Id: id });
      setRecipe(data[0]);
    };
    getData();
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-amber-900 mb-2">{recipe.title}</h2>
        <div className="flex items-center gap-4 text-gray-600">
          <span className="flex items-center">
            <FaClock className="mr-1" /> {recipe.preparationTime}
          </span>
          <span className="flex items-center">
            <FaUser className="mr-1" /> {recipe.serving} servings
          </span>
          <span className="inline-block bg-amber-100 text-amber-800 text-sm px-2 py-1 rounded">
            {recipe.category}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <img
            src={recipe.image_Url}
            alt={recipe.title}
            className="w-full rounded-lg shadow-md"
          />
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Ingredients</h3>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="text-red-500 text-xl"
              >
                {isFavorite ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>
            <div className="whitespace-pre-line">{recipe.ingredients}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <h3 className="font-bold text-lg mb-3">Preparation Steps</h3>
        <div className="whitespace-pre-line">{recipe.steps}</div>
      </div>


    </div>
  );
}