// src/pages/HomePage.jsx
import { useEffect, useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import { useAuth } from '../context/AuthContext';
import { GetRecipeData } from '../lib/recipe';

const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Vegetarian'];

export default function HomePage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const data = await GetRecipeData({ signal: controller.signal });
        setRecipes(data);
      } catch (err) {
        if (err.name !== 'AbortError');
      }
    })();

    return () => controller.abort();
  }, []);


  const filteredRecipes = recipes.filter(recipe => {
    const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-amber-900">Featured Recipes</h2>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search recipes..."
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="px-2.5 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRecipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}