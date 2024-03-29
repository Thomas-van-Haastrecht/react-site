import { useEffect, useState, useRef } from "react";
import SelectedEvent from "./SelectedEvent";
import { getEvents, postEvent, putEvent } from "../api/events";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ConfirmDeleteModal from "../Components/ConfirmDeleteModal";

const EventList = () => {
    const queryClient = useQueryClient();
    // GET method
    const {status: eventStatus, error: eventError, data: events} = useQuery({
        queryKey: ['events'],
        queryFn: getEvents,
    })

    // POST/PUT/DELETE
    const postEventMutation = useMutation({
        mutationFn: postEvent,
        onSuccess: () => {
            queryClient.refetchQueries({queryKey: ['events']})
        },
    })

    const putEventMutation = useMutation({
        mutationFn: putEvent,
        onSuccess: () => {
            queryClient.refetchQueries({queryKey: ['events']})
        },
    })

    // states keeping track of the active event
    const [activeEvent, setActiveEvent] = useState(0)

    // states to track values of input to the edit fields in selectedComment
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newPlace, setNewPlace] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [newStartTime, setNewStartTime] = useState("");
    const [newEndTime, setNewEndTime] = useState("");
    const [newDate, setNewDate] = useState("");
    const [newMaxParticipants, setNewMaxParticipants] = useState(0);
    const [newParticipants, setNewParticipants] = useState([]);

    // function which sends a DELETE request to the server
    // uid   - id of the comment (in comments) to be sent
    function deleteEvent(eid) {
        console.log(events.find(e => e.id == activeEvent))
        return;
        const event = events.find(e => e.id == eid); // find user
        const eventJSON = JSON.stringify(event); // make it JSON
        console.log(eventJSON);

        fetch('https://localhost:7027/api/events/'+eid, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: eventJSON,
        })
        .then(entry => {
            console.log(entry)
        })
        .catch( err => {
            console.log(err)
        })

        //setEvents(oldEvents => {
        //    return oldEvents.filter(e => e.id !== eid);
        //})
    }

    function editEvent(eventId, updatedTitle, updatedDescription, updatedPlace, updatedPrice, updatedStartTime, updatedEndTime, updatedDate, updatedMaxParticipants, updatedParticipants) {
        var changedEvents = events.map(event => {
            if (event.id == eventId) {
                event.title = updatedTitle;
                event.description = updatedDescription;
                event.place = updatedPlace;
                event.price = updatedPrice;
                event.startTime = updatedStartTime;
                event.endTime = updatedEndTime;
                event.date = updatedDate;
                event.maxParticipants = updatedMaxParticipants;
                event.eventParticipantName = updatedParticipants;
            }
            return event;
        })
        //setEvents(changedEvents);
        //putEvent(eventId);
    }

    function sendDeleteEvent(id) {
        console.log('fake deleting', id)
    }

    // reference to the cancel button used to close modal
    const cancelButton = useRef(null);

    function onModalConfirm() {
        const eid = events.find(e => e.id == activeEvent).id;
        sendDeleteEvent(eid);
        setActiveEvent(0);

        cancelButton.current.click(); // close modal
    }

    var isLoading = eventStatus == 'pending'
    var LoadFailed = eventStatus == 'error'
    return ( isLoading ? <div>Loading...</div> : (LoadFailed ? <div>Load Failed, Please try again.</div> :
        <>
            <ConfirmDeleteModal 
                modalId={'deleteEventModal'}
                modalTitle={'Remove Event Confirmation'}
                divInfoId={'toDeleteEventInfo'}
                cancelButtonRef={cancelButton}
                onConfirm={onModalConfirm} />

            <div className="container-fluid mt-5">
                <div className="row">
                <div className="col-4">
                    <div className="list-group" id="list-tab" role="tablist">
                        {events.map( (event, index) => {
                            return (
                                <li key={event.id} className="list-group-item p-0 d-flex justify-content-between align-items-center" onClick={() => {setActiveEvent(event.id)}}>
                                    <div className="align-items-center">
                                        <div className="ms-3">
                                            <span className="">{event.title}</span>
                                        </div>
                                    </div>
                                    <button
                                        className={"btn btn-danger bi bi-trash product-trash rounded-start-0" + (index > 0 ? " rounded-top-0" : "") + (index < events.length-1 ? " rounded-bottom-0" : " rounded-bottom-left-0")}
                                        onClick={() => {
                                            setActiveEvent(event.id);
                                            document.getElementById("toDeleteEventInfo").textContent = event.title;
                                        }}
                                        data-toggle="modal"
                                        data-target="#deleteEventModal"
                                    ></button>
                                </li>
                                );
                            })
                        }
                    </div>
                </div>
                <div className="col-6">
                    <div>
                        {activeEvent == 0 ? 
                            <></> :
                            <SelectedEvent
                                editEvent={editEvent}
                                event={events.find(e => e.id == activeEvent)}
                                newTitle={newTitle} setNewTitle={setNewTitle}
                                newDescription={newDescription} setNewDescription={setNewDescription}
                                newPlace={newPlace} setNewPlace={setNewPlace}
                                newPrice={newPrice} setNewPrice={setNewPrice}
                                newStartTime={newStartTime} setNewStartTime={setNewStartTime}
                                newEndTime={newEndTime} setNewEndTime={setNewEndTime}
                                newDate={newDate} setNewDate={setNewDate}
                                newMaxParticipants={newMaxParticipants} setNewMaxParticipants={setNewMaxParticipants}
                                newParticipants={newParticipants} setNewParticipants={setNewParticipants} />
                        }
                    </div>
                </div>
                </div>
            </div>
        </>
    )
    );
}

export default EventList;