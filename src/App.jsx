// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import HomePage from './pages/HomePage';
import RecipeDetail from './pages/RecipeDetail';
import CreateEditRecipe from './pages/CreateEditRecipe';
import MyRecipes from './pages/MyRecipes';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Logout from './pages/LogOut';
import { AuthProvider } from './context/AuthContext';
import Account from './pages/Account';
import RecipeHistory from './pages/RecipeHistory';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<HomePage />} />
            <Route path="recipe/:id" element={<RecipeDetail />} />
            <Route path="account/recipe_history/:id" element={<RecipeDetail />} />
            <Route path="create" element={<CreateEditRecipe />} />
            <Route path="edit/:id " element={<CreateEditRecipe />} />
            <Route path="my-recipes" element={<MyRecipes />} />
            <Route path="favorites" element={<MyRecipes favorites />} />
            <Route path="account" element={<Account />} />
            <Route path="/account/recipe_history" element={<RecipeHistory />} />
            <Route path="/account/my-recipes" element={<MyRecipes />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;