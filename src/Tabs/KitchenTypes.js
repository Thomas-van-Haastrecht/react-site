import { useState, useRef, useEffect } from "react";
import ItemList from "../Components/ItemList";
import ConfirmDeleteModal from "../Components/ConfirmDeleteModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getKitchenTypes, postKitchenType, putKitchenType } from "../api/kitchentypes";

const KitchenTypes = () => {
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

    const [activeKitchenType, setActiveKitchenType] = useState(0);

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

    function onDeleteModalConfirm() {
        //const pid = products.find(p => p.id == activeProduct).id;
        //sendDeleteProduct(pid);
        //setActiveProduct(0);

        confirmDeleteCancelButton.current.click(); // close modal
    }

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
            <div className="modal" id="newKitchenTypeModal" tabIndex="-1" role="dialog" aria-labelledby="newKitchenTypeModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg mr-5" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="newKitchenTypeModalLabel">New Kitchen Type</h5>
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
                                            placeholder='New Kitchen Type Name'
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" ref={newKitchenTypeCancelButton}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={() => {
                                postKitchen();

                                newKitchenTypeCancelButton.current.click(); // close modal
                                }
                            }>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDeleteModal 
                modalId={'deleteKitchenModal'}
                modalTitle={'Remove Kitchen Type Confirmation'}
                divInfoId={'toDeleteKitchenInfo'}
                cancelButtonRef={confirmDeleteCancelButton}
                onConfirm={onDeleteModalConfirm} />

            <button className="btn btn-primary m-3" onClick={() => setActiveKitchenType(0)} data-toggle="modal" data-target="#newKitchenTypeModal">New Kitchen Type</button>
            <div className="row">
                <div className="col-4">
                    <ItemList
                        items={kitchenTypes}
                        displayParam={'name'}
                        setActive={setActiveKitchenType}
                        divInfoId={'toDeleteKitchenInfo'}
                        modalId={'deleteKitchenModal'} />
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