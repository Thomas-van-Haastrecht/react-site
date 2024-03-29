import { useEffect, useRef, useState } from "react";
import SelectedRecipe from "./SelectedRecipe";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getIngredientTypes } from "../api/products";
import { getRecipes } from "../api/recipes";
import ConfirmDeleteModal from "../Components/ConfirmDeleteModal";

// renders the list of recipes and the active recipe if one is selected (activeRecipe state lifted to parent so it can be used by other tabs)
// activeRecipe      - state tracking which user is active
// setActiveRecipe   - function used to set the active recipe
const RecipeList = ({activeRecipe, setActiveRecipe}) => {
    const queryClient = useQueryClient();
    // GET methods
    const {status: recipeStatus, error: recipeError, data: recipes} = useQuery({
        queryKey: ['recipes'],
        queryFn: getRecipes,
    })
    const {status: ingredientStatus, error: ingredientError, data: ingredientTypes} = useQuery({
        queryKey: ['ingredients'],
        queryFn: getIngredientTypes,
    })

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
        var recipe = recipes?.find(r => r.id == activeRecipe);
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
        //PUT
    }

    function sendDeleteRecipe(id) {
        console.log('fake deleting:', id)
    }

    // reference to the cancel button used to close modal
    const cancelButton = useRef(null);

    function onModalConfirm() {
        const rid = recipes.find(u => u.id == activeRecipe).id;
        sendDeleteRecipe(rid);
        setActiveRecipe(0);

        cancelButton.current.click(); // close modal
    }

    var isLoading = [recipeStatus, ingredientStatus].some(value => value == 'pending')
    var LoadFailed = [recipeStatus, ingredientStatus].some(value => value == 'error')
    return ( isLoading ? <div>Loading...</div> : (LoadFailed ? <div>Load Failed, Please try again.</div> :
        <>
            <ConfirmDeleteModal 
                modalId={'deleteRecipeModal'}
                modalTitle={'Remove Recipe Confirmation'}
                divInfoId={'toDeleteRecipeInfo'}
                cancelButtonRef={cancelButton}
                onConfirm={onModalConfirm} />
            
            <div className="container-fluid mt-5">
                <div className="row">
                <div className="col-4">
                    <div className="list-group" id="list-tab" role="tablist">
                        {recipes.map( (recipe, index) => {
                            return (
                                <li key={recipe.id} className="list-group-item p-0 d-flex justify-content-between align-items-center" onClick={() => {setActiveRecipe(recipe.id)}}>
                                    <div className="align-items-center">
                                        <div className="ms-3">
                                            <span className="">{recipe.title}</span>
                                        </div>
                                    </div>
                                    <button
                                        className={"btn btn-danger bi bi-trash product-trash rounded-start-0" + (index > 0 ? " rounded-top-0" : "") + (index < recipes.length-1 ? " rounded-bottom-0" : " rounded-bottom-left-0")}
                                        onClick={() => {
                                            setActiveRecipe(recipe.id);
                                            document.getElementById("toDeleteRecipeInfo").textContent = recipe.title;
                                        }}
                                        data-toggle="modal"
                                        data-target="#deleteRecipeModal"
                                    ></button>
                                </li>
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