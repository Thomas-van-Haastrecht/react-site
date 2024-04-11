import { useEffect, useRef, useState } from "react";
import SelectedRecipe from "./SelectedRecipe";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getIngredientTypes, getProducts } from "../api/products";
import { getRecipes, putRecipe } from "../api/recipes";
import ConfirmDeleteModal from "../Components/ConfirmDeleteModal";
import ItemList from "../Components/ItemList";

// renders the list of recipes and the active recipe if one is selected (activeRecipe state lifted to parent so it can be used by other tabs)
// activeRecipe      - state tracking which user is active
// setActiveRecipe   - function used to set the active recipe
// moveToComment     - function which sets active comment and active tab in order to switch to the view of specified comment
const RecipeList = ({activeRecipe, setActiveRecipe, moveToComment}) => {
    // Query Client used to force a refetch after any changes (PUT/POST/DELETE) are made
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
    const {status: productStatus, error: productError, data: products} = useQuery({
        queryKey: ['products'],
        queryFn: getProducts,
    })

    // PUT/DELETE methods
    const putRecipeMutation = useMutation({
        mutationFn: putRecipe,
        onSuccess: () => {
            queryClient.refetchQueries({queryKey: ['recipes']})
        },
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
        var recipe = recipes?.find(r => r.id == activeRecipe);
        if (recipe != undefined) {
            setNewTitle(recipe.title);
            setNewIngredients(recipe.ingredients);
            setNewInstructions(recipe.instructions);
        }
    }, [activeRecipe]);

    // function which updates recipes state (called when info is changed in SelectedRecipe)
    // recipeId              - id of the recipe to be changed
    function editRecipe(recipeId) {
        var recipe = recipes.find(recipe => recipe.id == recipeId);
        console.log(newIngredients)
        const p = new Promise((resolve) => {
            recipe.title = newTitle;
            recipe.ingredients = newIngredients;
            recipe.instructions = newInstructions;
            resolve(recipe)
        })
        p.then(result => {updateRecipe(recipeId, result)})
        // recipe.title = newTitle;
        // recipe.ingredients = newIngredients;
        // recipe.instructions = newInstructions;
        // const r = recipe;
        // console.log(r)
        // updateRecipe(recipeId, r);
    }

    // function which sends updated recipe
    // rid      - id of the recipe (in recipes) to be sent
    // recipe   - recipe data to send with PUT
    async function updateRecipe(rid, recipe) {
        const recipeJSON = JSON.stringify(recipe); // make it JSON
        console.log(recipeJSON);

        try {
            const entry = await putRecipeMutation.mutateAsync({id: rid, recipeJSON: recipeJSON})
            console.log(entry)
        }
        catch (err) {
            console.log(err)
        }
    }

    // function which sends DELETE request to remove a recipe from DB (not implemented)
    function removeRecipe(id) {
        console.log('fake deleting:', id)
    }

    // reference to the cancel button used to close modal
    const cancelButton = useRef(null);

    // function defining behavior for modal onclicking confirmation button
    // sent to the delete modal
    function onModalConfirm() {
        const rid = recipes.find(u => u.id == activeRecipe).id;
        removeRecipe(rid);
        setActiveRecipe(0);

        cancelButton.current.click(); // close modal
    }

    var isLoading = [recipeStatus, ingredientStatus].some(value => value == 'pending')
    var LoadFailed = [recipeStatus, ingredientStatus].some(value => value == 'error')
    return ( isLoading ? <div>Loading...</div> : (LoadFailed ? <div>Load Failed, Please try again.</div> :
        <>
            {/* Modal component, renders modal when delete button is pressed */}
            <ConfirmDeleteModal 
                modalId={'deleteRecipeModal'}
                modalTitle={'Remove Recipe Confirmation'}
                divInfoId={'toDeleteRecipeInfo'}
                cancelButtonRef={cancelButton}
                onConfirm={onModalConfirm}
            />
            
            <div className="container-fluid mt-5">
                <div className="row">
                    <div className="col-4">
                        <ItemList
                            items={[...recipes].sort((a, b) => {return a.id - b.id})}
                            displayParam={'title'}
                            setActive={setActiveRecipe}
                            divInfoId={'toDeleteRecipeInfo'}
                            modalId={'deleteRecipeModal'}
                        />
                    </div>
                    <div className="col-6">
                        <div>
                            <SelectedRecipe 
                                editRecipe={editRecipe}
                                recipe={recipes.find(r => r.id == activeRecipe)}
                                ingredientTypes={ingredientTypes}
                                products={products}
                                newTitle={newTitle} setNewTitle={setNewTitle}
                                newIngredients={newIngredients} setNewIngredients={setNewIngredients}
                                newInstructions={newInstructions} setNewInstructions={setNewInstructions}
                                moveToComment={moveToComment}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
    );
}

export default RecipeList;