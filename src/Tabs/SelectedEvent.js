import React from "react";
import '../assets/form.css'
import TextInput from "../Components/Form/TextInput";
import TextArea from "../Components/Form/TextArea";
import NumberInput from "../Components/Form/NumberInput";
import TimeInput from "../Components/Form/TimeInput";
import DateInput from "../Components/Form/DateInput";
import PriceInput from "../Components/Form/PriceInput";

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
                    {!isNewEvent && <h4>Info for "{event.title}"</h4>}
                    <form className="form-inline" onSubmit={handleSubmit} style={{"paddingRight": "5%"}}>
                        <input className="d-none" type="submit" value="submit" />
                        <input type="hidden" value={event.id} id="eventId" />

                        {/* input for title */}
                        <TextInput 
                            label={'Title'}
                            value={newTitle}
                            onChange={e => setNewTitle(e.target.value)}
                            onBlur={e => {
                                e.target = e.target.parentElement.parentElement; // set target to the form
                                handleSubmit(e);
                                }
                            }
                            id={'title'}
                            placeholder={event.title}
                        />

                        {/* input for description */}
                        <TextArea
                            label={'Description'}
                            value={newDescription}
                            rows='3'
                            onChange={e => setNewDescription(e.target.value)}
                            onBlur={e => {
                                e.target = e.target.parentElement.parentElement; // set target to the form
                                handleSubmit(e);
                                }
                            }
                            type="text"
                            id="description"
                            placeholder={event.description}
                        />

                        {/* input for place */}
                        <TextInput 
                            label={'Place'}
                            value={newPlace}
                            onChange={e => setNewPlace(e.target.value)}
                            onBlur={e => {
                                e.target = e.target.parentElement.parentElement; // set target to the form
                                handleSubmit(e);
                                }
                            }
                            id={'place'}
                            placeholder={event.place}
                        />

                        {/* input for price */}
                        <PriceInput 
                            label={'Price'}
                            value={newPrice}
                            onChange={e => {
                                const value = e.target.value;
                                const check = new RegExp('^\\d*(,\\d?\\d?)?$').test(value)
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
                            id={'price'}
                            placeholder={event.price}
                        />

                        {/* input for date */}
                        <DateInput 
                            label={'Date'}
                            value={newDate}
                            onChange={e => setNewDate(e.target.value)}
                            onBlur={e => {
                                e.target = e.target.parentElement.parentElement; // set target to the form
                                handleSubmit(e);
                                }
                            }
                            id={'date'}
                            placeholder={event.date}
                        />
                        
                        {/* input for start time */}
                        <TimeInput 
                            label={'Start Time'}
                            value={newStartTime}
                            onChange={e => setNewStartTime(e.target.value)}
                            onBlur={e => {
                                e.target = e.target.parentElement.parentElement; // set target to the form
                                handleSubmit(e);
                                }
                            }
                            step={'1'}
                            id={'startTime'}
                            placeholder={event.startTime}
                        />

                        {/* input for end time */}
                        <TimeInput 
                            label={'End Time'}
                            value={newEndTime}
                            onChange={e => setNewEndTime(e.target.value)}
                            onBlur={e => {
                                e.target = e.target.parentElement.parentElement; // set target to the form
                                handleSubmit(e);
                                }
                            }
                            step={'1'}
                            id={'endTime'}
                            placeholder={event.endTime}
                        />

                        {/* input for max participants */}
                        <NumberInput 
                            label={'Capacity'}
                            value={newMaxParticipants}
                            onChange={e => setNewMaxParticipants(e.target.value)}
                            onBlur={e => {
                                e.target = e.target.parentElement.parentElement; // set target to the form
                                handleSubmit(e);
                                }
                            }
                            step={'1'}
                            id={'maxParticipants'}
                            placeholder={event.maxParticipants}
                        />
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