import React from "react";
import '../assets/form.css'
import TextInput from "../Components/Form/TextInput";

// renders edit form for the selected recipe as well as its info
// editComment     - function to change comment (called when submitting form)
// comment         - comment info from comments list
// newComment      - state of value in the comment edit field
// setNewComment   - function to change newComment state
// newRating       - state of value in the ratingValue edit field (currently not implemented)
// setNewRating    - function to change newRating state
const SelectedComment = ({editComment, comment, newComment, setNewComment, newRating, setNewRating}) => {
    // function to handle submitting the form
    // e   - Event which was triggered (used to get html element and its contents, and to prevent a page reload)
    function handleSubmit(e, rating=comment.ratingValue) {
        e.preventDefault();
        
        const commentId = comment.id;
        // if not empty, gets input from form, otherwise uses initial value (i.e. value is unchanged)
        const updatedComment = e.target.comment.value ? e.target.comment.value : e.target.comment.placeholder;
        
        // call edit function so user gets new information
        editComment(commentId, updatedComment, rating);
        setNewComment(updatedComment);
    }

    // function which handles when existing rating is updated
    // e       - Event which was triggered (used to get html element and its contents, which in this case has been set to the form, and to prevent a page reload)
    // value   - Value of the new rating
    function handleRatingChange(e, value) {
        setNewRating(value);
        handleSubmit(e, value);
    }

    return (
        <div>
            {comment != null && // only show form if product is not null
                <div>
                    <h4>Info for Comment</h4>
                    <div>
                        Date Posted: {/* not implemented */}
                    </div>

                    <form className="form-inline" onSubmit={handleSubmit}>
                        <input type="hidden" value={comment.id} id="commentId" />

                        {/* input for comment */}
                        <TextInput 
                            label={'Text'}
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            onBlur={e => {
                                e.target = e.target.parentElement.parentElement; // set target to the form
                                handleSubmit(e);
                                }
                            }
                            id={'comment'}
                            placeholder={comment.comment}
                        />

                        <div id="rating-stars">
                            {[1,2,3,4,5].map(i => {
                                return (
                                    i <= comment.ratingValue ?
                                    <i key={i} 
                                        className="bi bi-star-fill large-star"
                                        onClick={e => {
                                            e.target = e.target.parentElement.parentElement; // set target to the form
                                            handleRatingChange(e, i);
                                        }
                                    }></i>
                                    :
                                    <i key={i}
                                        className="bi bi-star large-star"
                                        onClick={e => {
                                            e.target = e.target.parentElement.parentElement; // set target to the form
                                            handleRatingChange(e, i);
                                        }
                                    }></i>
                                )
                            })}
                        </div>
                    </form>

                </div>
            }
        </div>
    );
}

export default SelectedComment;