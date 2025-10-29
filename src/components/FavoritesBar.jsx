import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/FavoritesBar.css";

const FavoritesBar = ({ favorites = [], onRemove, onClose }) => {
  const navigate = useNavigate();
  const handleSelect = (id) => {
    navigate(`/recipe/${id}`);
    if (onClose) onClose();
  };

  return (
    <div className="favorites-overlay" onClick={onClose}>
      <div className="favorites-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="favorites-header">
          <h2>❤️ Favorites</h2>
          <button className="close-btn" onClick={onClose}>❌</button>
        </div>

        {favorites.length === 0 ? (
          <p className="no-favs">No favorites yet</p>
        ) : (
          <div className="favorites-list">
            {favorites.map((fav) => (
              <div key={fav.idMeal} className="fav-item" onClick={() => handleSelect(fav.idMeal)}>
                <img src={fav.strMealThumb} alt={fav.strMeal} />
                <div className="fav-info">
                  <p>{fav.strMeal}</p>
                  <button onClick={(e) => { e.stopPropagation(); onRemove(fav.idMeal); }} className="remove-btn">❌</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesBar;
