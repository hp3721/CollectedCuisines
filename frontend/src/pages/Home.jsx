import { useEffect } from "react";

import styles from "../styles/Home.module.css";

import { usePocket } from "../PbContext"; 

const Home = () => {
    const { recipes, user, logout, fetchUserAndRecipes } = usePocket();
  
    useEffect(() => {
        fetchUserAndRecipes();
    }, []);
    
    return (
        <div>
            <button onClick={logout}>
                Logout
            </button>
            <h1 className="text-center text-xl font-bold mb-4">Welcome, {user.name}!</h1>
            <div>
                <h1>User Recipes</h1>
                <div className={styles.recipe_grid}>
                    {recipes.length === 0 ? (
                    <p>No recipes found.</p>
                    ) : (
                    recipes.map((recipe, index) => (
                        <div key={index} className={styles.recipe_card}>
                        <h3>{recipe.name}</h3>
                        <p>{recipe.description}</p>
                        </div>
                    ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;