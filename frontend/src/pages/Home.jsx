import { useEffect } from "react";
import { useState } from "react";

import styles from "../styles/Home.module.css";
import logo from "../styles/images/logo.png";

import { usePocket } from "../PbContext"; 

const Recipecreate = () => {
    const { recipePopup } = usePocket();
    const [isVisible, setIsVisible] = useState(false);

    const enableClick = () => {
        setIsVisible(true);
    };

    const disableClick = (a, b) => {
        //check if it has the right attribute so the children dont close it
        if(a.target.getAttribute("data-value") === "close")
            setIsVisible(false);
    }

    return (
        <div>
            {isVisible && (
            <div data-value='close' className={styles.background_blur} onClick={disableClick}>
                <div className={styles.recipe_add_popup}>
                <center>
                    <form>
                <label for="url">Enter an https:// URL:</label>
                <input
                    type="url"
                    name="url"
                    id="url"
                    placeholder="https://food.com"
                    pattern="https://.*"
                    size="30"
                    required />
                    <input type="submit" value="Submit"></input>
                </form>
            </center>
                </div>
            </div>
            )}
            <button className={styles.recipe_add} onClick={enableClick}>+</button>
        </div>
    );  
}

const Home = () => {
    const { recipes, user, logout, fetchUserAndRecipes } = usePocket();
    
    useEffect(() => {
        fetchUserAndRecipes();
    }, []);
    
    return (
        <div>
            <div className={styles.head_bar}>
                <div>
                    <span>Collected Cuisines</span>
                </div>
                <div>
                  <center><img height="50px" src={logo} alt="Logo" /></center>  
                </div>
                <div className={styles.head_bar_user}>
                    <span>Welcome, {user.name}!</span>
                    <button onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>

            <div>
                <div className={styles.my_recipe}>My Recipes</div>
                <div className={styles.recipe_grid}>
                    {recipes.length === 0 ? (
                    <p>They were just here...</p>
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
            <Recipecreate/>
        </div>
    );
}

export default Home;