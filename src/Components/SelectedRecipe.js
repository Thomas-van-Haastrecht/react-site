import { useEffect, useState } from "react";
import React from "react";

// renders edit form for the selected recipe as well as its info
// editRecipe             - function to change recipe (called when submitting form)
// recipe                 - recipe info from recipes list
// newTitle               - state of value in the Title edit field
// setNewTitle            - function to change newTitle state
// newIngredients         - state of value in the Ingredients edit field (currently not implemented)
// setNewIngredients      - function to change newIngredients state
// newInstructions        - state of value in the Instructions edit field
// setNewInstructions     - function to change newInstructions state
const SelectedRecipe = ({editRecipe, recipe, ingredientTypes, newTitle, setNewTitle, newIngredients, setNewIngredients, newInstructions, setNewInstructions}) => {
    // state tracking the new instruction field (empty field after last existing instruction)
    const [newInstruction, setNewInstruction] = useState("");

    // effect which adds newInstruction to the recipe's instructions if newInstruction changes
    useEffect(() => {
        if (newInstruction != "" && recipe != undefined) {
            newInstructions.push(newInstruction);
            editRecipe(recipe.id, recipe.title, newIngredients, newInstructions);
            
            setNewInstruction("");
        }
        if (newInstructions.length > 0) {
            var textbox = document.getElementById(newInstructions.length-1);
            console.log(newInstructions.length-1, textbox);
    
            textbox.focus();
        }
    }, [newInstruction]);

    // function to handle submitting the form
    // e   - Event which was triggered (used to get html element and its contents, and to prevent a page reload)
    function handleSubmit(e) {
        e.preventDefault();

        const recipeId = e.target.recipeId.value;
        // if not empty, gets input from form, otherwise uses initial value (i.e. value is unchanged)
        const updatedTitle = e.target.title.value ? e.target.title.value : e.target.title.placeholder;

        // call edit function so user gets new information
        editRecipe(recipeId, updatedTitle, newIngredients, newInstructions);
        
        // reset form fields
        setNewTitle("");
    }

    // function which removes an existing instruction and updates the recipe
    // index   - index of the instruction which needs to be removed
    function removeInstruction(index) {
        newInstructions.splice(index, 1); // splice(x, y) removes y elements starting at index x
        editRecipe(recipe.id, recipe.name, newIngredients, newInstructions);
    }

    // function which handles when existing instructions are updated
    // e   - Event which was triggered (used to get html element and its contents, and to prevent a page reload)
    function handleInstructionChange(e) {
        e.preventDefault();
        var index = e.target.id;
        var updatedInstruction = e.target.value;
        const updatedInstructions = newInstructions.map((instruction, i) => {
            if(i == index) { // only update edited instruction
                return updatedInstruction;
            }
            return instruction;
        });
        setNewInstructions(updatedInstructions);
    }
    return (
        <div>
            {recipe != null && // only show form if product is not null
                <div>
                    <h4>Recipe Info</h4>
                    <p>Title: {recipe.title}</p>
                    <p>Creator: {recipe.creator}</p>
                    <p>Ingredients:</p>
                    <ul>
                        {recipe.ingredients.map(ingredient => {
                            return (
                                <>
                                    {ingredient.productIngredientType == ingredientTypes[0] && //index 0 = milliliter 
                                    <li key={ingredient.id}>{ingredient.name} {ingredient.amount} {ingredient.productIngredientType}</li>}
                                    {ingredient.productIngredientType == ingredientTypes[1] && //index 1 = gram 
                                    <li key={ingredient.id}>{ingredient.name} {ingredient.amount} {ingredient.productIngredientType}</li>}
                                    {ingredient.productIngredientType == ingredientTypes[2] && //index 0 = stuks 
                                    <li key={ingredient.id}>{ingredient.name} &times; {ingredient.amount}</li>}
                                </>
                            );
                        })}
                    </ul>

                    <form className="form-inline" onSubmit={handleSubmit}>
                        <input type="hidden" value={recipe.id} id="recipeId" />

                        {/* input for title */}
                        <label htmlFor="title" className="control-label">Title: {recipe.title}</label>
                        <div className="input-group mx-sm-3 mb-2">
                            <input className="form-control"
                                value={newTitle}
                                onChange={e => setNewTitle(e.target.value)}
                                type="text"
                                id="title"
                                placeholder={recipe.title}
                            />
                            <input className="btn btn-secondary input-group-append" type="submit" value="Edit" />
                        </div>

                        {/* input for instructions */}
                        <label htmlFor="instructions" className="control-label">Instructions:</label>
                        {newInstructions.map((instruction, index) => {
                        return(
                                <React.Fragment key={index}>
                                    <div className="input-group mx-sm-3 mb-2">
                                        <div className="input-group-prepend input-group-text">{index+1}</div>
                                        <input className="form-control"
                                            value={instruction}
                                            onChange={e => {handleInstructionChange(e)}}
                                            onBlur={() => {}} // to be used for POST
                                            type="text"
                                            id={index}
                                        />
                                        <input className="btn btn-secondary input-group-append" type="submit" value="Edit" />
                                        <button className="btn btn-danger bi bi-trash product-trash" onClick={() => removeInstruction(index)}></button>
                                    </div>
                                </React.Fragment>
                            );
                        })}

                        <div className="input-group mx-sm-3 mb-2">
                            <input className="form-control"
                                value={newInstruction}
                                placeholder="Next Instruction Step"
                                onChange={e => {setNewInstruction(e.target.value)}}
                                type="text"
                                id={newInstructions.length}
                            />
                            <input className="btn btn-secondary input-group-append" type="submit" value="Edit" />
                        </div>
                    </form>
                    <p>Comments: {recipe.comments}</p>

                </div>
            }
        </div>
    );
}

export default SelectedRecipe;