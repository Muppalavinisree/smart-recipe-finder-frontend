import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/RecipePage.css";

const RecipePage = ({ favorites, onToggleFavorite }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await res.json();
        setMeal(data.meals ? data.meals[0] : null);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMeal();
  }, [id]);

  useEffect(() => {
    if (!meal) return;
    setIsFav(favorites.some((f) => String(f.idMeal) === String(meal.idMeal)));
  }, [favorites, meal]);

  if (!meal) return <p className="loading-text">Loading recipe...</p>;

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ing && ing.trim()) ingredients.push(`${ing} — ${measure || ""}`);
  }

  const youtubeId = meal.strYoutube ? meal.strYoutube.split("v=")[1]?.split("&")[0] : null;

  return (
    <div className="recipe-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="recipe-header">
        <h2>{meal.strMeal}</h2>
        <button className={`fav-btn ${isFav ? "active" : ""}`} onClick={() => onToggleFavorite(meal)}>
          {isFav ? "💖" : "🤍"}
        </button>
      </div>

      <img src={meal.strMealThumb} alt={meal.strMeal} className="recipe-image" />

      <div className="recipe-section">
        <h3>🧂 Ingredients</h3>
        <ul className="ingredient-list">
          {ingredients.map((it, i) => <li key={i}>{it}</li>)}
        </ul>
      </div>

      <div className="recipe-section">
        <h3>👩‍🍳 Instructions</h3>
        <p className="instructions">{meal.strInstructions}</p>
      </div>

      {youtubeId && (
        <div className="recipe-section">
          <h3>🎥 Watch</h3>
          <iframe width="100%" height="315" src={`https://www.youtube.com/embed/${youtubeId}`} title={meal.strMeal} allowFullScreen />
        </div>
      )}
    </div>
  );
};

export default RecipePage;
