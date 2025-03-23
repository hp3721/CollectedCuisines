import { useEffect } from "react";
import { useState } from "react";

// import '../tailwind.css'
import styles from "../styles/Home.module.css";
import logo from "../styles/images/logo.png";
import { FaRegClipboard } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";

import { usePocket } from "../PbContext"; 

const RecipeDetailsModal = ({ recipe, onClose }) => {
    if (!recipe) return null;
  
    return (
      <div className={styles.background_blur} onClick={onClose}>
        <div className={styles.recipe_add_popup} onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-base-200/50 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-base-content"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
  
          <h2 className="text-2xl font-bold mb-4">{recipe.name}</h2>
          <p className="text-lg text-base-content/80 mb-6">{recipe.description}</p>
        </div>
      </div>
    );
};

const Home = () => {
    const { recipes, user, logout, fetchUserAndRecipes, getAvatarUrl } = usePocket();    
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    useEffect(() => {
        fetchUserAndRecipes();
    }, []);
    
    return (
        <div>
            <div className="navbar bg-primary shadow-sm">
                <div className="navbar-start">
                    <div className="w-8 mx-1 rounded-full">
                    <img
                        alt="Logo"
                        src={logo} />
                    </div>
                </div>
                <div className="navbar-center">
                    <a href="/" className="btn btn-ghost text-primary-content text-xl">Collected Cuisines</a>
                </div>
                <div className="navbar-end">
                    <div className="flex mx-1">
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                <img src={getAvatarUrl()} alt={user.name} />
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="text-primary-content menu menu-sm dropdown-content bg-primary rounded-box z-1 mt-3 w-52 p-2 shadow">
                                <li><button onClick={logout}><FaRegClipboard/>Collect Recipe</button></li>
                                <li><button onClick={logout}><TbLogout2/>Logout</button></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-4">
                <div className="my-2 text-base text-base-content">My Recipes</div>
                <div className={styles.recipe_grid}>
                    {recipes.length === 0 ? (
                    <p>They were just here...</p>
                    ) : (
                    recipes.map((recipe, index) => (
                        <div key={index} className={styles.recipe_card} onClick={() => setSelectedRecipe(recipe)}>
                        <h3>{recipe.name}</h3>
                        <p>{recipe.description}</p>
                        </div>
                    ))
                    )}
                </div>
            </div>
            {selectedRecipe && (
                <RecipeDetailsModal
                recipe={selectedRecipe}
                onClose={() => setSelectedRecipe(null)} // Close the modal
                />
            )}
        </div>
    );
}

export default Home;