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

        if (new RegExp('^\d*(,\d\d?)?$').test(updatedPrice)) {
            editProduct(pid, updatedName, updatedPrice, updatedAmount, updatedType, updatedPackagingId, selectedAllergens, updatedCalories, updatedDescription, updatedSmallestAmount);
        }
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
                    <h4>Info for "{product.name}"</h4>
                    <form className="form-inline" onSubmit={e => handleSubmit(e)} style={{"paddingRight": "5%"}}>
                        <input type="hidden" value={product.id} id="pid" />

                        {/* input for name */}
                        <div className="input-group mx-sm-3 mb-2">
                            <div className="input-group-prepend input-group-text form-begin-tag">Name</div>
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
                        <div className="input-group mx-sm-3 mb-2">
                            <div className="input-group-prepend input-group-text form-begin-tag">Price</div>
                            <div className="input-group-prepend input-group-text bg-white">€</div>
                            <input className="form-control"
                                value={newPrice}
                                pattern="^\d*(,\d\d?)?$"
                                onChange={e => {
                                    const value = e.target.value;
                                    const check = new RegExp('^\d*,?\d*$').test(value)
                                    console.log(value, check)
                                    if (check) {
                                        setNewPrice(value)
                                    }
                                }}
                                onBlur={e => {
                                    e.target = e.target.parentElement.parentElement; // set target to the form
                                    handleSubmit(e);
                                }}
                                type="text"
                                step="any"
                                id="price"
                                placeholder={product.price}
                            />
                        </div>

                        {/* input for amount */}
                        <div className="input-group mx-sm-3 mb-2">
                            <div className="input-group-prepend input-group-text form-begin-tag">Amount</div>
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
                        <div className="input-group mx-sm-3 mb-2">
                            <div className="input-group-prepend input-group-text form-begin-tag">Calories</div>
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
                        <div className="input-group mx-sm-3 mb-2">
                            <div className="input-group-prepend input-group-text form-begin-tag">Description</div>
                            <textarea className="form-control"
                                value={newDescription}
                                rows='3'
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
                        <div className="input-group mx-sm-3 mb-2">
                            <div className="input-group-prepend input-group-text form-begin-tag">Minimum</div>
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
                        <div className="input-group mx-sm-3 mb-2">
                            <div className="input-group-prepend input-group-text form-begin-tag">Packaging</div>
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
                        <label htmlFor="" className="control-label mx-sm-3">Allergens:</label>
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
                            <div className="input-group mx-sm-3 mb-2">
                                <label htmlFor="image" className="input-group-prepend input-group-text form-begin-tag">Image</label>
                                <input className="form-control"
                                    type='file'
                                    id='image'
                                    name='image'
                                    inputprops={{ accept: 'image/*' }}
                                    required
                                    onChange={handleImage}/>
                            </div>
                            <img className={newImage ? 'img-fluid rounded w-50 border mx-sm-3 mb-2' : 'd-none'} alt="preview image" src={newImage ? URL.createObjectURL(newImage) : ''}/>
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