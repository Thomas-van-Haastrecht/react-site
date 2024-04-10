import React from "react";
import '../assets/form.css'

// renders edit form for the selected recipe as well as its info
// editEvent               - function to change event (called when submitting form)
// removeParticipant       - function to send DELETE request to remove a participant from an event
// event                   - event info from events list
// newTitle                - state of value in the title edit field
// setNewTitle             - function to change newTitle state
// newDescription          - state of value in the description edit field
// setNewDescription       - function to change newDescription state
// newPlace                - state of value in the place edit field
// setNewPlace             - function to change newPlace state
// newPrice                - state of value in the price edit field
// setNewPrice             - function to change newPrice state
// newStartTime            - state of value in the starttime edit field
// setNewStartTime         - function to change newStartTime state
// newEndTime              - state of value in the endtime edit field
// setNewEndTime           - function to change newEndTime state
// newDate                 - state of value in the date edit field
// setNewDate              - function to change newDate state
// newMaxParticipants      - state of value in the maxparticipants edit field
// setNewMaxParticipants   - function to change newMaxParticipants state
// newParticipants         - state of value in the participants edit field (not implemented)
// setNewParticipants      - function to change newParticipants state
// isNewEvent              - flag to tell if the function is called for a new event or not (removes participant list if true)
const SelectedEvent = ({editEvent, removeParticipant, event, newTitle, setNewTitle, newDescription,  setNewDescription,
    newPlace, setNewPlace, newPrice, setNewPrice, newStartTime, setNewStartTime, newEndTime, setNewEndTime,
    newDate, setNewDate, newMaxParticipants, setNewMaxParticipants, newParticipants, setNewParticipants, isNewEvent=false}) => {
    // function to handle submitting the form
    // e   - Event which was triggered (used to get html element and its contents, and to prevent a page reload)
    function handleSubmit(e) {
        e.preventDefault();
        
        const eventId = e.target.eventId.value;
        const updatedPrice = e.target.price.value ? e.target.price.value : e.target.price.placeholder;
        if (new RegExp('^\\d*(,\\d\\d?)?$').test(updatedPrice)) {
            editEvent(eventId)
        }
        // call edit function so user gets new information
        //editComment(recipeId, updatedName, newIngredients, newInstructions);

        // reset form fields
        // setNewName("");
    }

    return (
        <div>
            {event != null && // only show form if product is not null
                <div>
                    <h4>Info for "{event.title}"</h4>
                    <form className="form-inline" onSubmit={handleSubmit} style={{"paddingRight": "5%"}}>
                        <input className="d-none" type="submit" value="submit" />
                        <input type="hidden" value={event.id} id="eventId" />

                        {/* input for title */}
                        <div className="input-group mx-sm-3 mb-2">
                            <div className="input-group-prepend input-group-text form-begin-tag">Title</div>
                            <input className="form-control"
                                value={newTitle}
                                onChange={e => setNewTitle(e.target.value)}
                                type="text"
                                id="title"
                                placeholder={event.title}
                            />
                        </div>

                        {/* input for description */}
                        <div className="input-group mx-sm-3 mb-2">
                            <div className="input-group-prepend input-group-text form-begin-tag">Description</div>
                            <textarea className="form-control"
                                value={newDescription}
                                rows='3'
                                onChange={e => setNewDescription(e.target.value)}
                                type="text"
                                id="description"
                                placeholder={event.description}
                            />
                        </div>

                        {/* input for place */}
                        <div className="input-group mx-sm-3 mb-2">
                            <div className="input-group-prepend input-group-text form-begin-tag">Place</div>
                            <input className="form-control"
                                value={newPlace}
                                onChange={e => setNewPlace(e.target.value)}
                                type="text"
                                id="place"
                                placeholder={event.place}
                            />
                        </div>

                        {/* input for price */}
                        <div className="input-group mx-sm-3 mb-2">
                            <div className="input-group-prepend input-group-text form-begin-tag">Price</div>
                            <div className="input-group-prepend input-group-text bg-white">€</div>
                            <input className="form-control border-left-0"
                                value={newPrice}
                                pattern="^\d*(,\d\d?)?$"
                                onChange={e => {
                                    const value = e.target.value;
                                    const check = new RegExp('^\\d*,?\\d*$').test(value)
                                    console.log(value, check)
                                    if (check) {
                                        setNewPrice(value)}
                                    }
                                }
                                onBlur={e => {
                                    e.target = e.target.parentElement.parentElement; // set target to the form
                                    handleSubmit(e);
                                    }
                                }
                                type="text"
                                step="any"
                                id="price"
                                placeholder={event.price}
                            />
                        </div>

                        {/* input for date */}
                        <div className="input-group mx-sm-3 mb-2">
                            <div className="input-group-prepend input-group-text form-begin-tag">Date</div>
                            <input className="form-control"
                                value={newDate}
                                onChange={e => setNewDate(e.target.value)}
                                type="date"
                                id="date"
                                placeholder={event.date}
                            />
                        </div>
                        
                        {/* input for start time */}
                        <div className="input-group mx-sm-3 mb-2">
                            <div className="input-group-prepend input-group-text form-begin-tag">Start Time</div>
                            <input className="form-control"
                                value={newStartTime}
                                onChange={e => setNewStartTime(e.target.value)}
                                type="time"
                                step="1"
                                id="startTime"
                                placeholder={event.startTime}
                            />
                        </div>

                        {/* input for end time */}
                        <div className="input-group mx-sm-3 mb-2">
                        <div className="input-group-prepend input-group-text form-begin-tag">End Time</div>
                            <input className="form-control"
                                value={newEndTime}
                                onChange={e => setNewEndTime(e.target.value)}
                                type="time"
                                step="1"
                                id="endTime"
                                placeholder={event.endTime}
                            />
                        </div>

                        {/* input for max participants */}
                        <div className="input-group mx-sm-3 mb-2">
                            <div className="input-group-prepend input-group-text form-begin-tag">Capacity</div>
                            <input className="form-control"
                                value={newMaxParticipants}
                                onChange={e => setNewMaxParticipants(e.target.value)}
                                onBlur={e => {
                                    e.target = e.target.parentElement.parentElement; // set target to the form
                                    handleSubmit(e);
                                    }
                                }
                                type="number"
                                step="1"
                                id="maxParticipants"
                                placeholder={event.maxParticipants}
                            />
                        </div>
                    </form>

                    {!isNewEvent && 
                        <>
                            <p className="mx-sm-3 mt-3 mb-0">Participant List:</p>
                            <ul className="list-group">
                                {event.participants?.map(participant => {
                                    return (
                                        <div className="input-group mx-sm-3 mb-2">
                                            <div className="form-control input-group-text">{participant.name}</div>
                                            <div className="form-control input-group-text">{participant.email}</div>
                                            <button className="btn btn-danger bi bi-trash product-trash" onClick={() => {removeParticipant(event.id, participant.email)}}></button>
                                        </div>
                                    )
                                })}
                            </ul>
                        </>
                    }
                </div>
            }
        </div>
    );
}

export default SelectedEvent;