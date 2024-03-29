import { useEffect, useState, useRef } from "react";
import SelectedComment from "./SelectedComment";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getComments, postComment, putComment } from "../api/comments";
import ConfirmDeleteModal from "../Components/ConfirmDeleteModal";

const CommentList = ({activeComment, setActiveComment}) => {
    const queryClient = useQueryClient();
    // GET method
    const {status: commentStatus, error: commentError, data: comments} = useQuery({
        queryKey: ['comments'],
        queryFn: getComments,
    })

    // POST/PUT/DELETE (can probably get rid of post comment - not used by admins)
    const postCommentMutation = useMutation({
        mutationFn: postComment,
        onSuccess: () => {
            queryClient.refetchQueries({queryKey: ['comments']})
        },
    })

    const putCommentMutation = useMutation({
        mutationFn: putComment,
        onSuccess: () => {
            queryClient.refetchQueries({queryKey: ['comments']})
        },
    })

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
        sendPutComment(commentId);
    }

    // function which sends PUT request to update comment
    // cid   - id of the comment (in comments) to be sent
    function sendPutComment(cid) {
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
    function sendDeleteComment(cid) {
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

        // setComments(oldComments => {
        //     return oldComments.filter(c => c.id !== cid);
        // })
    }

    // reference to the cancel button used to close modal
    const cancelButton = useRef(null);

    function onModalConfirm() {
        const cid = comments.find(c => c.id == activeComment).id;
        sendDeleteComment(cid);
        setActiveComment(0);

        cancelButton.current.click(); // close modal
    }

    var isLoading = commentStatus == 'pending'
    var LoadFailed = commentStatus == 'error'
    return ( isLoading ? <div>Loading...</div> : (LoadFailed ? <div>Load Failed, Please try again.</div> :
        <>
            <ConfirmDeleteModal 
                modalId={'deleteCommentModal'}
                modalTitle={'Remove Comment Confirmation'}
                divInfoId={'toDeleteCommentInfo'}
                cancelButtonRef={cancelButton}
                onConfirm={onModalConfirm} />

            <div className="container-fluid mt-5">
                <div className="row">
                <div className="col-4">
                    <div className="list-group" id="list-tab" role="tablist">
                        {comments.map( (comment, index) => {
                            return (
                                <li key={comment.id} className="list-group-item p-0 d-flex justify-content-between align-items-center" onClick={() => {setActiveComment(comment.id)}}>
                                    <div className="align-items-center">
                                        <div className="ms-3">
                                            <span className="">{comment.comment}</span>
                                        </div>
                                    </div>
                                    <button
                                        className={"btn btn-danger bi bi-trash product-trash rounded-start-0" + (index > 0 ? " rounded-top-0" : "") + (index < comments.length-1 ? " rounded-bottom-0" : " rounded-bottom-left-0")}
                                        onClick={() => {
                                            setActiveComment(comment.id);
                                            document.getElementById("toDeleteCommentInfo").textContent = comment.comment;
                                        }}
                                        data-toggle="modal"
                                        data-target="#deleteCommentModal"
                                    ></button>
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