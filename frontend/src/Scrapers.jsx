import axios from 'axios';
import * as cheerio from 'cheerio';
import he from 'he';

// Ingredient class
class Ingredient {
    constructor(units, value, description) {
        this.units = units; // Measurement units
        this.value = value; // Actual quantity of the item
        this.description = description; // Remainder of ingredient description
    }

    // Check if we have a known unit and convert if it is valid but in non-standard form
    addUnits() {
        // TODO: Implement unit conversion logic
        return false;
    }
}

// Abstract recipe scraper class
class RecipeScrape {
    constructor() {
        this.name = null;
        this.description = null;
        this.instructions = null;
        this.instruction_notes = null;
        this.ingredients = null;
        this.photos = null;
        this.yield = null;
        this.cook_time = null;
        this.prep_time = null;
        this.total_time = null;
        this.serving_size = null;
        this.calories = null;
        this.fat = null;
        this.protein = null;
        this.carbs = null;
        this.p_notes = null;
        this.post_date = null;
        this.author = null;
        this.source = null;
        this.created = null;
        this.updated = null;
    }

    // Define empty function to override with children
    loadData(URL) {
        return false;
    }
}

// Helper function to remove initial whitespace from a string
function removeInitialWhitespace(str) {
    let j = 0;
    while (j < str.length && str[j] === ' ') {
        j++;
    }
    return str.substring(j);
}

// Scraper for food.com
export class FoodComScrape extends RecipeScrape {
    constructor() {
        super();
        this.ingredients = [];
    }

    // Load data from the provided URL
    async loadData(URL) {
        // Ensure that we are loading a food.com URL
        if (!URL.includes('food.com')) {
            return false;
        }
        this.source = URL;

        try {
            // Use axios to load the HTML
            const response = await axios.get("https://corsproxy.io/?key=76f616d4&url="+URL);
            const html = response.data;
            const $ = cheerio.load(html);
            const jason = JSON.parse($('[type="application/ld+json"]').text());

            // Load ingredients
            this.ingredients = jason.recipeIngredient.map(
                (ingredient) => new Ingredient('', '', ingredient)
            );

            // Load recipe details
            this.name = he.decode(jason.name);
            this.author = he.decode(jason.author);

            // Format post date
            const date = jason.datePublished.split('T');
            this.post_date = `${date[0]} ${date[1].substring(0, date[1].length - 1)}:00.000Z`;

            this.description = he.decode(jason.description);
            this.yield = jason.recipeYield;
            this.p_notes = '';

            // Load nutrition information
            this.calories = jason.nutrition.calories;
            this.fat = jason.nutrition.fatContent;
            this.carbs = jason.nutrition.carbohydrateContent;
            this.protein = jason.nutrition.proteinContent;
            this.serving_size = 1; // Always 1

            // Load recipe steps
            this.instructions = jason.recipeInstructions.map(
                (step) => he.decode(step.text.replace(/\r/g, ''))
            );
            this.instruction_notes = ''; // No instruction notes on this site

            // Convert times to minutes
            this.cook_time = this.#convertTime(jason.cookTime);
            this.prep_time = this.#convertTime(jason.prepTime);
            this.total_time = this.#convertTime(jason.totalTime);
        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
    }

    // Private function to convert time strings to minutes
    #convertTime(str) {
        let total = 0;
        let nStr = str.substring(2);
        let i = 0;

        for (i = 0; i < nStr.length; i++) {
            // Break at the first character
            if (this.#isAlphabet(nStr[i])) {
                break;
            }
        }

        if (nStr[i] === 'H') {
            total += 60 * parseInt(nStr.substring(0, i));
            nStr = nStr.substring(i + 1);
        }

        if (nStr[nStr.length - 1] === 'M') {
            total += parseInt(nStr.substring(0, nStr.length - 1));
        }

        return total;
    }

    // Private function to check if a character is alphabetic
    #isAlphabet(char) {
        return /^[a-zA-Z]$/.test(char);
    }
}

// Function to push scraped recipe data to PocketBase
export async function pushtoTable(pb, user, recipe) {
    try {
        // Store ingredients first
        const ingredientUUIDs = await Promise.all(
            recipe.ingredients.map(async (ingredient) => {
                const data = {
                    parent_UUID: '',
                    value: parseFloat(ingredient.value),
                    units: ingredient.units,
                    description: ingredient.description,
                };
                const record = await pb.collection('ingredients').create(data);
                return record.id;
            })
        );

        // Push recipe
        const recipeData = {
            name: recipe.name,
            description: recipe.description,
            instructions: JSON.stringify(recipe.instructions),
            instruction_notes: JSON.stringify(recipe.instruction_notes),
            ingredients: ingredientUUIDs,
            yield: parseInt(recipe.yield),
            cook_time: recipe.cook_time,
            prep_time: recipe.prep_time,
            total_time: recipe.total_time,
            serving_size: recipe.serving_size,
            calories: recipe.calories,
            fat: recipe.fat,
            protein: recipe.protein,
            carbs: recipe.carbs,
            p_notes: recipe.p_notes,
            post_date: recipe.post_date,
            author: recipe.author,
            source: recipe.source,
        };

        const record = await pb.collection('recipes').create(recipeData);
        console.log('Recipe saved successfully:', record);

        const post = await pb.collection('users').update(user.id, {
            '+recipes': record.id
        });
        
    } catch (error) {
        console.error('Error pushing recipe to table:', error);
        throw error;
    }
}

const SUPPORTED_URLS = [
    {
        domain: 'food.com',
        scraper: FoodComScrape,
    },
];

export const scrapeRecipeFromClipboard = async () => {
    try {
        const clipboardText = await navigator.clipboard.readText();
        const url = new URL(clipboardText);

        const supportedUrl = SUPPORTED_URLS.find((supported) =>
            url.hostname.includes(supported.domain)
        );

        if (!supportedUrl) {
            throw new Error('URL is not supported');
        }
        
        const scraper = new supportedUrl.scraper();
        await scraper.loadData(url.toString());

        return scraper;
    } catch (error) {
        console.error('Error scraping recipe from clipboard:', error);
        throw error;
    }
};

// const food = new FoodComScrape();
// food.loadData('https://www.food.com/recipe/famous-challah-90765');