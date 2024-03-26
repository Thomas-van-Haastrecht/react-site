import { useEffect, useState } from "react";
import SelectedRecipe from "./SelectedRecipe";

// renders the list of recipes and the active recipe if one is selected (activeRecipe state lifted to parent so it can be used by other tabs)
// activeRecipe      - state tracking which user is active
// setActiveRecipe   - function used to set the active recipe
const RecipeList = ({fetchData, activeRecipe, setActiveRecipe}) => {
    // state keeping track of the list of recipes (should be value from GET)
    const [recipes, setRecipes] = useState([])
    const [ingredientTypes, setIngredientTypes] = useState([])

    const [isLoaded, setLoaded] = useState(false)
    const [LoadFailed, setLoadFailed] = useState(false)

    // effect which runs on page load and calls the fetchData function to retrieve product list
    useEffect( () => {
        /// Create an async function within the useEffect hook
        const fetch = async(urls) => {
            await Promise.all(urls.map(url => fetchData(url)))
            .then(result => {
                console.log(result)
                setRecipes(result[0])
                setIngredientTypes(result[1])
            })
            .catch( err => {
                console.log(err)
                setLoadFailed(true)
            })
            setLoaded(true)
        }
        /// Call the function
        fetch(['https://localhost:7027/api/recipes', 'https://localhost:7027/api/products/ingredienttypes'])
    }, [])

    // effect which stores recipe info in local storage whenever recipes state is changed
    useEffect(() => {
        localStorage.setItem("RECIPES", JSON.stringify(recipes));
    }, [recipes]);

    // states to track values of input to the edit fields in selectedRecipe
    const [newTitle, setNewTitle] = useState("");
    const [newIngredients, setNewIngredients] = useState([]);
    const [newInstructions, setNewInstructions] = useState([]);

    // effect which resets input fields when activeRecipe changes
    useEffect(() => {
        setNewTitle("");
        var recipe = recipes.find(r => r.id == activeRecipe);
        if (recipe != undefined) {
            setNewIngredients(recipe.ingredients);
            setNewInstructions(recipe.instructions);
        }
    }, [activeRecipe]);

    // function which updates recipes state (called when info is changed in SelectedRecipe)
    // recipeId              - id of the recipe to be changed
    // updatedTitle          - new title (if changed, otherwise previous value)
    // updatedIngredients    - new ingredients (if changed, otherwise previous value)
    // updatedInstructions   - new instructions (if changed, otherwise previous value)
    function editRecipe(recipeId, updatedTitle, updatedIngredients, updatedInstructions) {
        console.log(recipes)
        var changedRecipes = recipes.map(recipe => {
            if (recipe.id == recipeId) {
                recipe.title = updatedTitle;
                recipe.ingredients = updatedIngredients;
                recipe.instructions = updatedInstructions;
            }
            return recipe;
        })
        setRecipes(changedRecipes);
    }

    return ( !isLoaded ? <div>Loading...</div> : (LoadFailed ? <div>Load Failed, Please try again.</div> :
        <>
            <div className="container-fluid mt-5">
                <div className="row">
                <div className="col-4">
                    <div className="list-group" id="list-tab" role="tablist">
                        {recipes.map( recipe => {
                            return (
                                <a key={recipe.id} className="list-group-item" onClick={() => {setActiveRecipe(recipe.id)}}>{recipe.title}</a>
                                );
                            })
                        }
                    </div>
                </div>
                <div className="col-6">
                    <div>
                        <SelectedRecipe 
                            editRecipe={editRecipe}
                            recipe={recipes.find(r => r.id == activeRecipe)}
                            ingredientTypes={ingredientTypes}
                            newTitle={newTitle} setNewTitle={setNewTitle}
                            newIngredients={newIngredients} setNewIngredients={setNewIngredients}
                            newInstructions={newInstructions} setNewInstructions={setNewInstructions} />
                    </div>
                </div>
                </div>
            </div>
        </>
    )
    );
}

export default RecipeList;