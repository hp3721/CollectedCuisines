import Pocketbase from 'pocketbase';
import { scrapeRecipeFromClipboard, pushtoTable } from './Scrapers';
import { createContext, useContext, useMemo, useState } from 'react';

const BASE_URL = import.meta.env.VITE_PB_URI;

const PbContext = createContext();

export const PbProvider = ({ children }) => {
    const pb = useMemo(() => new Pocketbase(BASE_URL));
    pb.autoCancellation(false);

    const [user, setUser] = useState(pb.authStore.record);
    const [token, setToken] = useState(pb.authStore.token);
    const [recipes, setRecipes] = useState([]);

    const discordAuth = async () => {
        try {
            const res = await pb.collection('users').authWithOAuth2({ 
                provider: 'discord',
                scopes:   ["identify", "email"] 
            });
            setUser(pb.authStore.record);
            return null;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }
    
    const googleAuth = async () => {
        try {
            const res = await pb.collection('users').authWithOAuth2({ 
                provider: 'google'
            });
            setUser(pb.authStore.record);
            return null;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

    const logout = () => {
        try {
            pb.authStore.clear();
            pb.collection("users").authRefresh();
            setUser(undefined);
            window.location.href = '/'; 
        }
        catch (err) {
            console.log(err);
        }
    }

    const getAvatarUrl = () => {
        if (!user) return undefined;
        if (typeof user.avatar !== 'string' || !user.avatar) return undefined;
        return pb.getFileUrl(user, user.avatar);
    }

    const fetchRecipes = async () => {
        try {
            if (user == null) return;
            const records = await pb.collection("users").getOne(user.id, {
                expand: 'recipes,recipes.ingredients'
            });
            setRecipes(records.expand?.recipes || []);
        } catch (err) {
            console.error("Error fetching user recipe data:", err);
        }
    };

    const scrapeAndSaveRecipe = async () => {
        try {
            const scraper = await scrapeRecipeFromClipboard();
            await pushtoTable(pb, user, scraper);
            await fetchRecipes();
        } catch (error) {
            console.error('Error scraping and saving recipe:', error);
        }
    };

    return (
        <PbContext.Provider value={{ 
            user,
            recipes,
            discordAuth,
            googleAuth,
            logout,
            fetchRecipes,
            getAvatarUrl,
            scrapeAndSaveRecipe
         }}>
        {children}
        </PbContext.Provider>
    );
}

export const usePocket = () => useContext(PbContext);