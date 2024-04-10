import { useEffect, useRef, useState } from "react";
import SelectedUser from "./SelectedUser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser, getUsers, putUser } from "../api/users";
import ConfirmDeleteModal from "../Components/ConfirmDeleteModal";
import ItemList from "../Components/ItemList";

// renders the list of users and the active user if one is selected
// moveToComment   - function to switch to a comment
// moveToRecipe    - function to switch to a recipe
const UserList = ({moveToComment, moveToRecipe}) => {
    // reference to the cancel button used to close modal
    const cancelButton = useRef(null);
    // Query Client used to force a refetch after any changes (PUT/POST/DELETE) are made
    const queryClient = useQueryClient();
    // GET methods
    const {status: userStatus, error: userError, data: users} = useQuery({
        queryKey: ['users'],
        queryFn: getUsers,
    })

    // PUT/POST/DELETE
    const putUserMutation = useMutation({
        mutationFn: putUser,
        onSuccess: () => {
            queryClient.refetchQueries({queryKey: ['users']})
        },
    })

    const deleteUserMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: (data, id) => {
            queryClient.removeQueries({queryKey: ['users', id]})
            queryClient.refetchQueries({queryKey: ['users']})
        },
    })
    
    // states keeping track of the active user (used in SelectedUser) and whether GET requests are done and successful
    const [activeUser, setActiveUser] = useState(0);

    // effect which stores user info in local storage whenever users state is changed
    useEffect(() => {
        localStorage.setItem("USERS", JSON.stringify(users));
    }, [users]);



    // states to track values of input to the edit fields in selectedUser
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newCity, setNewCity] = useState("");

    // effect which resets input fields when activeUser changes
    useEffect(() => {
        if (activeUser > 0) {
            const user = users.find(u => u.id == activeUser);
            setNewName(user.firstName);
            setNewEmail(user.email);
            setNewCity(user.cityOfResidence);
        }
    }, [activeUser]);

    // function which updates users state (called when info is changed in SelectedUser)
    // uid            - id of the user to be changed
    function editUser(uid) {
        var user = users.find(u => u.id == uid)
        user.firstName = newName;
        user.email = newEmail;
        user.cityOfResidence = newCity;
        //setUsers(changedUsers);
        updateUser(uid, user); // update user with PUT
    }

    // function which sends updated user
    // uid   - id of the user (in users) to be sent
    async function updateUser(uid, user) {
        const userJSON = JSON.stringify(user); // make it JSON
        console.log(userJSON);

        try {
            const entry = await putUserMutation.mutateAsync({id: uid, userJSON: userJSON})
            console.log(entry)
        }
        catch (err) {
            console.log(err)
        }
    }

    // function which sends a DELETE request to the server
    // uid   - id of the user (in users) to be sent
    async function removeUser(uid) {
        try {
            const entry = await deleteUserMutation.mutateAsync(uid)
            console.log(entry)
        }
        catch (err) {
            console.log(err)
        }
    }

    // function defining behavior for modal onclicking confirmation button
    // sent to the delete modal
    function onModalConfirm() {
        const uid = users.find(u => u.id == activeUser).id;
        removeUser(uid);
        setActiveUser(0);

        cancelButton.current.click(); // close modal
    }

    var isLoading = [userStatus].some(value => value == 'pending')
    var LoadFailed = [userStatus].some(value => value == 'error')
    // return value (top line provides alternate divs in case loading is not done yet)
    return (isLoading ? <div>Loading...</div> : (LoadFailed ? <div>Load Failed, Please try again.</div> :
        <>
            {/* Modal component, renders modal when delete button is pressed */}
            <ConfirmDeleteModal 
                modalId={'deleteUserModal'}
                modalTitle={'Remove User Confirmation'}
                divInfoId={'toDeleteUserInfo'}
                cancelButtonRef={cancelButton}
                onConfirm={onModalConfirm}
            />

            {/* actual code, list of items and selected item */}
            <div className="container-fluid mt-5">
                <div className="row">
                    <div className="col-4">
                        <ItemList
                            items={users}
                            displayParam={'firstName'}
                            setActive={setActiveUser}
                            divInfoId={'toDeleteUserInfo'}
                            modalId={'deleteUserModal'}
                        />
                    </div>
                    <div className="col-6">
                        <div>
                            {activeUser > 0 &&
                                <SelectedUser 
                                    editUser={editUser}
                                    activeUser={activeUser}
                                    newName={newName} setNewName={setNewName}
                                    newEmail={newEmail} setNewEmail={setNewEmail}
                                    newCity={newCity} setNewCity={setNewCity}
                                    moveToRecipe={moveToRecipe} moveToComment={moveToComment}
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

export default UserList;