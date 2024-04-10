const NewItemModal = ({modalId, modalTitle, renderContent, cancelButtonRef, onConfirm}) => {
    return (
        <div className="modal" id={modalId} tabIndex="-1" role="dialog" aria-labelledby="newModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg mr-5" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="newModalLabel">{modalTitle}</h5>
                        </div>
                        <div className="modal-body mr-5">
                            {renderContent()}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" ref={cancelButtonRef}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={onConfirm}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default NewItemModal;