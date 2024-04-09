import { useState, useRef, useEffect } from "react";
import ItemList from "../Components/ItemList";
import ConfirmDeleteModal from "../Components/ConfirmDeleteModal";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getIngredientTypes, putIngredientType, postIngredientType } from "../api/products";

const IngredientTypes = () => {
    const queryClient = useQueryClient();
    //GET method
    const {status: ingredientStatus, error: ingredientError, data: ingredientTypes} = useQuery({
        queryKey: ['ingredients'],
        queryFn: getIngredientTypes,
    })

    // PUT/POST
    const postIngredientMutation = useMutation({
        mutationFn: postIngredientType,
        onSuccess: () => {
            queryClient.refetchQueries({queryKey: ['ingredients']})
        },
    })

    const putIngredientMutation = useMutation({
        mutationFn: putIngredientType,
        onSuccess: () => {
            queryClient.refetchQueries({queryKey: ['ingredients']})
        },
    })

    const [activeIngredient, setActiveIngredient] = useState(0);

    const [newName, setNewName] = useState("");

    // effect to reset all form fields when active product changes
    useEffect(() => {
        if(activeIngredient > 0) {
            const ingredients = ingredientTypes.map((i, index) => {return {'id': index+1, 'name': i}})
            var i = ingredients?.find(i => i.id == activeIngredient)
            setNewName(i.name);
        } else {
            setNewName("");
        }
    }, [activeIngredient]);

    // reference to the cancel button used to close delete modal
    const confirmDeleteCancelButton = useRef(null);
    const newIngredientTypeCancelButton = useRef(null);

    function onDeleteModalConfirm() {
        //const pid = products.find(p => p.id == activeProduct).id;
        //sendDeleteProduct(pid);
        //setActiveProduct(0);
        console.log(ingredientTypes)
        confirmDeleteCancelButton.current.click(); // close modal
    }

    async function updateIngredientType(e) {
        e.preventDefault();
        const id = e.target.id.value;
        const name = e.target.name.value;

        const ingredientJSON = JSON.stringify({ 'id' : id, 'name' : name }); // make it JSON
        console.log(ingredientJSON);

        try {
            const entry = await putIngredientMutation.mutateAsync({id: id, IngredientJSON: ingredientJSON})
            console.log(entry)
        }
        catch (err) {
            console.log(err)
        }
    }

    async function postIngredient() {
        const ingredientJSON = JSON.stringify({ 'name' : newName }); // make it JSON
        console.log(ingredientJSON);

        try {
            const entry = await postIngredientMutation.mutateAsync(ingredientJSON)
            console.log(entry)
        }
        catch (err) {
            console.log(err)
        }
    }

    var isLoading = [ingredientStatus].some(value => value == 'pending')
    var LoadFailed = [ingredientStatus].some(value => value == 'error')
    return (isLoading ? <div>Loading...</div> : (LoadFailed ? <div>Load Failed, Please try again.</div> :
        <>
            <div className="modal" id="newIngredientTypeModal" tabIndex="-1" role="dialog" aria-labelledby="newIngredientTypeModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg mr-5" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="newIngredientTypeModalLabel">New Ingredient Type</h5>
                        </div>
                        <div className="modal-body mr-5">
                            <div>
                                <form className="form-inline" onSubmit={e => e.preventDefault()} style={{"paddingRight": "5%"}}>
                                    {/* input for name */}
                                    <div className="input-group mx-sm-3 mb-2">
                                        <div className="input-group-prepend input-group-text form-begin-tag">Name</div>
                                        <input className="form-control"
                                            value={newName}
                                            onChange={e => setNewName(e.target.value)}
                                            type="text"
                                            id="name"
                                            placeholder='New Ingredient Type Name'
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" ref={newIngredientTypeCancelButton}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={() => {
                                postIngredient();

                                newIngredientTypeCancelButton.current.click(); // close modal
                                }
                            }>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDeleteModal 
                modalId={'deleteIngredientModal'}
                modalTitle={'Remove Ingredient Type Confirmation'}
                divInfoId={'toDeleteIngredientInfo'}
                cancelButtonRef={confirmDeleteCancelButton}
                onConfirm={onDeleteModalConfirm} />

            <button className="btn btn-primary m-3" onClick={() => setActiveIngredient(0)} data-toggle="modal" data-target="#newIngredientTypeModal">New Ingredient Type</button>
            <div className="row">
                <div className="col-4">
                    <ItemList
                        items={ingredientTypes.map((i, index) => {return {'id':index+1, 'name': i}})}
                        displayParam={'name'}
                        setActive={setActiveIngredient}
                        divInfoId={'toDeleteIngredientInfo'}
                        modalId={'deleteIngredientModal'} />
                </div>
                <div className="col-6">
                    {activeIngredient > 0 &&
                        <div>
                            <h4>Ingredient Type Info</h4>
                            <form className="form-inline" onSubmit={e => updateIngredientType(e)} style={{"paddingRight": "5%"}}>
                                <input type="hidden" value={activeIngredient} id="id" />
                                {/* input for name */}
                                <div className="input-group mx-sm-3 mb-2">
                                    <div className="input-group-prepend input-group-text form-begin-tag">Name</div>
                                    <input className="form-control"
                                        value={newName}
                                        onChange={e => setNewName(e.target.value)}
                                        onBlur={e => {
                                            e.target = e.target.parentElement.parentElement; // set target to the form
                                            updateIngredientType(e);
                                            }
                                        }
                                        type="text"
                                        id="name"
                                        placeholder={ingredientTypes.find(k => k.id == activeIngredient)?.name}
                                    />
                                </div>
                            </form>
                        </div>
                    }
                </div>
            </div>
        </>
        )
    );
}

export default IngredientTypes;