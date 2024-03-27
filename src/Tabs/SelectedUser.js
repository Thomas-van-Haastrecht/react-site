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
// moveToRecipe   - function which sets active recipe and active tab in order to switch to the view of specified recipe
const SelectedUser = ({editUser, user, newName, setNewName, newEmail, setNewEmail, newCity, setNewCity, userInfo, isLoaded, loadFailed, moveToRecipe}) => {

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
    return (
        <div>
            {user != null && (!isLoaded ? <div>Loading...</div> : (loadFailed ? <div>Load Failed, Please try again.</div> :
                <div>
                    <h4>User Info</h4>
                    <form className="form-inline" onSubmit={handleSubmit}>
                        <input type="hidden" value={user.id} id="uid" />

                        {/* input for name */}
                        <label htmlFor="name" className="control-label">Name: {user.firstName}</label>
                        <div className="input-group mx-sm-3 mb-2">
                            <input className="form-control"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                type="text"
                                id="name"
                                placeholder={user.firstName}
                            />
                            <input className="btn btn-secondary input-group-append" type="submit" value="Edit" />
                        </div>

                        {/* input for email */}
                        <label htmlFor="email" className="control-label">Email: {user.email}</label>
                        <div className="input-group mx-sm-3 mb-2">
                            <input className="form-control"
                                value={newEmail}
                                onChange={e => setNewEmail(e.target.value)}
                                type="text"
                                id="email"
                                placeholder={user.email}
                            />
                            <input className="btn btn-secondary input-group-append" type="submit" value="Edit" />
                        </div>

                        {/* input for city */}
                        <label htmlFor="city" className="control-label">City: {user.cityOfResidence}</label>
                        <div className="input-group mx-sm-3 mb-2">
                            <input className="form-control"
                                value={newCity}
                                onChange={e => setNewCity(e.target.value)}
                                type="text"
                                id="city"
                                placeholder={user.cityOfResidence}
                            />
                            <input className="btn btn-secondary input-group-append" type="submit" value="Edit" />
                        </div>
                    </form>
                    {/* recipes, not fully implemented */}
                    <p>Recipes:</p>
                    <ul className="list-group">
                        {userInfo.favouriteRecipesTitles.map((recipe, index) => {
                            return (
                                <a key={index} className="list-group-item link-primary" onClick={() => {moveToRecipe(index)}}>{recipe}</a>
                            )
                        })}
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default SelectedUser;