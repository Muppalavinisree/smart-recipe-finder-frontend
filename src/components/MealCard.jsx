import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/mealcard.css";

const MealCard = ({ meal, favorites = [], onToggleFavorite }) => {
  const navigate = useNavigate();
  const isFav = favorites.some((f) => String(f.idMeal) === String(meal.idMeal));

  return (
    <div className="meal-card" onClick={() => navigate(`/recipe/${meal.idMeal}`)}>
      <img src={meal.strMealThumb} alt={meal.strMeal} />
      <div className="meal-card-info">
        <h4>{meal.strMeal}</h4>
        <div className="card-actions">
          <span className="time-chip">{meal.readyInMinutes}m</span>
          <button
            className={`fav-icon ${isFav ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(meal);
            }}
            title={isFav ? "Remove from favorites" : "Add to favorites"}
          >
            {isFav ? "❤️" : "🩶"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealCard;
