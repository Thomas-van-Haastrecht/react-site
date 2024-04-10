import { useEffect, useRef, useState } from "react";
import TextInput from "../Components/Form/TextInput";
import NumberInput from "../Components/Form/NumberInput";
import TextArea from "../Components/Form/TextArea";
import PriceInput from "../Components/Form/PriceInput";

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
// isNewProduct           - flag to tell if the function is called for a new product or not (adds image input if true)
const SelectedProduct = ({
    editProduct, product, packagingInfo, allergyInfo, ingredientTypes, newName, setNewName, newPrice, setNewPrice,
    newAmount, setNewAmount, selectedType, setSelectedType, selectedPackaging, setSelectedPackaging,
    selectedAllergens, setSelectedAllergens, newCalories, setNewCalories, newDescription, setNewDescription,
    newSmallestAmount, setNewSmallestAmount, newImage, setNewImage, isNewProduct=false}) => {
    
    // references to track pressed buttons
    const submitButton = useRef(null);
    const buttonsPressed = useRef(false);
    
    // effect which sends updated info once selected allergens are updated
    useEffect(() => {
        if (buttonsPressed.current) {
            submitButton.current.click();
        }
    }, [selectedAllergens])

    // state to track form errors
    const [formErrors, setFormErrors] = useState({'name': '', 'price': '', 'amount': '', 'type': '', 'packaging': '', 'calories': '', 'description': '', 'smallest': '', 'image': ''})

    // effect which resets form errors when product is changed
    useEffect(() => {
        setFormErrors({'name': '', 'price': '', 'amount': '', 'type': '', 'packaging': '', 'calories': '', 'description': '', 'smallest': '', 'image': ''})
    }, [product])
    

    // function to handle submitting the form
    // e   - Event which was triggered (used to get html element and its contents, and to prevent a page reload)
    function handleSubmit(e) {
        e.preventDefault(); // prevent page reload

        const pid = e.target.pid.value;

        const errors = {
            'name': (e.target.name.value ? '' : 'Name cannot be empty'),
            'price': (new RegExp('^\\d*,?\\d*$').test(e.target.price.value) ? '' : 'Invalid price format'),
            'amount': (e.target.amount.value > 0 ? '' : 'Amount must be a positive number'),
            'type': (e.target.type.value ? '' : 'Invalid ingredient type'),
            'packaging': (e.target.packaging.value ? '' : 'Invalid packaging type'),
            'calories': (e.target.calories.value > 0 ? '' : 'Calorie count must be a positive number'),
            'description': (e.target.description.value ? '' : 'Description cannot be empty'),
            'smallest': (e.target.smallestAmount.value > 0 ? '' : 'Smallest amount must be a positive number'),
            'image': ((!isNewProduct || newImage) ? '' : 'Must upload an image'),
        };

        if (Object.values(errors).some(v => v != '')) {
            setFormErrors(errors);
        } else {
            // call edit function so user gets new information
            editProduct(pid);
        }
    }

    // function which handles when an allergy button is pressed
    // id   - id of allergen being clicked
    function handleAllergyChange(id) {
        buttonsPressed.current = true;
        var updatedAllergens = [...selectedAllergens];
        updatedAllergens.includes(id) ? updatedAllergens.splice(updatedAllergens.indexOf(id), 1) : updatedAllergens.push(id);
        setSelectedAllergens(updatedAllergens);
        //handleSubmit(e);
    }

    // function which handles when an image is selected or removed
    // e   - event triggered by interacting with the file input
    function handleImage(e) {
        const file = e.target.files[0];
        setNewImage(file ? file : '');
    }

    return (
        <div>
            {product != null && // only show form if product is not null
                <div>
                    {!isNewProduct && <h4>Info for "{product.name}"</h4>}
                    <form className="form-inline" onSubmit={e => handleSubmit(e)} style={{"paddingRight": "5%"}}>
                        <input type="hidden" value={product.id} id="pid" />

                        {/* input for name */}
                        <div className="text-danger mx-sm-3">{formErrors.name}</div>
                        <TextInput 
                            label={'Name'}
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            onBlur={e => {
                                e.target = e.target.parentElement.parentElement; // set target to the form
                                handleSubmit(e);
                                }
                            }
                            id={'name'}
                            placeholder={product.name}
                        />

                        {/* input for price */}
                        <div className="text-danger mx-sm-3">{formErrors.price}</div>
                        <PriceInput
                            label={'Price'}
                            value={newPrice}
                            onChange={e => {
                                const value = e.target.value;
                                const check = new RegExp('^\\d*(,\\d?\\d?)?$').test(value)
                                if (check) {
                                    setNewPrice(value)}
                                }
                            }
                            onBlur={e => {
                                e.target = e.target.parentElement.parentElement; // set target to the form
                                handleSubmit(e);
                                }
                            }
                            id={'price'}
                            placeholder={product.price}
                        />

                        {/* input for amount */}
                        <div className="text-danger mx-sm-3">{formErrors.amount}</div>
                        <div className="text-danger mx-sm-3">{formErrors.type}</div>
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
                        <div className="text-danger mx-sm-3">{formErrors.calories}</div>
                        <NumberInput 
                            label={'Calories'}
                            value={newCalories}
                            onChange={e => setNewCalories(e.target.value)}
                            onBlur={e => {
                                e.target = e.target.parentElement.parentElement; // set target to the form
                                handleSubmit(e);
                                }
                            }
                            step={'1'}
                            id={'calories'}
                            placeholder={product.calories}
                        />

                        {/* input for description */}
                        <div className="text-danger mx-sm-3">{formErrors.description}</div>
                        <TextArea 
                            label={'Description'}
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

                        {/* input for smallestAmount */}
                        <div className="text-danger mx-sm-3">{formErrors.smallest}</div>
                        <NumberInput 
                            label={'Minimum'}
                            value={newSmallestAmount}
                            onChange={e => setNewSmallestAmount(e.target.value)}
                            onBlur={e => {
                                e.target = e.target.parentElement.parentElement; // set target to the form
                                handleSubmit(e);
                                }
                            }
                            step={'1'}
                            id={'smallestAmount'}
                            placeholder={product.smallestAmount}
                        />

                        {/* input for packaging types */}
                        <div className="text-danger mx-sm-3">{formErrors.packaging}</div>
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
                        <div className="text-danger mx-sm-3">{formErrors.image}</div>
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