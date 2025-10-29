import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/QuickMealsModal.css";

const quickMealsData = [
  {
    idMeal: "53082",
    strMeal: "Strawberries Romanoff",
    strMealThumb: "https://www.themealdb.com/images/media/meals/oe8rg51699014028.jpg",
    time: "⏱️ ~10 mins"
  },
 {
  idMeal: "53085",
  strMeal: "15-minute Chicken & Halloumi Burgers",
  strMealThumb: "https://www.themealdb.com/images/media/meals/vdwloy1713225718.jpg",
  time: "⏱️ 15 mins"
},
  {
    idMeal: "53091",
    strMeal: "Falafel Pita Sandwich with Tahini Sauce",
    strMealThumb: "https://www.themealdb.com/images/media/meals/ae6clc1760524712.jpg",
    time: "⏱️ ~8-10 mins"
  },
 
 
  {
    idMeal: "52965",
    strMeal: "Breakfast Potatoes",
    strMealThumb: "https://www.themealdb.com/images/media/meals/1550441882.jpg",
    time: "⏱️ ~10 mins"
  },
 
   {
    idMeal: "53078",
    strMeal: "Beetroot Soup (Borscht)",
    strMealThumb:
      "https://www.themealdb.com/images/media/meals/zadvgb1699012544.jpg",
    time: "⏱️ 10 mins",
  },
 {
  idMeal: "52982",
  strMeal: "Spaghetti alla Carbonara",
  strMealThumb: "https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg",
  time: "⏱️ ~10 mins"
}

 
];


const QuickMealsModal = () => {
  const navigate = useNavigate();

  const handleCardClick = (mealId) => {
    navigate(`/recipe/${mealId}`);
  };

  return (
    <div className="quick-wrapper">
      <div className="quick-inner">
        <header className="quick-header">
          <button className="back-btn" onClick={() => navigate("/")}>
            ← Back
          </button>
          <h2>🍳 Quick Meals — Ready in 10–15 mins</h2>
          <p>Perfect for busy days — fast, tasty, and satisfying!</p>
        </header>

        <div className="quick-grid">
          {quickMealsData.map((meal) => (
            <div
              key={meal.idMeal}
              className="quick-card"
              onClick={() => handleCardClick(meal.idMeal)}
            >
              <div className="image-container">
                <img src={meal.strMealThumb} alt={meal.strMeal} />
              </div>
              <div className="info">
                <h3>{meal.strMeal}</h3>
                <span className="time">{meal.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickMealsModal;
