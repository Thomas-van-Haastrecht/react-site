import { useState, useRef, useEffect } from "react";
import ItemList from "../Components/ItemList";
import ConfirmDeleteModal from "../Components/ConfirmDeleteModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getKitchenTypes, postKitchenType, putKitchenType } from "../api/kitchentypes";
import NewItemModal from "../Components/NewItemModal";

// renders kitchen types and the active kitchen type if one is selected
const KitchenTypes = () => {
    // Query Client used to force a refetch after any changes (PUT/POST/DELETE) are made
    const queryClient = useQueryClient();
    // GET methods
    const {status: kitchenStatus, error: kitchenError, data: kitchenTypes} = useQuery({
        queryKey: ['kitchen'],
        queryFn: getKitchenTypes,
    })

    // PUT/POST
    const postKitchenMutation = useMutation({
        mutationFn: postKitchenType,
        onSuccess: () => {
            queryClient.refetchQueries({queryKey: ['kitchen']})
        },
    })

    const putKitchenMutation = useMutation({
        mutationFn: putKitchenType,
        onSuccess: () => {
            queryClient.refetchQueries({queryKey: ['kitchen']})
        },
    })

    // state keeping track of the active kitchen type
    const [activeKitchenType, setActiveKitchenType] = useState(0);

    // state to track value of input to the edit field for a kitchen type
    const [newName, setNewName] = useState("");

    // effect to reset all form fields when active product changes
    useEffect(() => {
        if(activeKitchenType > 0) {
            var k = kitchenTypes?.find(k => k.id == activeKitchenType)
            setNewName(k.name);
        } else {
            setNewName("");
        }
    }, [activeKitchenType]);

    // reference to the cancel button used to close delete modal
    const confirmDeleteCancelButton = useRef(null);
    const newKitchenTypeCancelButton = useRef(null);

    // function defining behavior for modal onclicking confirmation button (not implemented)
    // sent to the delete modal
    function onDeleteModalConfirm() {
        //const pid = products.find(p => p.id == activeProduct).id;
        //sendDeleteProduct(pid);
        //setActiveProduct(0);

        confirmDeleteCancelButton.current.click(); // close modal
    }

    // function which sends a PUT request to DB to update kitchen type
    // e   - event which was triggered
    async function updateKitchenType(e) {
        e.preventDefault();
        const id = e.target.id.value;
        const name = e.target.name.value;

        const kitchenJSON = JSON.stringify({ 'id' : id, 'name' : name }); // make it JSON
        console.log(kitchenJSON);

        try {
            const entry = await putKitchenMutation.mutateAsync({id: id, kitchenJSON: kitchenJSON})
            console.log(entry)
        }
        catch (err) {
            console.log(err)
        }
    }

    // function which sends a POST request to DB to create a new kitchen type
    async function postKitchen() {
        const kitchenJSON = JSON.stringify({ 'name' : newName }); // make it JSON
        console.log(kitchenJSON);

        try {
            const entry = await postKitchenMutation.mutateAsync(kitchenJSON)
            console.log(entry)
        }
        catch (err) {
            console.log(err)
        }
    }

    var isLoading = [kitchenStatus].some(value => value == 'pending')
    var LoadFailed = [kitchenStatus].some(value => value == 'error')
    return (isLoading ? <div>Loading...</div> : (LoadFailed ? <div>Load Failed, Please try again.</div> :
        <>
            {/* modal for creating a new packaging type */}
            <NewItemModal 
                modalId={'newKitchenTypeModal'}
                modalTitle={'New Kitchen Type'}
                renderContent={() => {
                    return (
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
                                        placeholder='New Kitchen Type Name'
                                    />
                                </div>
                            </form>
                        </div>
                    )
                }}
                cancelButtonRef={newKitchenTypeCancelButton}
                onConfirm={() => {
                    postKitchen();
                    newKitchenTypeCancelButton.current.click(); // close modal
                }}
            />

            <ConfirmDeleteModal 
                modalId={'deleteKitchenModal'}
                modalTitle={'Remove Kitchen Type Confirmation'}
                divInfoId={'toDeleteKitchenInfo'}
                cancelButtonRef={confirmDeleteCancelButton}
                onConfirm={onDeleteModalConfirm}
            />

            <button className="btn btn-primary m-3" onClick={() => setActiveKitchenType(0)} data-toggle="modal" data-target="#newKitchenTypeModal">New Kitchen Type</button>
            <div className="row">
                <div className="col-4">
                    <ItemList
                        items={kitchenTypes}
                        displayParam={'name'}
                        setActive={setActiveKitchenType}
                        divInfoId={'toDeleteKitchenInfo'}
                        modalId={'deleteKitchenModal'}
                    />
                </div>
                <div className="col-6">
                    {activeKitchenType > 0 &&
                        <div>
                            <h4>Kitchen Type Info</h4>
                            <form className="form-inline" onSubmit={e => updateKitchenType(e)} style={{"paddingRight": "5%"}}>
                                <input type="hidden" value={activeKitchenType} id="id" />
                                {/* input for name */}
                                <div className="input-group mx-sm-3 mb-2">
                                    <div className="input-group-prepend input-group-text form-begin-tag">Name</div>
                                    <input className="form-control"
                                        value={newName}
                                        onChange={e => setNewName(e.target.value)}
                                        onBlur={e => {
                                            e.target = e.target.parentElement.parentElement; // set target to the form
                                            updateKitchenType(e);
                                            }
                                        }
                                        type="text"
                                        id="name"
                                        placeholder={kitchenTypes.find(k => k.id == activeKitchenType)?.name}
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

export default KitchenTypes;