import { useEffect, useRef, useState } from "react";

// renders edit form for the selected product as well as its info
// editProduct            - function to change product (called when submitting form)
// product                - product info from products list
// packagingInfo          - list of packaging types and ids
// allergyInfo            - list of allergy types, ids and image ids
// newName                - state of value in the Name edit field
// setNewName             - function to change newName state
// newPrice               - state of value in the Price edit field
// setNewPrice            - function to change newPrice state
// newAmount              - state of value in the Amount edit field
// setNewAmount           - function to change newAmount state
// selectedType           - state of value in the IngredientType select field
// setSelectedType        - function to change selectedType state
// selectedPackaging      - state of value in the packagingName select field
// setSelectedPackaging   - function to change selectedPackaging state
// selectedAllergens      - state of value in the allergens select field
// setSelectedAllergens   - function to change selectedAllergens state
// newCalories            - state of value in the Calories edit field
// setNewCalories         - function to change newCalories state
// newDescription         - state of value in the Description edit field
// setNewDescription      - function to change newDescription state
// newSmallestAmount      - state of value in the SmallestAmount edit field
// setNewSmallestAmount   - function to change newSmallestAmount state
const SelectedProduct = ({
    editProduct, product, packagingInfo, allergyInfo, ingredientTypes, newName, setNewName, newPrice, setNewPrice,
    newAmount, setNewAmount, selectedType, setSelectedType, selectedPackaging, setSelectedPackaging,
    selectedAllergens, setSelectedAllergens, newCalories, setNewCalories, newDescription, setNewDescription,
    newSmallestAmount, setNewSmallestAmount, newImage, setNewImage, isNewProduct=false}) => {
    
    const submitButton = useRef(null);
    const buttonsPressed = useRef(false);
    
    useEffect(() => {
        if (buttonsPressed.current) {
            submitButton.current.click();
        }
    }, [selectedAllergens])
    

    // function to handle submitting the form
    // e   - Event which was triggered (used to get html element and its contents, and to prevent a page reload)
    function handleSubmit(e) {
        e.preventDefault(); // prevent page reload

        const pid = e.target.pid.value;
        // if not empty, updated value gets input from form, otherwise uses initial value
        const updatedName = e.target.name.value ? e.target.name.value : e.target.name.placeholder;
        const updatedPrice = e.target.price.value ? e.target.price.value : e.target.price.placeholder;
        const updatedAmount = e.target.amount.value ? e.target.amount.value : e.target.amount.placeholder;
        const updatedType = e.target.type.value;
        const updatedPackagingId = e.target.packaging.value;
        const updatedCalories = e.target.calories.value ? e.target.calories.value : e.target.calories.placeholder;
        const updatedDescription = e.target.description.value ? e.target.description.value : e.target.description.placeholder;
        const updatedSmallestAmount = e.target.smallestAmount.value ? e.target.smallestAmount.value : e.target.smallestAmount.placeholder;

        editProduct(pid, updatedName, updatedPrice, updatedAmount, updatedType, updatedPackagingId, selectedAllergens, updatedCalories, updatedDescription, updatedSmallestAmount);
    }

    function handleAllergyChange(id) {
        buttonsPressed.current = true;
        var updatedAllergens = [...selectedAllergens];
        updatedAllergens.includes(id) ? updatedAllergens.splice(updatedAllergens.indexOf(id), 1) : updatedAllergens.push(id);
        setSelectedAllergens(updatedAllergens);
        //handleSubmit(e);
    }

    function handleImage(e) {
        const file = e.target.files[0];
        setNewImage(file ? file : '');
    }

    return (
        <div>
            {product != null && // only show form if product is not null
                <div>
                    <form className="form-inline" onSubmit={e => handleSubmit(e)} style={{"paddingRight": "5%"}}>
                        <input type="hidden" value={product.id} id="pid" />

                        {/* input for name */}
                        <label htmlFor="name" className="control-label">Name: {product.name}</label>
                        <div className="input-group mx-sm-3 mb-2">
                            <input className="form-control"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                onBlur={e => {
                                    e.target = e.target.parentElement.parentElement; // set target to the form
                                    handleSubmit(e);
                                    }
                                }
                                type="text"
                                id="name"
                                placeholder={product.name}
                            />
                        </div>

                        {/* input for price */}
                        <label htmlFor="price" className="control-label">Price: €{product.price}</label>
                        <div className="input-group mx-sm-3 mb-2">
                            <div className="input-group-prepend input-group-text">€</div>
                            <input className="form-control"
                                value={newPrice}
                                onChange={e => setNewPrice(e.target.value)}
                                onBlur={e => {
                                    e.target = e.target.parentElement.parentElement; // set target to the form
                                    handleSubmit(e);
                                    }
                                }
                                type="number"
                                step="any"
                                id="price"
                                placeholder={product.price}
                            />
                        </div>

                        {/* input for amount */}
                        <label htmlFor="amount" className="control-label">Amount: {product.amount} {product.ingredientType}</label>
                        <div className="input-group mx-sm-3 mb-2">
                            <input className="form-control"
                                value={newAmount}
                                onChange={e => setNewAmount(e.target.value)}
                                onBlur={e => {
                                    e.target = e.target.parentElement.parentElement; // set target to the form
                                    handleSubmit(e);
                                    }
                                }
                                type="number"
                                step="1"
                                id="amount"
                                placeholder={product.amount}
                            />
                            <select
                                name='type'
                                id='type'
                                value={selectedType}
                                required
                                className='form-control'
                                onChange={(e) => {
                                    setSelectedType(e.target.value);
                                    e.target = e.target.parentElement.parentElement; // set target to the form
                                    handleSubmit(e);
                                    }
                                }
                            >
                                {ingredientTypes.map((o, index) => {
                                    return (
                                        <option key={index} value={o}>{o}</option>
                                    )
                                })}
                            </select>
                        </div>

                        {/* input for calories */}
                        <label htmlFor="calories" className="control-label">calories: {product.calories}</label>
                        <div className="input-group mx-sm-3 mb-2">
                            <input className="form-control"
                                value={newCalories}
                                onChange={e => setNewCalories(e.target.value)}
                                onBlur={e => {
                                    e.target = e.target.parentElement.parentElement; // set target to the form
                                    handleSubmit(e);
                                    }
                                }
                                type="number"
                                step="1"
                                id="calories"
                                placeholder={product.calories}
                            />
                        </div>

                        {/* input for description */}
                        <label htmlFor="description" className="control-label">Description:</label>
                        <div className="input-group mx-sm-3 mb-2">
                            <input className="form-control"
                                value={newDescription}
                                onChange={e => setNewDescription(e.target.value)}
                                onBlur={e => {
                                    e.target = e.target.parentElement.parentElement; // set target to the form
                                    handleSubmit(e);
                                    }
                                }
                                type="text"
                                id="description"
                                placeholder={product.description}
                            />
                        </div>

                        {/* input for smallestAmount */}
                        <label htmlFor="smallestAmount" className="control-label">Smallest Amount: {product.smallestAmount}</label>
                        <div className="input-group mx-sm-3 mb-2">
                            <input className="form-control"
                                value={newSmallestAmount}
                                onChange={e => setNewSmallestAmount(e.target.value)}
                                onBlur={e => {
                                    e.target = e.target.parentElement.parentElement; // set target to the form
                                    handleSubmit(e);
                                    }
                                }
                                type="number"
                                step="1"
                                id="smallestAmount"
                                placeholder={product.smallestAmount}
                            />
                        </div>

                        {/* input for packaging types */}
                        <input type='hidden' value={product.packagingId} name='packagingId'></input>
                        <label htmlFor="amount" className="control-label">Packaging Type: {product.packagingName}</label>
                        <div className="input-group mx-sm-3 mb-2">
                            <select
                                name='packaging'
                                id='packaging'
                                required
                                value={selectedPackaging}
                                className='form-control'
                                onChange={(e) => {
                                    setSelectedPackaging(e.target.value);
                                    e.target = e.target.parentElement.parentElement;
                                    handleSubmit(e);
                                    }
                                }
                            >
                                {packagingInfo.map(p => {
                                    return (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        {/* input for allergens */}
                        <label htmlFor="amount" className="control-label">Allergens:</label>
                        <div className="input-group mx-sm-3 mb-2">
                            <div className='row'>
                                {allergyInfo.map(a => {
                                    return (
                                        <div key={a.id} className="col-xl-3 col-md-4 col-sm-6 col-xs-12">
                                            <input type="checkbox" className="btn-check" id={a.id} autoComplete="off" checked={selectedAllergens?.includes(a.id)} readOnly={true} />
                                            <label
                                                className="btn w-100 btn-outline-secondary mb-1"
                                                htmlFor={a.id}
                                                onClick={() => {
                                                    handleAllergyChange(a.id);
                                                    //handleSubmit(e);
                                                    }
                                                }
                                                onBlur={e => {
                                                    e.target = e.target.parentElement.parentElement.parentElement.parentElement; // set target to the form
                                                    handleSubmit(e);
                                                    }
                                                }
                                            >{a.name}</label><br></br>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* input for file */}
                        {isNewProduct && // only show new image upload for new images
                        <>
                            <label htmlFor="amount" className="control-label">Image:</label>
                            <div className="input-group mx-sm-3 mb-2">
                                <input
                                    type='file'
                                    name='image'
                                    inputProps={{ accept: 'image/*' }}
                                    required
                                    onChange={handleImage}/>
                            </div>
                        </>
                        }
                        <input ref={submitButton} className="d-none" type="submit" value="Submit" />
                    </form>
                </div>
            }
        </div>
    );
}

export default SelectedProduct;