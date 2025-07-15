// src/pages/MyRecipes.jsx
import { useState, useEffect } from 'react';
import RecipeCard from '../components/RecipeCard';
import { useAuth } from '../context/AuthContext';
import { FilterData, GetRecipeData } from '../lib/recipe';

// export default function MyRecipes() {
export default function MyRecipes({ favorites = false }) {
  const [activeTab, setActiveTab] = useState(favorites ? 'favorites' : 'my-recipes');
  const [myRecipes, setMyRecipes] = useState([])
  const [allRecipes, setAllRecipes] = useState([])
  const { user } = useAuth();

  useEffect(() => {
    const getData = async () => {
      const data = await FilterData({ dataSet: "userId", Id: user.id });   // <-- should return ONE recipe
      setMyRecipes(data);

    };
    getData();
  }, [user]);

  useEffect(() => {
    const getData = async () => {
      const data = await GetRecipeData();
      setAllRecipes(data);

    };
    getData();
  }, []);



  const favoriteRecipes = allRecipes.filter(recipe => recipe.isFavorite);

  return (
    <div>
      <h2 className="text-2xl font-bold text-amber-900 mb-6">
        {favorites ? 'My Favorite Recipes' : 'My Recipes'}
      </h2>

      {!favorites && (
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'my-recipes' ? 'text-amber-700 border-b-2 border-amber-700' : 'text-gray-600'}`}
            onClick={() => setActiveTab('my-recipes')}
          >
            My Recipes
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'favorites' ? 'text-amber-700 border-b-2 border-amber-700' : 'text-gray-600'}`}
            onClick={() => setActiveTab('favorites')}
          >
            Favorites
          </button>
        </div>
      )}

      {/* <button onClick={handleFunction}>Hello</button> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {(activeTab === 'my-recipes' ? myRecipes : favoriteRecipes).map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}