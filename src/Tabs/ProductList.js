import { useEffect, useRef, useState } from "react";
import SelectedProduct from "./SelectedProduct";
import '../assets/modal.css'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {getProducts, postProduct, putProduct, getIngredientTypes} from '../api/products'
import {getPackagingTypes} from '../api/packagingtypes'
import { getAllergies } from "../api/allergies";
import { postImage } from "../api/imageobjs";
import ConfirmDeleteModal from "../Components/ConfirmDeleteModal";
import ItemList from "../Components/ItemList";
import NewItemModal from "../Components/NewItemModal";

// renders the list of products and the active user if one is selected
const ProductList = () => {
    // Query Client used to force a refetch after any changes (PUT/POST/DELETE) are made
    const queryClient = useQueryClient();
    // GET methods
    const {status: productStatus, error: productError, data: products} = useQuery({
        queryKey: ['products'],
        queryFn: getProducts,
    })
    const {status: packagingStatus, error: packagingError, data: packagingInfo} = useQuery({
        queryKey: ['packaging'],
        queryFn: getPackagingTypes,
    })
    const {status: allergyStatus, error: allergyError, data: allergyInfo} = useQuery({
        queryKey: ['allergies'],
        queryFn: getAllergies,
    })
    const {status: ingredientStatus, error: ingredientError, data: ingredientTypes} = useQuery({
        queryKey: ['ingredients'],
        queryFn: getIngredientTypes,
    })

    //POST/PUT/DELETE
    const imageMutation = useMutation({
        mutationFn: postImage,
    })

    const postProductMutation = useMutation({
        mutationFn: postProduct,
        onSuccess: async (data) => {
            await queryClient.refetchQueries({queryKey: ['products']})
            var result = await data.json()
            setActiveProduct(result.id)
        },
    })

    const putProductMutation = useMutation({
        mutationFn: putProduct,
        onSuccess: () => {
            queryClient.refetchQueries({queryKey: ['products']})
        },
    })

    // state keeping track of the active product
    const [activeProduct, setActiveProduct] = useState(0);

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
        if(activeProduct > 0) {
            var p = products?.find(p => p.id == activeProduct)
            setNewName(p.name);
            setNewPrice(String(p.price).replace('.',','));
            setNewAmount(p.amount);
            setNewCalories(p.calories);
            setNewSmallestAmount(p.smallestAmount);
            setNewDescription(p.description);
            var type = p ? p.ingredientType : 'milliliter'; // sets SelectedType to the product's current value
            setSelectedType(type);
            var packaging = p? p.packagingId : 1; // sets SelectedPackaging to the product's current value
            setSelectedPackaging(packaging);
            var allergens = p?.allergies // sets SelectedAllergens to the ids of the product's allergies
            setSelectedAllergens(allergens ? allergens.map(a => a.id) : []);
        }
    }, [activeProduct]);

    // function which updates products state (called when info is changed in SelectedProduct)
    // pid   - id of the product to be changed
    function editProduct(pid) {
        var p = products?.find(p => p.id == pid)
        p = updateProductValues(p)
        //products = changedProducts; // update products value
        updateProduct(pid, p); // update product with PUT
    }

    // function which updates products state (called when info is changed in SelectedProduct)
    // product   - product to update
    function updateProductValues(product) {
        product.name = newName;
        product.price = +newPrice.replace(',','.');  // + converts to number
        product.amount = +newAmount;
        product.ingredientType = selectedType;
        product.packagingid = selectedPackaging;
        product.packagingName = packagingInfo.find(p => p.id == selectedPackaging).name;
        product.allergies = selectedAllergens.map(id => allergyInfo.find(a => a.id == id));
        product.calories = +newCalories;
        product.description = newDescription;
        product.smallestAmount = +newSmallestAmount;
        return product;
    }
        
    // function which sends updated product
    // pid   - id of the product (in products) to be sent
    async function updateProduct(pid, product) {
        const productJSON = JSON.stringify(product); // make it JSON
        console.log(productJSON);

        try {
            const entry = await putProductMutation.mutateAsync({id: pid, productJSON: productJSON})
            console.log(entry)
        }
        catch (err) {
            console.log(err)
        }
    }

    // function which adds a product to the list of products and also POSTs it to the database
    // product   - product to be added
    async function addProduct(product) {
        const {id, ...rest} = product; // separate id and rest of info
        const productJSON = JSON.stringify(rest); // make it JSON
        console.log(productJSON)

        try {
            const entry = await postProductMutation.mutateAsync(productJSON)
        }
        catch (err) {
            console.log(err)
            // return -1; // potentially return error
        }
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

    // function which converts an image to the correct format and sends it to the DB
    // returns image id of created imageObj
    async function createImage() {
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

            try {
                const entry = await imageMutation.mutateAsync(imgJSON)
                const result = await entry.json();
                return result;
            }
            catch (err) {
                console.log(err)
                // return -1; // potentially return error
            }
        }
    }

    // reference to the cancel button used to close new product modal
    const newProductCancelButton = useRef(null)

    // reference to the cancel button used to close delete modal
    const confirmDeleteCancelButton = useRef(null);

    // function which DELETES a product from DB (not implemented)
    function removeProduct(id) {
        console.log('fake deleting', id)
    }

    // function defining behavior for modal onclicking confirmation button
    // sent to the delete modal
    function onDeleteModalConfirm() {
        const pid = products.find(p => p.id == activeProduct).id;
        removeProduct(pid);
        setActiveProduct(0);

        confirmDeleteCancelButton.current.click(); // close modal
    }

    // function defining behavior for new item modal on clicking confirmation button
    // sent to the new item modal
    function onNewModalConfirm() {
        //make new product p with values from form
        var p = createNewProduct();
        p = updateProductValues(p, p.id, newName, newPrice,
            newAmount, selectedType, selectedPackaging, selectedAllergens,
            newCalories, newDescription, newSmallestAmount);
        createImage().then(imgId => {
            console.log(imgId);
            p.imageObjId = imgId;
            console.log(p);
            addProduct(p); // add product to list (also POSTs)
        })
        .catch(err => {
            console.log(err);
        });

        newProductCancelButton.current.click(); // close modal
    }

    var isLoading = [productStatus, ingredientStatus, allergyStatus, packagingStatus].some(value => value == 'pending')
    var LoadFailed = [productStatus, ingredientStatus, allergyStatus, packagingStatus].some(value => value == 'error')
    // return value (top line provides alternate divs in case loading is not done yet)
    return (isLoading ? <div>Loading...</div> : (LoadFailed ? <div>Load Failed, Please try again.</div> :
        <>
            {/* Modal component, renders modal when delete button is pressed */}
            <ConfirmDeleteModal 
                modalId={'deleteProductModal'}
                modalTitle={'Remove Product Confirmation'}
                divInfoId={'toDeleteProductInfo'}
                cancelButtonRef={confirmDeleteCancelButton}
                onConfirm={onDeleteModalConfirm}
            />

            {/* modal for creating a new product */}
            <NewItemModal 
                modalId={'newProductModal'}
                modalTitle={'New Product'}
                renderContent={() => {
                    return (
                        <SelectedProduct 
                            editProduct={(pid) => {}}
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
                            isNewProduct={true}
                        />
                    )
                }}
                cancelButtonRef={newProductCancelButton}
                onConfirm={onNewModalConfirm}
            />

            {/* new product button */}
            <button className="btn btn-primary m-3"
                onClick={() => { // onClick function sets all new value states to default values
                    setActiveProduct(0)
                    var p = createNewProduct()
                    setNewName(p.name);
                    setNewPrice(String(p.price).replace('.',','));
                    setNewAmount(p.amount);
                    setNewCalories(p.calories);
                    setNewSmallestAmount(p.smallestAmount);
                    setNewDescription(p.description);
                    setSelectedType(p.ingredientType);
                    setSelectedPackaging(p.packagingId);
                    setSelectedAllergens(p.allergies);
                }}
                data-toggle="modal"
                data-target="#newProductModal"
            >New Product</button>

            {/* actual list and detail */}
            <div className="container-fluid mb-5">
                <div className="row">
                    <div className="col-4">
                        <ItemList
                            items={products}
                            displayParam={'name'}
                            setActive={setActiveProduct}
                            divInfoId={'toDeleteProductInfo'}
                            modalId={'deleteProductModal'}
                        />
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
                                newCalories={newCalories} setNewCalories={setNewCalories}
                            />
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