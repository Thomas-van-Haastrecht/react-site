import { useEffect, useRef, useState } from "react";
import SelectedUser from "./SelectedUser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser, getUsers, putUser } from "../api/users";
import ConfirmDeleteModal from "../Components/ConfirmDeleteModal";



// renders the list of users and the active user if one is selected
// handleTabChange   - function to switch to a different tab (used when clicking on a recipe made by a user)
// setActiveRecipe   - function used to set the active recipe (used when clicking on a recipe made by a user)
const UserList = ({handleTabChange, setActiveRecipe, setActiveComment}) => {

    // wrapper function to change to a recipe page (this way only one function needs to be passed down to SelectedUser)
    // i   - index of the recipe to be made active
    function moveToRecipe(i) {
        handleTabChange('Recipes')
        setActiveRecipe(i)
    }

    // wrapper function to change to a comment page (this way only one function needs to be passed down to SelectedUser)
    // i   - index of the comment to be made active
    function moveToComment(i) {
        handleTabChange('Comments')
        setActiveComment(i)
    }

    // reference to the cancel button used to close modal
    const cancelButton = useRef(null);

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
        onSuccess: () => {
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
        setNewName("");
        setNewEmail("");
        setNewCity("");
    }, [activeUser]);

    // function which updates users state (called when info is changed in SelectedUser)
    // uid            - id of the user to be changed
    // updatedName    - new name (if changed, otherwise previous value)
    // updatedEmail   - new email (if changed, otherwise previous value)
    // updatedCity    - new city (if changed, otherwise previous value)
    function editUser(uid, updatedName, updatedEmail, updatedCity) {
        var changedUsers = users.map(user => {
            if (user.id == uid) { // only edit the correct user
                user.firstName = updatedName;
                user.email = updatedEmail;
                user.cityOfResidence = updatedCity;
            }
            return user;
        })
        //setUsers(changedUsers);
        sendPutUser(uid); // update user with PUT
    }

    // function which sends updated user
    // uid   - id of the user (in users) to be sent
    async function sendPutUser(uid) {
        const user = users.find(u => u.id == uid); // find user
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
    async function sendDeleteUser(uid) {

        try {
            const entry = await deleteUserMutation.mutateAsync(uid)
            console.log(entry)
        }
        catch (err) {
            console.log(err)
        }
        return;

        const user = users.find(u => u.id == uid); // find user
        const userJSON = JSON.stringify(user); // make it JSON
        console.log(userJSON);

        fetch('https://localhost:7027/api/users/'+uid, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: userJSON,
        })
        .then(entry => {
            console.log(entry)
        })
        .catch( err => {
            console.log(err)
        })

        // setUsers(oldUsers => {
        //     return oldUsers.filter(u => u.id !== uid);
        // })
    }

    function onModalConfirm() {
        const uid = users.find(u => u.id == activeUser).id;
        sendDeleteUser(uid);
        setActiveUser(0);

        cancelButton.current.click(); // close modal
    }

    var isLoading = [userStatus].some(value => value == 'pending')
    var LoadFailed = [userStatus].some(value => value == 'error')
    // return value (top line provides alternate divs in case loading is not done yet)
    return (isLoading ? <div>Loading...</div> : (LoadFailed ? <div>Load Failed, Please try again.</div> :
        <>
            <ConfirmDeleteModal 
                modalId={'deleteUserModal'}
                modalTitle={'Remove User Confirmation'}
                divInfoId={'toDeleteUserInfo'}
                cancelButtonRef={cancelButton}
                onConfirm={onModalConfirm} />

            {/* actual code, list of items and selected item */}
            <div className="container-fluid mt-5">
                <div className="row">
                <div className="col-4">
                    <div className="list-group" id="list-tab" role="tablist">
                        {users.map( (user, index) => {
                            return (
                                <li key={user.id} className="list-group-item p-0 d-flex justify-content-between align-items-center" onClick={() => {setActiveUser(user.id)}}>
                                    <div className="align-items-center">
                                        <div className="ms-3">
                                            <span className="">{user.firstName}</span>
                                        </div>
                                    </div>
                                    <button
                                        className={"btn btn-danger bi bi-trash product-trash rounded-start-0" + (index > 0 ? " rounded-top-0" : "") + (index < users.length-1 ? " rounded-bottom-0" : " rounded-bottom-left-0")}
                                        onClick={() => {
                                            setActiveUser(user.id);
                                            document.getElementById("toDeleteUserInfo").textContent = user.firstName;
                                        }}
                                        data-toggle="modal"
                                        data-target="#deleteUserModal"
                                    ></button>
                                </li>
                                );
                            })
                        }
                    </div>
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
                                moveToRecipe={moveToRecipe} moveToComment={moveToComment} />
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