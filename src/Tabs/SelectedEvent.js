import { useEffect, useState } from "react";
import React from "react";
import '../assets/form.css'

// renders edit form for the selected recipe as well as its info
// editRecipe             - function to change recipe (called when submitting form)
// recipe                 - recipe info from recipes list
// newName                - state of value in the Name edit field
// setNewName             - function to change newName state
// newIngredients         - state of value in the Ingredients edit field (currently not implemented)
// setNewIngredients      - function to change newIngredients state
// newInstructions        - state of value in the Instructions edit field
// setNewInstructions     - function to change newInstructions state
const SelectedEvent = ({editEvent, event, newTitle, setNewTitle, newDescription,  setNewDescription,
    newPlace, setNewPlace, newPrice, setNewPrice, newStartTime, setNewStartTime, newEndTime, setNewEndTime,
    newDate, setNewDate, newMaxParticipants, setNewMaxParticipants, newParticipants, setNewParticipants}) => {
    console.log(event)
    // function to handle submitting the form
    // e   - Event which was triggered (used to get html element and its contents, and to prevent a page reload)
    function handleSubmit(e) {
        e.preventDefault();

        const eventId = e.target.eventId.value;
        // // if not empty, gets input from form, otherwise uses initial value (i.e. value is unchanged)
        const updatedTitle = e.target.title.value ? e.target.title.value : e.target.title.placeholder;
        const updatedDescription = e.target.description.value ? e.target.description.value : e.target.description.placeholder;
        const updatedPlace = e.target.place.value ? e.target.place.value : e.target.place.placeholder;
        const updatedPrice = e.target.price.value ? e.target.price.value : e.target.price.placeholder;
        const updatedDate = e.target.date.value ? e.target.date.value : e.target.date.placeholder;
        const updatedStartTime = e.target.startTime.value ? e.target.startTime.value : e.target.startTime.placeholder;
        const updatedEndTime = e.target.endTime.value ? e.target.endTime.value : e.target.endTime.placeholder;
        const updatedMaxParticipants = e.target.maxParticipants.value ? e.target.maxParticipants.value : e.target.maxParticipants.placeholder;

        editEvent(eventId, updatedTitle, updatedDescription, updatedPlace, updatedPrice, updatedDate, updatedStartTime, updatedEndTime, updatedMaxParticipants)
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
                    <form className="form-inline" onSubmit={handleSubmit}>
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
                            <input className="btn btn-secondary input-group-append" type="submit" value="Edit" />
                        </div>

                        {/* input for description */}
                        <div className="input-group mx-sm-3 mb-2">
                            <div className="input-group-prepend input-group-text form-begin-tag">Description</div>
                            <textarea className="form-control"
                                value={newDescription}
                                onChange={e => setNewDescription(e.target.value)}
                                type="text"
                                id="description"
                                placeholder={event.description}
                            />
                            <input className="btn btn-secondary input-group-append" type="submit" value="Edit" />
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
                            <input className="btn btn-secondary input-group-append" type="submit" value="Edit" />
                        </div>

                        {/* input for price */}
                        <div className="input-group mx-sm-3 mb-2">
                            <div className="input-group-prepend input-group-text form-begin-tag">Price</div>
                            <div className="input-group-prepend input-group-text bg-white">€</div>
                            <input className="form-control border-left-0"
                                value={newPrice}
                                onChange={e => setNewPrice(e.target.value)}
                                onBlur={e => {
                                    e.target = e.target.parentElement.parentElement; // set target to the form
                                    handleSubmit(e);
                                    }
                                }
                                type="number"
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
                            <input className="btn btn-secondary input-group-append" type="submit" value="Edit" />
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
                            <input className="btn btn-secondary input-group-append" type="submit" value="Edit" />
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
                            <input className="btn btn-secondary input-group-append" type="submit" value="Edit" />
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

                    {/* comments, not fully implemented */}
                    <p>Participant List:</p>
                    <ul className="list-group">
                        {event.eventParticipantName.map((participant, index) => {
                            return (
                                <a key={'paricipant_'+index} className="list-group-item link-primary">{participant}</a>
                            )
                        })}
                    </ul>

                </div>
            }
        </div>
    );
}

export default SelectedEvent;