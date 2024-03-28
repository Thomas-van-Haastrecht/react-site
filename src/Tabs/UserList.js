import { useEffect, useRef, useState } from "react";
import SelectedUser from "./SelectedUser";

// renders the list of users and the active user if one is selected
// handleTabChange   - function to switch to a different tab (used when clicking on a recipe made by a user)
// setActiveRecipe   - function used to set the active recipe (used when clicking on a recipe made by a user)
const UserList = ({fetchData, handleTabChange, setActiveRecipe}) => {

    // wrapper function to change to a recipe page (this way only one function needs to be passed down to SelectedUser)
    // i   - index of the recipe to be made active
    function moveToRecipe(i) {
        handleTabChange('Recipes')
        setActiveRecipe(i)
    }

    const cancelButton = useRef(null);

    // states keeping track of the list of users and whether GET requests are done and successful
    const [users, setUsers] = useState([])
    const [isLoaded, setLoaded] = useState(false)
    const [LoadFailed, setLoadFailed] = useState(false)
    
    // states keeping track of the active user (used in SelectedUser) and whether GET requests are done and successful
    const [activeUser, setActiveUser] = useState(0);
    const [activeUserInfo, setActiveUserInfo] = useState([]);
    const [activeUserComments, setActiveUserComments] = useState([]);
    const [isUserLoaded, setUserLoaded] = useState(false)
    const [userLoadFailed, setUserLoadFailed] = useState(false)


    // effect which runs on page load and calls the fetchData function to retrieve user list
    useEffect( () => {
        /// Create an async function within the useEffect hook
        const fetch = async(urls) => {
            await Promise.all(urls.map(url => fetchData(url)))
            .then(result => {
                console.log(result)
                setUsers(result[0])
            })
            .catch( err => {
                console.log(err)
                setLoadFailed(true)
            })
            setLoaded(true)
        }
        /// Call the function
        fetch(['https://localhost:7027/api/users'])
    }, [])

    // effect which runs when activeUser changes and calls fetchData function to retrieve specific userInfo
    useEffect( () => {
        /// Create an async function within the useEffect hook
        const fetch = async(urls) => {
            await Promise.all(urls.map(url => fetchData(url)))
            .then(result => {
                console.log(result)
                setActiveUserInfo(result[0])
                setActiveUserComments(result[1])
            })
            .catch( err => {
                console.log(err)
                setUserLoadFailed(true)
            })
            setUserLoaded(true)
        }
        /// Call the function
        if (activeUser > 0) {
            fetch(['https://localhost:7027/api/users/'+ activeUser, 'https://localhost:7027/api/comments/users/'+ activeUser])
        }
    }, [activeUser])

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
        setUsers(changedUsers);
        putUser(uid); // update user with PUT
    }

    // function which sends updated user
    // uid   - id of the user (in users) to be sent
    function putUser(uid) {
        const user = users.find(u => u.id == uid); // find user
        const userJSON = JSON.stringify(user); // make it JSON
        console.log(userJSON);

        fetch('https://localhost:7027/api/users/'+uid, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: userJSON,
        })
        .then(entry => {
            console.log(entry)
        })
        .catch( err => {
            console.log(err)
        })
    }

    // function which sends a DELETE request to the server
    // uid   - id of the user (in users) to be sent
    function deleteUser(uid) {
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

        setUsers(oldUsers => {
            return oldUsers.filter(u => u.id !== uid);
        })
    }


    // return value (top line provides alternate divs in case loading is not done yet)
    return (!isLoaded ? <div>Loading...</div> : (LoadFailed ? <div>Load Failed, Please try again.</div> :
        <>
            <div className="modal" id="deleteUserModal" tabIndex="-1" role="dialog" aria-labelledby="deleteUserModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-sm mr-5" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="deleteUserModalLabel">Remove User Confirmation</h5>
                        </div>
                        <div className="modal-body mr-5" id="toDeleteUserInfo">
                            {() => {return users.find(u => u.id == activeUser).firstName}}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" ref={cancelButton}>Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={() => {
                                const uid = users.find(u => u.id == activeUser).id;
                                deleteUser(uid);

                                cancelButton.current.click(); // close modal
                                }
                            }>Remove</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="container-fluid mt-5">
                <div className="row">
                <div className="col-4">
                    <div className="list-group" id="list-tab" role="tablist">
                        {users.map( user => {
                            return (
                                <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center" onClick={() => {setActiveUser(user.id)}}>
                                    <div className="align-items-center">
                                        <div className="ms-3">
                                            <span className="">{user.firstName}</span>
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-danger bi bi-trash product-trash"
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
                        <SelectedUser 
                            editUser={editUser}
                            user={users.find(u => u.id == activeUser)}
                            newName={newName} setNewName={setNewName}
                            newEmail={newEmail} setNewEmail={setNewEmail}
                            newCity={newCity} setNewCity={setNewCity}
                            userInfo={activeUserInfo} isLoaded={isUserLoaded} loadFailed={userLoadFailed}
                            moveToRecipe={moveToRecipe} />
                    </div>
                </div>
                </div>
            </div>
        </>
        )
    );
}

export default UserList;