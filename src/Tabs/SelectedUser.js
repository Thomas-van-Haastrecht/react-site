// renders edit form for the selected user as well as their info
// editUser       - function to change user (called when submitting form)
// user           - user info from users list (redundant since userInfo has this info as well)
// newName        - state of value in the Name edit field
// setNewName     - function to change newName state
// newEmail       - state of value in the Email edit field
// setNewEmail    - function to change newEmail state
// newCity        - state of value in the City edit field
// setNewCity     - function to change newCity state
// userInfo       - state which tracks userInfo (from GET request)
// isLoaded       - state which tracks whether GET request for UserInfo has completed
// loadFailed     - state which tracks whether GET request for UserInfo has failed

import { getCommentsByUser } from "../api/comments";
import { getUser } from "../api/users";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import '../assets/form.css'


// moveToRecipe   - function which sets active recipe and active tab in order to switch to the view of specified recipe
const SelectedUser = ({editUser, activeUser, newName, setNewName, newEmail, setNewEmail, newCity, setNewCity, moveToRecipe, moveToComment}) => {

    // GET methods
    const {status: userStatus, error: userError, data: userInfo} = useQuery({
        queryKey: ['users', activeUser],
        queryFn: () => getUser(activeUser),
    })

    const {status: commentStatus, error: commentError, data: comments} = useQuery({
        queryKey: ['userComments', activeUser],
        queryFn: () => getCommentsByUser(activeUser),
    })

    // function to handle submitting the form
    // e   - Event which was triggered (used to get html element and its contents, and to prevent a page reload)
    function handleSubmit(e) {
        e.preventDefault(); // prevent page reload

        const uid = e.target.uid.value;
        // if not empty, gets input from form, otherwise uses initial value (i.e. value is unchanged)
        const updatedName = e.target.name.value ? e.target.name.value : e.target.name.placeholder;
        const updatedEmail = e.target.email.value ? e.target.email.value : e.target.email.placeholder;
        const updatedCity = e.target.city.value ? e.target.city.value : e.target.city.placeholder;

        // call edit function so user gets new information
        editUser(uid, updatedName, updatedEmail, updatedCity);
        
        // reset form fields
        setNewName("");
        setNewEmail("");
        setNewCity("");
    }

    // return value (top line provides alternate divs in case loading is not done yet)
    // "user != null && " prevents loading anything if no user exists
    var isLoading = [userStatus, commentStatus].some(value => value == 'pending')
    var LoadFailed = [userStatus, commentStatus].some(value => value == 'error')
    return (
        <div>
            {(isLoading ? <div>Loading...</div> : (LoadFailed ? <div>Load Failed, Please try again.</div> :
                <div>
                    <h4>Info for "{userInfo.userFirstName}"</h4>
                    <form className="form-inline" onSubmit={handleSubmit}>
                        <input type="hidden" value={activeUser} id="uid" />

                        {/* input for name */}
                        <div className="input-group mx-sm-3 mb-2">
                            <div className="input-group-prepend input-group-text form-begin-tag">Name</div>
                            <input className="form-control"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                type="text"
                                id="name"
                                placeholder={userInfo.userFirstName}
                            />
                        </div>

                        {/* input for email */}
                        <div className="input-group mx-sm-3 mb-2">
                            <div className="input-group-prepend input-group-text form-begin-tag">Email</div>
                            <input className="form-control"
                                value={newEmail}
                                onChange={e => setNewEmail(e.target.value)}
                                type="text"
                                id="email"
                                placeholder={userInfo.userEmail}
                            />
                        </div>

                        {/* input for city */}
                        <div className="input-group mx-sm-3 mb-2">
                            <div className="input-group-prepend input-group-text form-begin-tag">City</div>
                            <input className="form-control"
                                value={newCity}
                                onChange={e => setNewCity(e.target.value)}
                                type="text"
                                id="city"
                                placeholder={userInfo.userCityOfResidence}
                            />
                        </div>
                    </form>
                    
                    {/* recipes, not fully implemented */}
                    <p>Recipes:</p>
                    <ul className="list-group">
                        {userInfo.recipes.map(recipe => {
                            return (
                                <a key={recipe.id} className="list-group-item link-primary" onClick={() => {moveToRecipe(recipe.id)}}>{recipe.title}</a>
                            )
                        })}
                    </ul>

                    {/* comments, not fully implemented */}
                    <p>Comments:</p>
                    <ul className="list-group">
                        {comments.map(comment => {
                            return (
                                <a key={comment.id} className="list-group-item link-primary" onClick={() => {moveToComment(comment.id)}}>{comment.comment}</a>
                            )
                        })}
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default SelectedUser;