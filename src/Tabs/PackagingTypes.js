import { useEffect, useState, useRef } from "react";
import ItemList from "../Components/ItemList";
import ConfirmDeleteModal from "../Components/ConfirmDeleteModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPackagingTypes, postPackagingType, putPackagingType } from "../api/packagingtypes";
import '../assets/form.css'
import NewItemModal from "../Components/NewItemModal";

// renders packaging types and the active packaging type if one is selected
const PackagingTypes = () => {
    // Query Client used to force a refetch after any changes (PUT/POST/DELETE) are made
    const queryClient = useQueryClient();
    // GET methods
    const {status: packagingStatus, error: packagingError, data: packagingInfo} = useQuery({
        queryKey: ['packaging'],
        queryFn: getPackagingTypes,
    })

    // PUT/POST
    const postPackagingMutation = useMutation({
        mutationFn: postPackagingType,
        onSuccess: () => {
            queryClient.refetchQueries({queryKey: ['packaging']})
        },
    })

    const putPackagingMutation = useMutation({
        mutationFn: putPackagingType,
        onSuccess: () => {
            queryClient.refetchQueries({queryKey: ['packaging']})
        },
    })

    // state keeping track of the active packaging
    const [activePackaging, setActivePackaging] = useState(0);

    // state to track value of input to the edit field for a packaging type
    const [newName, setNewName] = useState("");

    // effect to reset all form fields when active product changes
    useEffect(() => {
        if(activePackaging > 0) {
            var p = packagingInfo?.find(p => p.id == activePackaging)
            setNewName(p.name);
        } else {
            setNewName("");
        }
    }, [activePackaging]);

    // reference to the cancel button used to close delete modal
    const confirmDeleteCancelButton = useRef(null);
    const newPackagingCancelButton = useRef(null);

    // function defining behavior for modal onclicking confirmation button (not implemented)
    // sent to the delete modal
    function onDeleteModalConfirm() {
        //const pid = products.find(p => p.id == activeProduct).id;
        //sendDeleteProduct(pid);
        //setActiveProduct(0);

        confirmDeleteCancelButton.current.click(); // close modal
    }

    // function which sends a PUT request to DB to update packaging type
    // e   - event which was triggered
    async function updatePackaging(e) {
        e.preventDefault();
        const id = e.target.id.value;
        const name = e.target.name.value;

        const packagingJSON = JSON.stringify({ 'id' : id, 'name' : name }); // make it JSON
        console.log(packagingJSON);

        try {
            const entry = await putPackagingMutation.mutateAsync({id: id, packagingJSON: packagingJSON})
            console.log(entry)
        }
        catch (err) {
            console.log(err)
        }
    }

    // function which sends a POST request to DB to create a new packaging type
    async function postPackaging() {
        const packagingJSON = JSON.stringify({ 'name' : newName }); // make it JSON
        console.log(packagingJSON);

        try {
            const entry = await postPackagingMutation.mutateAsync(packagingJSON)
            console.log(entry)
        }
        catch (err) {
            console.log(err)
        }
    }

    var isLoading = [packagingStatus].some(value => value == 'pending')
    var LoadFailed = [packagingStatus].some(value => value == 'error')
    return (isLoading ? <div>Loading...</div> : (LoadFailed ? <div>Load Failed, Please try again.</div> :
        <>
            {/* modal for creating a new packaging type */}
            <NewItemModal 
                modalId={'newPackagingModal'}
                modalTitle={'New Packaging Type'}
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
                                        placeholder='New Packaging Type Name'
                                    />
                                </div>
                            </form>
                        </div>
                    )
                }}
                cancelButtonRef={newPackagingCancelButton}
                onConfirm={() => {
                    postPackaging();
                    newPackagingCancelButton.current.click(); // close modal
                }}
            />
            
            <ConfirmDeleteModal 
                modalId={'deletePackagingModal'}
                modalTitle={'Remove Packaging Confirmation'}
                divInfoId={'toDeletePackagingInfo'}
                cancelButtonRef={confirmDeleteCancelButton}
                onConfirm={onDeleteModalConfirm}
            />

            <button className="btn btn-primary m-3" onClick={() => setActivePackaging(0)} data-toggle="modal" data-target="#newPackagingModal">New Packaging Type</button>
            <div className="row">
                <div className="col-4">
                    <ItemList
                        items={packagingInfo}
                        displayParam={'name'}
                        setActive={setActivePackaging}
                        divInfoId={'toDeletePackagingInfo'}
                        modalId={'deletePackagingModal'}
                    />
                </div>
                <div className="col-6">
                    {activePackaging > 0 &&
                        <div>
                            <h4>Packaging Type Info</h4>
                            <form className="form-inline" onSubmit={e => updatePackaging(e)} style={{"paddingRight": "5%"}}>
                                <input type="hidden" value={activePackaging} id="id" />
                                {/* input for name */}
                                <div className="input-group mx-sm-3 mb-2">
                                    <div className="input-group-prepend input-group-text form-begin-tag">Name</div>
                                    <input className="form-control"
                                        value={newName}
                                        onChange={e => setNewName(e.target.value)}
                                        onBlur={e => {
                                            e.target = e.target.parentElement.parentElement; // set target to the form
                                            updatePackaging(e);
                                            }
                                        }
                                        type="text"
                                        id="name"
                                        placeholder={packagingInfo.find(p => p.id == activePackaging)?.name}
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

export default PackagingTypes;