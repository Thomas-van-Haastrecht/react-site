import { useEffect, useRef, useState } from "react";
import SelectedProduct from "./SelectedProduct";
import '../assets/modal.css'

// renders the list of products and the active user if one is selected
const ProductList = ({fetchData}) => {
    // states keeping track of the list of products and whether GET requests are done and successful
    const [products, setProducts] = useState([])
    const [packagingInfo, setPackagingInfo] = useState([])
    const [allergyInfo, setAllergyInfo] = useState([])
    const [ingredientTypes, setIngredientTypes] = useState([])
    const [isLoaded, setLoaded] = useState(false)
    const [LoadFailed, setLoadFailed] = useState(false)

    // state keeping track of the active product
    const [activeProduct, setActiveProduct] = useState(0);

    // effect which runs on page load and calls the fetchData function to retrieve product list
    useEffect( () => {
        /// Create an async function within the useEffect hook
        const fetch = async(urls) => {
            await Promise.all(urls.map(url => fetchData(url)))
            .then(result => {
                console.log(result)
                setProducts(result[0])
                setPackagingInfo(result[1])
                setAllergyInfo(result[2])
                setIngredientTypes(result[3])
            })
            .catch( err => {
                console.log(err)
                setLoadFailed(true)
            })
            setLoaded(true)
        }
        /// Call the function
        fetch(['https://localhost:7027/api/products', 'https://localhost:7027/api/packagingtypes', 'https://localhost:7027/api/allergies', 'https://localhost:7027/api/products/ingredienttypes'])
    }, [])

    // effect which stores product info in local storage whenever users state is changed
    useEffect(() => {
        localStorage.setItem("PRODUCTS", JSON.stringify(products));
    }, [products]);



    // states to track values of input to the edit fields in selectedProduct
    const [newName, setNewName] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [newAmount, setNewAmount] = useState("");
    const [newCalories, setNewCalories] = useState("");
    const [newSmallestAmount, setNewSmallestAmount] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [selectedType, setSelectedType] = useState(""); // from select
    const [selectedPackaging, setSelectedPackaging] = useState(""); // from select
    const [selectedAllergens, setSelectedAllergens] = useState([]);

    const [newImage, setNewImage] = useState('');


    // effect to reset all form fields when active product changes
    useEffect(() => {
        setNewName("");
        setNewPrice("");
        setNewAmount("");
        setNewCalories("");
        setNewSmallestAmount("");
        setNewDescription("");
        var p = products.find(p => p.id == activeProduct)
        var type = p ? p.ingredientType : 'milliliter'; // sets SelectedType to the product's current value
        setSelectedType(type);
        var packaging = p? p.packagingId : 1; // sets SelectedPackaging to the product's current value
        setSelectedPackaging(packaging);
        var allergens = p?.allergies // sets SelectedAllergens to the ids of the product's allergies
        setSelectedAllergens(allergens ? allergens.map(a => a.id) : []);
    }, [activeProduct]);

    // function which updates products state (called when info is changed in SelectedProduct)
    // pid                     - id of the product to be changed
    // updatedName             - new name (if changed, otherwise previous value)
    // updatedPrice            - new price (if changed, otherwise previous value)
    // updatedAmount           - new amount (if changed, otherwise previous value)
    // updatedType             - new ingredientType (if changed, otherwise previous value)
    // updatedPackagingId      - id of new packaging name (if changed, otherwise previous value)
    // updatedAllergens        - list of ids of new allergens (if changed, otherwise previous value)
    // updatedCalories         - new calories (if changed, otherwise previous value)
    // updatedDescription      - new description (if changed, otherwise previous value)
    // updatedSmallestAmount   - new smallestAmount (if changed, otherwise previous value)
    function editProduct(pid, updatedName, updatedPrice, updatedAmount, updatedType, updatedPackagingId, updatedAllergens, updatedCalories, updatedDescription, updatedSmallestAmount) {
        var changedProducts = products.map(product => {
            return updateProductValues(
                product, pid, updatedName, updatedPrice, updatedAmount, updatedType,
                updatedPackagingId, updatedAllergens, updatedCalories, updatedDescription, updatedSmallestAmount);
        })
        setProducts(changedProducts); // update products value
        putProduct(pid); // update product with PUT
    }

    // function which updates products state (called when info is changed in SelectedProduct)
    // product          - product to update
    // pid              - id of the product to be changed
    // pname            - new name (if changed, otherwise previous value)
    // price            - new price (if changed, otherwise previous value)
    // amount           - new amount (if changed, otherwise previous value)
    // type             - new ingredientType (if changed, otherwise previous value)
    // packagingId      - id of new packaging name (if changed, otherwise previous value)
    // allergens        - list of ids of new allergens (if changed, otherwise previous value)
    // calories         - new calories (if changed, otherwise previous value)
    // description      - new description (if changed, otherwise previous value)
    // smallestAmount   - new smallestAmount (if changed, otherwise previous value)
    function updateProductValues(product, pid, pname, price, amount, type, packagingId, allergens, calories, description, smallestAmount) {
            if (product.id == pid) { // only edit the correct product
                product.name = pname;
                product.price = +price;  // + converts to number
                product.amount = +amount;
                product.ingredientType = type;
                product.packagingid = packagingId;
                product.packagingName = packagingInfo.find(p => p.id == packagingId).name;
                product.allergies = allergens.map(id => allergyInfo.find(a => a.id == id));
                product.calories = +calories;
                product.description = description;
                product.smallestAmount = +smallestAmount;
            }
            return product;
    }

    // function which sends new product (need to remove id field, used to find newProduct in product list)
    // pid   - id of the product (in products) to be sent
    async function postProduct(product) {
        const {id, ...rest} = product; // separate id and rest of info
        const productJSON = JSON.stringify(rest); // make it JSON
        console.log(productJSON)

        const entry = await fetch('https://localhost:7027/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: productJSON,
        })
        const result = await entry.json();
        return result;
    }

    // function which sends updated product
    // pid   - id of the product (in products) to be sent
    function putProduct(pid) {
        const product = products.find(p => p.id == pid); // find product
        const productJSON = JSON.stringify(product); // make it JSON
        console.log(productJSON);

        fetch('https://localhost:7027/api/products/'+pid, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: productJSON,
        })
        .then(entry => {
            console.log(entry)
        })
        .catch( err => {
            console.log(err)
        })
    }

    // function which adds a new product with default values to the products list (only gets POSTed if user submits form after)
    function createNewProduct() {
        var newId = products.length+1;
        var p = {
            "allergies":[],
            "amount":1,
            "calories":1,
            "description":"Standard description",
            "id":newId,
            "imageObjId": 1,
            "ingredientType":"milliliter",
            "name":"New Product",
            "packagingId":1,
            "packagingName":"los",
            "price":0.01,
            "smallestAmount":1,
        }
        return p;
    }

    // function which adds a product to the list of products and also POSTs it to the database
    // p   - product to be added
    async function addProduct(p) {
        const newProduct = await postProduct(p); // send POST request to add product
        console.log(newProduct);
        setProducts(oldProducts => {
            var newProducts = [...oldProducts];
            newProducts.push(newProduct);
            return newProducts;
        });
        setActiveProduct(newProduct.id); // display new product form
    }

    // function which sends a DELETE request to the server
    // pid   - id of the product (in products) to be sent
    function deleteProduct(pid) {
        const product = products.find(p => p.id == pid); // find product
        const productJSON = JSON.stringify(product); // make it JSON
        console.log(productJSON);

        fetch('https://localhost:7027/api/products/'+pid, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: productJSON,
        })
        .then(entry => {
            console.log(entry)
        })
        .catch( err => {
            console.log(err)
        })
    }

    async function postImage() {
        if (newImage != '') {
            const [fileType, fileFormat] = newImage.type.split('/');
            console.log(fileType, fileFormat);
            if (fileType != 'image') { return;}

            const convertBase64 = (file) => {
                return new Promise((resolve, reject) => {
                    const fileReader = new FileReader();
                    fileReader.readAsDataURL(file)
                    fileReader.onload = () => {
                        resolve(fileReader.result);
                    }
                    fileReader.onerror = (error) => {
                        reject(error);
                    }
                })
            }

            const base64 = await convertBase64(newImage);
            const [meta, fileContent] = base64.split(',', 2);

            const img = {"ImageExtention": fileFormat,
                        "ImageContent": fileContent};
            
            const imgJSON = JSON.stringify(img)

            const entry = await fetch('https://localhost:7027/api/imageobj', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: imgJSON,
            })
            const result = await entry.json();
            console.log(result);
            return result;
        }
    }

    // reference to the modal close button, so the save changes button can also close
    const closeButton = useRef(null)

    // return value (top line provides alternate divs in case loading is not done yet)
    return (!isLoaded ? <div>Loading...</div> : (LoadFailed ? <div>Load Failed, Please try again.</div> :
        <>
            <div className="modal" id="newProductModal" tabIndex="-1" role="dialog" aria-labelledby="newProductModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg mr-5" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="newProductModalLabel">New Product</h5>
                        </div>
                        <div className="modal-body mr-5">
                            <SelectedProduct 
                            editProduct={(pid, updatedName, updatedPrice, updatedAmount, updatedType, updatedPackagingId, updatedAllergens, updatedCalories, updatedDescription, updatedSmallestAmount) => {}}
                            product={() => {return createNewProduct()}}
                            packagingInfo={packagingInfo}
                            allergyInfo={allergyInfo}
                            ingredientTypes={ingredientTypes}
                            newName={newName} setNewName={setNewName}
                            newPrice={newPrice} setNewPrice={setNewPrice}
                            newAmount={newAmount} setNewAmount={setNewAmount}
                            selectedType={selectedType} setSelectedType={setSelectedType}
                            selectedPackaging={selectedPackaging} setSelectedPackaging={setSelectedPackaging}
                            selectedAllergens={selectedAllergens} setSelectedAllergens={setSelectedAllergens}
                            newCalories={newCalories} setNewCalories={setNewCalories}
                            newDescription={newDescription} setNewDescription={setNewDescription}
                            newSmallestAmount={newSmallestAmount} setNewSmallestAmount={setNewSmallestAmount}
                            newImage={newImage} setNewImage={setNewImage}
                            isNewProduct={true} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" ref={closeButton}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={() => {
                                //make new product p with values from form
                                var p = createNewProduct();
                                p = updateProductValues(p, p.id, newName, newPrice,
                                    newAmount, selectedType, selectedPackaging, selectedAllergens,
                                    newCalories, newDescription, newSmallestAmount);
                                postImage().then(imgId => {
                                    console.log(imgId);
                                    p.imageObjId = imgId;
                                    console.log(p);
                                    addProduct(p); // add product to list (also POSTs)
                                })
                                .catch(err => {
                                    console.log(err);
                                });

                                closeButton.current.click(); // close modal
                                }
                            }>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>

            <button className="btn btn-primary m-3" onClick={() => setActiveProduct(0)} data-toggle="modal" data-target="#newProductModal">New Product</button>
            <div className="container-fluid mb-5">
                <div className="row">
                    <div className="col-4">
                        <ul className="list-group" id="list-tab" role="tablist">
                            {products.map( product => {
                                return (
                                    <li key={product.id} className="list-group-item d-flex justify-content-between align-items-center" onClick={() => {setActiveProduct(product.id)}}>
                                        <div className="align-items-center">
                                            <div className="ms-3">
                                                <span className="">{product.name}</span>
                                            </div>
                                        </div>
                                        <button className="btn btn-danger bi bi-trash product-trash" onClick={() => {deleteProduct(product.id)}}></button>
                                    </li>
                                    );
                                })
                            }
                        </ul>
                    </div>
                    <div className="col-6">
                        <div>
                            {(activeProduct == 0) ? // only show selectedProduct if there is an active product
                                <></> :
                                <SelectedProduct
                                editProduct={editProduct}
                                product={products.find(p => p.id == activeProduct)}
                                packagingInfo={packagingInfo}
                                allergyInfo={allergyInfo}
                                ingredientTypes={ingredientTypes}
                                newName={newName} setNewName={setNewName}
                                newPrice={newPrice} setNewPrice={setNewPrice}
                                newAmount={newAmount} setNewAmount={setNewAmount}
                                selectedType={selectedType} setSelectedType={setSelectedType}
                                selectedPackaging={selectedPackaging} setSelectedPackaging={setSelectedPackaging}
                                selectedAllergens={selectedAllergens} setSelectedAllergens={setSelectedAllergens}
                                newDescription={newDescription} setNewDescription={setNewDescription}
                                newSmallestAmount={newSmallestAmount} setNewSmallestAmount={setNewSmallestAmount}
                                newCalories={newCalories} setNewCalories={setNewCalories} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
        )
    );
}

export default ProductList;