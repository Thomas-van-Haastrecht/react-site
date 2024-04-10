import { getCommentsByUser } from "../api/comments";
import { getUser } from "../api/users";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import '../assets/form.css'
import { useEffect, useState } from "react";
import TextInput from "../Components/Form/TextInput";

// renders edit form for the selected user as well as their info
// editUser        - function to change user (called when submitting form)
// activeUser      - user info from users list
// newName         - state of value in the Name edit field
// setNewName      - function to change newName state
// newEmail        - state of value in the Email edit field
// setNewEmail     - function to change newEmail state
// newCity         - state of value in the City edit field
// setNewCity      - function to change newCity state
// moveToComment   - function which sets active comment and active tab in order to switch to the view of specified comment
// moveToRecipe    - function which sets active recipe and active tab in order to switch to the view of specified recipe
const SelectedUser = ({editUser, activeUser, newName, setNewName, newEmail, setNewEmail, newCity, setNewCity, moveToComment, moveToRecipe}) => {
    // state to track form errors
    const [formErrors, setFormErrors] = useState({'name': '', 'email': '', 'city': ''})

    // effect which resets form errors when user is changed
    useEffect(() => {
        setFormErrors({'name': '', 'email': '', 'city': ''})
    }, [activeUser])

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
        const errors = {
            'name': (e.target.name.value ? '' : 'Name cannot be empty'),
            'email': (e.target.email.value ? '' : 'Email cannot be empty'),
            'city': (e.target.city.value ? '' : 'City cannot be empty')
        };

        if (Object.values(errors).some(v => v != '')) {
            setFormErrors(errors);
        } else {
            // call edit function so user gets new information
            editUser(uid);
        }

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
                        <input className="d-none" type="submit" value="submit" />
                        <input type="hidden" value={activeUser} id="uid" />

                        {/* input for name */}
                        <div className="text-danger mx-sm-3">{formErrors.name}</div>
                        <TextInput 
                            label={'Name'}
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            onBlur={e => {
                                e.target = e.target.parentElement.parentElement; // set target to the form
                                handleSubmit(e);
                                }
                            }
                            id={'name'}
                            placeholder={userInfo.userFirstName}
                        />

                        {/* input for email */}
                        <div className="text-danger mx-sm-3">{formErrors.email}</div>
                        <TextInput 
                            label={'Email'}
                            value={newEmail}
                            onChange={e => setNewEmail(e.target.value)}
                            onBlur={e => {
                                e.target = e.target.parentElement.parentElement; // set target to the form
                                handleSubmit(e);
                                }
                            }
                            id={'email'}
                            placeholder={userInfo.userEmail}
                        />

                        {/* input for city */}
                        <div className="text-danger mx-sm-3">{formErrors.city}</div>
                        <TextInput 
                            label={'City'}
                            value={newCity}
                            onChange={e => setNewCity(e.target.value)}
                            onBlur={e => {
                                e.target = e.target.parentElement.parentElement; // set target to the form
                                handleSubmit(e);
                                }
                            }
                            id={'city'}
                            placeholder={userInfo.userCityOfResidence}
                        />
                    </form>
                    
                    {/* recipes, not fully implemented */}
                    <p className="mx-sm-3 mb-0">Recipes:</p>
                    <ul className="list-group mx-sm-3 mb-2">
                        {userInfo.recipes.map(recipe => {
                            return (
                                <a key={recipe.id} className="list-group-item link-primary" onClick={() => {moveToRecipe(recipe.id)}}>{recipe.title}</a>
                            )
                        })}
                    </ul>

                    {/* comments, not fully implemented */}
                    <p className="mx-sm-3 mb-0">Comments:</p>
                    <ul className="list-group mx-sm-3 mb-2">
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