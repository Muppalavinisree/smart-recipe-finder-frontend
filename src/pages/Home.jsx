import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ for page navigation
import MealCard from "../components/MealCard";
import FavoritesBar from "../components/FavoritesBar";
import "../styles/home.css";
import Chatbot from "../components/chatbot";


const Home = ({ favorites, onToggleFavorite, onRemoveFavorite }) => {
  const [meals, setMeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");
  const [diet, setDiet] = useState("all");
  const [mealType, setMealType] = useState("all");
  const [showFavDrawer, setShowFavDrawer] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch categories dynamically (with real images)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  
const enrichMeals = (raw = []) => {
  const quickKeywords = [
    "salad", "sandwich", "toast", "omelet", "omelette", "egg", "wrap",
    "noodle", "pasta", "stir", "ramen", "burger", "roll", "burrito", "taco",
    "shawarma", "fajita", "quesadilla", "pie", "bowl", "snack", "fool", "bars",
    "beavertails", "breakfast potatoes", "fruit and cream cheese breakfast pastries",
  ];

  const nonVegKeywords = [
    "chicken", "beef", "pork", "lamb", "fish", "shrimp", "prawn", "crab",
    "tuna", "salmon", "seafood", "bacon", "turkey", "mutton", "steak",
    "meat", "oxtail", "prosciutto", "anchovy", "jerk chicken", "kung pao chicken",
    "general tsos", "kentucky fried chicken", "chicken handi", "lamb biryani",
    "tunisian lamb soup", "montreal smoked meat"
  ];

  const breakfast = [
    "english breakfast", "french omelette", "smoked haddock kedgeree",
    "home-made mandazi", "salmon eggs eggs benedict",
    "fruit and cream cheese breakfast pastries", "breakfast potatoes",
    "budino di ricotta", "bread and butter pudding"
  ];

  const lunch = [
    "biryani", "rice", "salad", "sandwich", "wrap",
    "spaghetti alla carbonara", "spaghetti bolognese", "spicy arrabiata penne",
    "shrimp chow fun", "tuna and egg briks", "chickpea fajitas", "vegetarian chilli",
    "matar paneer", "salmon avocado salad", "three fish pie",
    "roast fennel and aubergine paella", "escovitch fish", "recheado masala fish"
  ];

  const dinner = [
    "tandoori chicken", "lamb rogan josh", "chicken handi", "lamb biryani",
    "nutty chicken curry", "fish stew", "curry", "roast", "stew",
    "baingan bharta", "dal fry", "vegetarian casserole", "potato gratin"
  ];

  const snacks = [
    "cookie", "bars", "pastry", "souffle", "pakora", "cutlet", "roll",
    "fries", "chips", "dip", "nugget", "mandazi", "beavertails", "buns",
    "snack", "toast", "sandwich"
  ];

  const desserts = [
    "cake", "tart", "pudding", "crumble", "pie", "dessert", "sweet", "fudge",
    "caramel", "cream", "mousse", "souffle", "brulee", "pavlova", "shortcake",
    "brownie", "cookie", "butter tarts", "nanaimo bars", "treacle tart",
    "blackberry fool", "fruit fool"
  ];

  let enriched = (raw || []).map((m) => {
    const name = (m.strMeal || "").toLowerCase();
    const category = (m.strCategory || "").toLowerCase();

    const isQuick = quickKeywords.some((kw) => name.includes(kw));
    const readyInMinutes = isQuick ? 8 : Math.floor(Math.random() * 40) + 15;
    const isNonVeg = nonVegKeywords.some((kw) => name.includes(kw));

    let type = "other";
    if (breakfast.some((kw) => name.includes(kw))) type = "breakfast";
    else if (lunch.some((kw) => name.includes(kw))) type = "lunch";
    else if (dinner.some((kw) => name.includes(kw))) type = "dinner";
    else if (
      desserts.some((kw) => name.includes(kw)) ||
      category.includes("dessert")
    ) type = "dessert";
    else if (
      snacks.some((kw) => name.includes(kw)) ||
      category.includes("snack") ||
      category.includes("appetizer") ||
      category.includes("starter")
    ) type = "snacks";

    return {
      ...m,
      readyInMinutes,
      isQuick: readyInMinutes <= 10,
      isNonVeg,
      isVeg: !isNonVeg,
      mealType: type,
    };
  });

  // Fallback for missing dessert
  const dessertCount = enriched.filter((m) => m.mealType === "dessert").length;
  if (dessertCount < 4 && enriched.length > 0) {
    const sweetLike = enriched
      .filter((m) => /(cake|tart|cookie|sweet|pudding|dessert)/i.test(m.strMeal))
      .slice(0, 4);
    sweetLike.forEach((d) => (d.mealType = "dessert"));
  }

  return enriched;
};




  // fetch meals
  const fetchMeals = async (search = "") => {
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(search)}`
      );
      const data = await res.json();
      const enriched = enrichMeals(data.meals || []);
      setMeals(enriched);
    } catch (err) {
      console.error(err);
      setMeals([]);
    }
  };

  useEffect(() => {
    fetchMeals(); // initial load
  }, []);

  // search handler
  const handleSearchChange = (e) => {
    const v = e.target.value;
    setQuery(v);
    fetchMeals(v);
  };

  // filters
  const filtered = meals.filter((m) => {
    if (!m) return false;
    if (diet === "veg" && !m.isVeg) return false;
    if (diet === "nonveg" && !m.isNonVeg) return false;
    if (mealType !== "all" && m.mealType !== mealType) return false;
    if (query && query.trim()) {
      const q = query.toLowerCase();
      return (
        m.strMeal.toLowerCase().includes(q) ||
        (m.strIngredient1 && m.strIngredient1.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="app-shell">
      {/* Header */}
      <header className="topbar">
        <div className="brand">
          <h1>Taylor's Kitchen Guide <span className="sp">🧑‍🍳</span></h1>
          <p className="tag">Find recipes for every mood — fast or feast</p>
        </div>

        <div className="top-actions">
          <button className="favorites-pill" onClick={() => setShowFavDrawer(true)}>
            ❤️ Favorites ({favorites.length})
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="home-container">
        <section className="controls">
          {/* Diet Filter */}
          <div className="filters">
            <button className={`chip ${diet === "all" ? "active" : ""}`} onClick={() => setDiet("all")}>All</button>
            <button className={`chip ${diet === "veg" ? "active" : ""}`} onClick={() => setDiet("veg")}>Veg</button>
            <button className={`chip ${diet === "nonveg" ? "active" : ""}`} onClick={() => setDiet("nonveg")}>Non-Veg</button>
          </div>

          {/* Meal Type Filter */}
          <div className="subfilters">
            <button className={`chip small ${mealType === "all" ? "active" : ""}`} onClick={() => setMealType("all")}>Any</button>
            <button className={`chip small ${mealType === "breakfast" ? "active" : ""}`} onClick={() => setMealType("breakfast")}>Breakfast</button>
            <button className={`chip small ${mealType === "lunch" ? "active" : ""}`} onClick={() => setMealType("lunch")}>Lunch</button>
            <button className={`chip small ${mealType === "dinner" ? "active" : ""}`} onClick={() => setMealType("dinner")}>Dinner</button>
            <button className={`chip small ${mealType === "snacks" ? "active" : ""}`} onClick={() => setMealType("snacks")}>Snacks</button>
          </div>

          {/* Quick Meals + Search */}
          
           {/* Quick Meals + Search (Separated layout) */}
<div className="quick-and-search"> {/* ✅ wrapper for both sections */}

  {/* --- Quick Meal Suggestion Card --- */}
  <div className="quick-card" onClick={() => navigate("/quick-meals")}>
    <div className="quick-left">
      <h3>🍳 Quick Meal Suggestions</h3>
      <p>Ready in 10–15 minutes — fast & tasty picks</p>
    </div>
    <div className="quick-right">
      <button className="view-btn">View</button>
    </div>
  </div>

  {/* --- Search Bar Below --- */}
  <div className="search-row">
    <input
      placeholder="Enter ingredients (e.g., chicken, rice, egg)..."
      value={query}
      onChange={handleSearchChange}
    />
  </div>

</div>

        </section>

        {/* Categories */}
        <section className="category-row" aria-label="categories">
          <div className="category-scroll">
            {categories.map((cat) => (
              <button
                key={cat.idCategory}
                className="category-card"
                onClick={() => {
                  setQuery("");
                  fetchMeals(cat.strCategory);
                }}
              >
                <div className="category-circle">
                  <img src={cat.strCategoryThumb} alt={cat.strCategory} />
                </div>
                <div className="category-label">{cat.strCategory}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Meals Grid */}
        <section className="menu-grid">
          {filtered.length === 0 ? (
            <p className="empty">🍽️ No meals found</p>
          ) : (
            <div className="meals-grid">
              {filtered.map((meal) => (
                <MealCard
                  key={meal.idMeal}
                  meal={meal}
                  favorites={favorites}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          )}
        </section>

        <footer className="footer">
          © 2025 Taylor's Kitchen • Made with ❤️ by Vinisree
        </footer>
      </main>

      {/* Favorites Drawer */}
     {/* Favorites Drawer */}
{showFavDrawer && (
  <FavoritesBar
    favorites={favorites}
    onClose={() => setShowFavDrawer(false)}
    onRemove={(id) => onRemoveFavorite(id)}   // <- pass as "onRemove"
  />
)}


    

    </div>
  );
};

export default Home;
