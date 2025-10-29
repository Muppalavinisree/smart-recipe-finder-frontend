import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import RecipePage from "./pages/RecipePage";
import QuickMealsModal from "./components/QuickMealsModal";
import Chatbot from "./components/chatbot";
import "./styles/App.css";

function App() {
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites") || "[]")
  );
  const [showFavDrawer, setShowFavDrawer] = useState(false); // ⬅️ add this
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleToggleFavorite = (meal) => {
    setFavorites((prev) => {
      const exists = prev.find((f) => String(f.idMeal) === String(meal.idMeal));
      if (exists) return prev.filter((f) => String(f.idMeal) !== String(meal.idMeal));
      return [...prev, meal];
    });
  };

  const handleRemoveFavorite = (id) => {
    setFavorites((prev) => prev.filter((f) => String(f.idMeal) !== String(id)));
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onRemoveFavorite={handleRemoveFavorite}
              showFavDrawer={showFavDrawer}
              setShowFavDrawer={setShowFavDrawer} // ⬅️ pass control to Home
            />
          }
        />
        <Route
          path="/recipe/:id"
          element={
            <RecipePage
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          }
        />
        <Route
          path="/quick-meals"
          element={
            <QuickMealsModal
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          }
        />
      </Routes>

      {/* ✅ Only show chatbot when on home page AND favorites drawer is closed */}
      {location.pathname === "/" && !showFavDrawer && <Chatbot />}
    </>
  );
}

export default App;
