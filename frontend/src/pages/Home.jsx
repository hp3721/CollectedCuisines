import { useEffect } from "react";
import { useState } from "react";

// import '../tailwind.css'
import styles from "../styles/Home.module.css";
import logo from "../styles/images/logo.png";
import { FaRegClipboard } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";

import { usePocket } from "../PbContext"; 

// const RecipeDetailsModal = ({ recipe, onClose }) => {
//     if (!recipe) return null;
  
//     return (
//       <div className={styles.background_blur} onClick={onClose}>
//         <div className={styles.recipe_add_popup} onClick={(e) => e.stopPropagation()}>
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 p-2 rounded-full hover:bg-base-200/50 transition-colors duration-200"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6 text-base-content"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//           </button>
  
//           <h2 className="text-2xl font-bold mb-4">{recipe.name}</h2>
//           <p className="text-lg text-base-content/80 mb-6">{recipe.description}</p>
//         </div>
//       </div>
//     );
// };

const RecipeDetailsModal = ({ recipe, onClose }) => {
    if (!recipe) return null;

    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className={`${styles.static_recipe_card} bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative`} onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
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
  
          <h2 className="text-2xl font-bold mb-4 text-center">{recipe.name}</h2>

          <p className="text-gray-700 mb-4 text-left">{recipe.description}</p>

          {recipe.ingredients.length > 0 && recipe.expand?.ingredients && (
            <div className="text-left mb-4">
                <h3 className="text-xl font-semibold mb-2">Ingredients</h3>
                <ul className="list-disc list-inside">
                {recipe.expand?.ingredients.map((ingredient, index) => (
                    <li key={index} className="text-gray-700 mb-2">
                    {ingredient.description}
                    </li>
                ))}
                </ul>
            </div>
          )}
    
          {recipe.instructions && recipe.instructions.length > 0 && (
            <div className="text-left mb-4">
                <h3 className="text-xl font-semibold mb-2">Instructions</h3>
                <ol className="list-decimal list-inside">
                {recipe.instructions.map((step, index) => (
                    <li key={index} className="text-gray-700 mb-2">
                    {step}
                    </li>
                ))}
                </ol>
            </div>
            )}
        </div>
      </div>
    );
};

const Home = () => {
    const { recipes, user, logout, fetchRecipes, fetchIngredients, getAvatarUrl, scrapeAndSaveRecipe } = usePocket();    
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    useEffect(() => {
        fetchRecipes();
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
                                <li><button onClick={scrapeAndSaveRecipe}><FaRegClipboard/>Collect Recipe</button></li>
                                <li><button onClick={logout}><TbLogout2/>Logout</button></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-4">
                <div className="my-2 text-base font-semibold text-base-content">My Recipes</div>
                <div className={styles.recipe_grid}>
                    {recipes.length === 0 ? (
                    <p>They were just here...</p>
                    ) : (
                    recipes.map((recipe, index) => (
                        <div key={index} className={styles.recipe_card} onClick={() => setSelectedRecipe(recipe)}>
                        <h3 className="font-semibold">{recipe.name}</h3>
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