import { useEffect, useState, useRef } from "react";
import SelectedComment from "./SelectedComment";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getComments, postComment, putComment } from "../api/comments";
import ConfirmDeleteModal from "../Components/ConfirmDeleteModal";
import ItemList from "../Components/ItemList";

// renders the list of comments and the active comment if one is selected (activeComment state lifted to parent so it can be used by other tabs)
// activecomment      - state tracking which comment is active
// setActiveComment   - function used to set the active comment
const CommentList = ({activeComment, setActiveComment}) => {
    // Query Client used to force a refetch after any changes (PUT/POST/DELETE) are made
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
        if (activeComment > 0) {
            const comment = comments.find(c => c.id == activeComment);
            setNewComment(comment ? comment.comment : "");
            setNewRating(comment ? comment.ratingValue : "");
        }
    }, [activeComment]);

    // function which updates comments state (called when info is changed in SelectedComment)
    // commentId        - id of the comment to be changed
    // updatedComment   - new comment text (if changed, otherwise previous value)
    // updatedRating    - new rating (if changed, otherwise previous value)
    function editComment(commentId, updatedComment, updatedRating) {
        const comment = comments.find(c => c.id == commentId); // find comment
        comment.comment = updatedComment;
        comment.ratingValue = +updatedRating;
        updateComment(comment);
    }

    // function which sends PUT request to update comment
    // cid   - id of the comment (in comments) to be sent
    async function updateComment(comment) {
        const commentJSON = JSON.stringify(comment); // make it JSON
        console.log(commentJSON);

        try {
            const entry = await putCommentMutation.mutateAsync({id: comment.userId, commentJSON: commentJSON})
            console.log(entry)
        }
        catch (err) {
            console.log(err)
        }
    }

    // function which sends a DELETE request to the server
    // cid   - id of the comment (in comments) to be sent
    function removeComment(cid) {
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
    }

    // reference to the cancel button used to close modal
    const cancelButton = useRef(null);

    // function defining behavior for modal onclicking confirmation button
    // sent to the delete modal
    function onModalConfirm() {
        const cid = comments.find(c => c.id == activeComment).id;
        removeComment(cid);
        setActiveComment(0);

        cancelButton.current.click(); // close modal
    }

    var isLoading = commentStatus == 'pending'
    var LoadFailed = commentStatus == 'error'
    return ( isLoading ? <div>Loading...</div> : (LoadFailed ? <div>Load Failed, Please try again.</div> :
        <>
            {/* Modal component, renders modal when delete button is pressed */}
            <ConfirmDeleteModal 
                modalId={'deleteCommentModal'}
                modalTitle={'Remove Comment Confirmation'}
                divInfoId={'toDeleteCommentInfo'}
                cancelButtonRef={cancelButton}
                onConfirm={onModalConfirm}
            />

            <div className="container-fluid mt-5">
                <div className="row">
                    <div className="col-4">
                        <ItemList
                            items={comments}
                            displayParam={'comment'}
                            setActive={setActiveComment}
                            divInfoId={'toDeleteCommentInfo'}
                            modalId={'deleteCommentModal'}
                        />
                    </div>
                    <div className="col-6">
                        <div>
                            {activeComment == 0 ? 
                                <></> :
                                <SelectedComment
                                    editComment={editComment}
                                    comment={comments.find(c => c.id == activeComment)}
                                    newComment={newComment} setNewComment={setNewComment}
                                    newRating={newRating} setNewRating={setNewRating}
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

export default CommentList;