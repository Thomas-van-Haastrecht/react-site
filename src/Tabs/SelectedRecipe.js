import { useEffect, useState, useRef } from "react";
import React from "react";
import '../assets/form.css'
import TextInput from "../Components/Form/TextInput";

// renders edit form for the selected recipe as well as its info
// editRecipe           - function to change recipe (called when submitting form)
// recipe               - recipe info from recipes list
// newTitle             - state of value in the Title edit field
// setNewTitle          - function to change newTitle state
// newIngredients       - state of value in the Ingredients edit field (currently not implemented)
// setNewIngredients    - function to change newIngredients state
// newInstructions      - state of value in the Instructions edit field
// setNewInstructions   - function to change newInstructions state
const SelectedRecipe = ({editRecipe, recipe, ingredientTypes, products, newTitle, setNewTitle, newIngredients, setNewIngredients, newInstructions, setNewInstructions, moveToComment}) => {
    // state tracking the new instruction field (empty field after last existing instruction)
    const [newInstruction, setNewInstruction] = useState("");
    const [newAmount, setNewAmount] = useState(0);
    const [selectedType, setSelectedType] = useState("");
    
    // state to track form errors
    const [formErrors, setFormErrors] = useState({'title': '', 'ingredients': '', 'instructions': ''})

    // effect which resets form errors when recipe is changed
    useEffect(() => {
        setFormErrors({'name': '', 'ingredients': '', 'instructions': ''})
    }, [recipe])

    // effect which adds newInstruction to the recipe's instructions if newInstruction changes
    useEffect(() => {
        if (newInstruction != "" && recipe != undefined) {
            newInstructions.push(newInstruction);
            editRecipe(recipe.id, recipe.title, newIngredients, newInstructions);
            
            setNewInstruction("");
        }
        if (newInstructions.length > 0) {
            var textbox = document.getElementById(newInstructions.length-1);
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

        const errors = {
            'title': (e.target.title.value ? '' : 'Title cannot be empty'),
            //'email': (e.target.email.value ? '' : 'Email cannot be empty'),
            //'city': (e.target.city.value ? '' : 'City cannot be empty')
        };

        if (Object.values(errors).some(v => v != '')) {
            setFormErrors(errors);
        } else {
            // call edit function so user gets new information
            editRecipe(recipeId);
        }
    }

    // function which removes an existing instruction and updates the recipe
    // index   - index of the instruction which needs to be removed
    function removeInstruction(index) {
        newInstructions.splice(index, 1); // splice(x, y) removes y elements starting at index x
        editRecipe(recipe.id, recipe.title, newIngredients, newInstructions);
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

    // function which removes an existing ingredient and updates the recipe
    // id   - id of the ingredient which needs to be removed
    function removeIngredient(id) {
        setNewIngredients(previousIngredients => {
            return previousIngredients.filter(i => i.id != id);
        });
        editRecipe(recipe.id, recipe.title, newIngredients, newInstructions);
    }

    // function which handles when existing ingredients are updated
    // e   - Event which was triggered (used to get html element and its contents, and to prevent a page reload)
    function handleIngredientChange(ingredientId, form) {
        var updatedAmount = form[ingredientId+'_amount'].value;
        var updatedProductId = form[ingredientId+'_product'].value;

        setNewIngredients(previousIngredients => {
            return previousIngredients.map(ingredient => {
                if (ingredient.id == ingredientId) { // only edit the correct user
                    ingredient.amount = +updatedAmount;
                    var product = products.find(p => p.id == updatedProductId)
                    ingredient.name = product.name;
                    ingredient.productId = product.id;
                    ingredient.productName = product.name;
                    ingredient.productIngredientType = product.ingredientType;
                }
                return ingredient;
            })
        });
        editRecipe(recipe.id);
    }

    return (
        <div>
            {recipe != null && // only show form if product is not null
                <div>
                    <h4>Info for "{recipe.title}"</h4>

                    <form className="form-inline" onSubmit={handleSubmit}>
                        <input className="d-none" type="submit" value="submit" />
                        <input type="hidden" value={recipe.id} id="recipeId" />

                        {/* input for title */}
                        <div className="text-danger mx-sm-3">{formErrors.title}</div>
                        <TextInput
                            label={'Title'}
                            value={newTitle}
                            onChange={e => setNewTitle(e.target.value)}
                            onBlur={e => {
                                e.target = e.target.parentElement.parentElement; // set target to the form
                                handleSubmit(e);
                                }
                            }
                            id={'title'}
                            placeholder={recipe.title}
                        />

                        {/* input for ingredients */}
                        <label htmlFor="ingredients" className="control-label mx-sm-3">Ingredients:</label>
                        {newIngredients.map(ingredient => {
                        return(
                                <React.Fragment key={ingredient.id}>
                                    <div className="input-group mx-sm-3 mb-2">
                                        <select
                                            name='product'
                                            id={ingredient.id + "_product"}
                                            value={ingredient.productId}
                                            required
                                            className='form-control form-row-large'
                                            onChange={(e) => {
                                                e.preventDefault();
                                                handleIngredientChange(ingredient.id, e.target.parentElement.parentElement)
                                                }
                                            }
                                        >
                                            {products.map(p => {
                                                return (
                                                    <option key={p.id} value={p.id} hidden={recipe.ingredients.some(i => i.productId == p.id && i.productId != ingredient.productId)}>{p.name}</option>
                                                )
                                            })}
                                        </select>
                                        {/* input for amount */}
                                        <input className="form-control form-row-small"
                                            value={ingredient.amount}
                                            onChange={e => {
                                                e.preventDefault();
                                                handleIngredientChange(ingredient.id, e.target.parentElement.parentElement);
                                            }}
                                            onBlur={e => {
                                                //e.target = e.target.parentElement.parentElement; // set target to the form
                                                //handleSubmit(e);
                                                }
                                            }
                                            type="number"
                                            step="any"
                                            id={ingredient.id + "_amount"}
                                            placeholder={ingredient.amount}
                                        />
                                        <div className="input-group-append input-group-text w-25">{ingredient.productIngredientType}</div>
                                        <button className="btn btn-danger bi bi-trash product-trash" onClick={() => removeIngredient(ingredient.id)}></button>
                                    </div>
                                </React.Fragment>
                            );
                        })}

                        <div>&nbsp;</div>

                        {/* input for instructions */}
                        <label htmlFor="instructions" className="control-label mx-sm-3">Instructions:</label>
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
                        </div>
                    </form>
                    <p className="mx-sm-3">Comments:</p>
                    <ul className="list-group mx-sm-3">
                        {recipe.comments.map(comment => {
                            return (
                                <a key={comment.id} className="list-group-item link-primary" onClick={() => {moveToComment(comment.id)}}>{comment.comment}</a>
                            )
                        })}
                    </ul>

                </div>
            }
        </div>
    );
}

export default SelectedRecipe;