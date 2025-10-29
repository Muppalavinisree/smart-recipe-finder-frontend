import React, { useEffect, useState } from "react";
import "../styles/mealmodal.css";

const MealModal = ({ mealId, onClose, onToggleFavorite, favorites = [] }) => {
  const [meal, setMeal] = useState(null);

  useEffect(() => {
    if (!mealId) return;
    (async () => {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
      const data = await res.json();
      setMeal(data.meals ? data.meals[0] : null);
    })();
  }, [mealId]);

  if (!meal) return null;

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ing && ing.trim()) ingredients.push(`${ing} — ${measure || ""}`);
  }

  const isFav = favorites.some((f) => String(f.idMeal) === String(meal.idMeal));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="back-btn" onClick={onClose}>⬅ Back</button>
        <div className="modal-header">
          <h2>{meal.strMeal}</h2>
          <button className={`heart-btn ${isFav ? "favorited" : ""}`} onClick={() => onToggleFavorite(meal)}>{isFav ? "💖" : "🤍"}</button>
        </div>
        <img src={meal.strMealThumb} alt={meal.strMeal} className="meal-image" />
        <h3>🧂 Ingredients</h3>
        <ul className="ingredients-list">{ingredients.map((it, i) => <li key={i}>{it}</li>)}</ul>
        <h3>👨‍🍳 Instructions</h3>
        <ol className="instructions">{(meal.strInstructions || "").split(". ").map((s,i)=>s? <li key={i}>{s}</li>:null)}</ol>
      </div>
    </div>
  );
};

export default MealModal;
