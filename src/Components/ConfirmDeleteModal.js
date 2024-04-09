import '../assets/modal.css'

// renders a modal to give a pop-up before an item gets deleted
const ConfirmDeleteModal = ({modalId, modalTitle, divInfoId, cancelButtonRef, onConfirm}) => {
    return (
        <div className="modal" id={modalId} tabIndex="-1" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-sm mr-5" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="deleteModalLabel">{modalTitle}</h5>
                    </div>
                    <div className="modal-body mr-5" id={divInfoId}></div> {/* empty div used to show info once delete button is clicked */}
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal" ref={cancelButtonRef}>Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={onConfirm}>Remove</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDeleteModal;