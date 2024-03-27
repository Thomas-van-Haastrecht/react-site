import { useEffect, useState } from "react";
import SelectedComment from "./SelectedComment";

const CommentList = ({fetchData, activeComment, setActiveComment}) => {
    // state keeping track of the list of comments
    const [comments, setComments] = useState([])

    const [isLoaded, setLoaded] = useState(false)
    const [LoadFailed, setLoadFailed] = useState(false)

    // effect which runs on page load and calls the fetchData function to retrieve product list
    useEffect( () => {
        /// Create an async function within the useEffect hook
        const fetch = async(urls) => {
            await Promise.all(urls.map(url => fetchData(url)))
            .then(result => {
                console.log(result)
                setComments(result[0])
            })
            .catch( err => {
                console.log(err)
                setLoadFailed(true)
            })
            setLoaded(true)
        }
        /// Call the function
        fetch(['https://localhost:7027/api/comments'])
    }, [])

    // states to track values of input to the edit fields in selectedComment
    const [newComment, setNewComment] = useState("");
    const [newRating, setNewRating] = useState("");

    // effect which resets input fields when activeComment changes
    useEffect(() => {
        setNewComment("");
        setNewRating("");
    }, [activeComment]);

    // function which updates comments state (called when info is changed in SelectedComment)
    // commentId        - id of the comment to be changed
    // updatedComment   - new comment text (if changed, otherwise previous value)
    // updatedRating    - new rating (if changed, otherwise previous value)
    function editComment(commentId, updatedComment, updatedRating) {
        var changedComments = comments.map(comment => {
            if (comment.id == commentId) {
                comment.comment = updatedComment;
                comment.ratingValue = +updatedRating;
            }
            return comment;
        })
        setComments(changedComments);
        putComment(commentId);
    }

    // function which sends PUT request to update comment
    // cid   - id of the comment (in comments) to be sent
    function putComment(cid) {
        const comment = comments.find(c => c.id == cid); // find comment
        const commentJSON = JSON.stringify(comment); // make it JSON
        console.log(commentJSON);

        fetch('https://localhost:7027/api/comments/users/'+comment.userId, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: commentJSON,
        })
        .then(entry => {
            console.log(entry)
        })
        .catch( err => {
            console.log(err)
        })
    }

    // function which sends a DELETE request to the server
    // uid   - id of the comment (in comments) to be sent
    function deleteComment(cid) {
        console.log(comments.find(c => c.id == cid))
        return;
        const comment = comments.find(c => c.id == cid); // find user
        const commentJSON = JSON.stringify(comment); // make it JSON
        console.log(commentJSON);

        fetch('https://localhost:7027/api/comments/'+cid, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: commentJSON,
        })
        .then(entry => {
            console.log(entry)
        })
        .catch( err => {
            console.log(err)
        })

        setComments(oldComments => {
            return oldComments.filter(c => c.id !== cid);
        })
    }

    return ( !isLoaded ? <div>Loading...</div> : (LoadFailed ? <div>Load Failed, Please try again.</div> :
        <>
            <div className="container-fluid mt-5">
                <div className="row">
                <div className="col-4">
                    <div className="list-group" id="list-tab" role="tablist">
                        {comments.map( comment => {
                            return (
                                <li key={comment.id} className="list-group-item d-flex justify-content-between align-items-center" onClick={() => {setActiveComment(comment.id)}}>
                                    <div className="align-items-center">
                                        <div className="ms-3">
                                            <span className="">{comment.comment}</span>
                                        </div>
                                    </div>
                                    <button className="btn btn-danger bi bi-trash product-trash" onClick={() => {deleteComment(comment.id)}}></button>
                                </li>
                                );
                            })
                        }
                    </div>
                </div>
                <div className="col-6">
                    <div>
                        {activeComment == 0 ? 
                            <></> :
                            <SelectedComment
                                editComment={editComment}
                                comment={comments.find(c => c.id == activeComment)}
                                newComment={newComment} setNewComment={setNewComment}
                                newRating={newRating} setNewRating={setNewRating} />
                        }
                    </div>
                </div>
                </div>
            </div>
        </>
    )
    );
}

export default CommentList;