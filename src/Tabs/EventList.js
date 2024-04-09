import { useEffect, useState, useRef } from "react";
import SelectedEvent from "./SelectedEvent";
import { getEvents, postEvent, putEvent, deleteParticipant, deleteEvent } from "../api/events";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ConfirmDeleteModal from "../Components/ConfirmDeleteModal";
import ItemList from "../Components/ItemList";

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

    const deleteEventMutation = useMutation({
        mutationFn: deleteEvent,
        onSuccess: () => {
            queryClient.refetchQueries({queryKey: ['events']})
        },
    })

    const deleteParticipantMutation = useMutation({
        mutationFn: deleteParticipant,
        onSuccess: () => {
            queryClient.refetchQueries({queryKey: ['events']})
        },
    })

    // states keeping track of the active event
    const [activeEvent, setActiveEvent] = useState(0)

    // effect which resets input fields when activeComment changes
    useEffect(() => {
        if (activeEvent > 0) {
            const event = events.find(e => e.id == activeEvent);
            setNewTitle(event.title);
            setNewDescription(event.description);
            setNewPlace(event.place);
            setNewPrice(String(event.price).replace('.',','));
            setNewDate(event.date);
            setNewStartTime(event.startTime);
            setNewEndTime(event.endTime);
            setNewMaxParticipants(event.maxParticipants);
            setNewParticipants(event.eventParticipantName);
        }
    }, [activeEvent]);

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

    function editEvent(eventId, updatedTitle, updatedDescription, updatedPlace, updatedPrice, updatedDate, updatedStartTime, updatedEndTime, updatedMaxParticipants, updatedParticipants) {
        
        var event = events.find(e => e.id == eventId);

        event.title = updatedTitle;
        event.description = updatedDescription;
        event.place = updatedPlace;
        event.price = +updatedPrice.replace(',','.');
        event.startTime = updatedStartTime;
        event.endTime = updatedEndTime;
        event.date = updatedDate;
        event.maxParticipants = updatedMaxParticipants;
        event.eventParticipantName = updatedParticipants;
        //setEvents(changedEvents);
        updateEvent(eventId, event);
    }

    // function which sends updated event
    // eid     - id of the event (in events) to be sent
    // event   - event data to send with PUT
    async function updateEvent(eid, event) {
        const eventJSON = JSON.stringify(event); // make it JSON
        console.log(eventJSON);

        try {
            const entry = await putEventMutation.mutateAsync({id: eid, eventJSON: eventJSON})
            console.log(entry)
        }
        catch (err) {
            console.log(err)
        }
    }

    // function which removes an event
    // id   - id of the event to be removed
    async function removeEvent(id) {
        try {
            const entry = await deleteEventMutation.mutateAsync(id)
            console.log(entry)
        }
        catch (err) {
            console.log(err)
        }
    }

    // function which removes a participant from an event
    // eid     - id of the event
    // email   - email info of participant
    async function removeParticipant(eid, email) {
        const participantJSON = JSON.stringify(email); // make it JSON
        console.log(participantJSON);

        try {
            const entry = await deleteParticipantMutation.mutateAsync({id: eid, participantJSON: participantJSON})
            console.log(entry)
        }
        catch (err) {
            console.log(err)
        }
    }

    // reference to the cancel button used to close modal
    const cancelButton = useRef(null);

    function onModalConfirm() {
        const eid = events.find(e => e.id == activeEvent).id;
        removeEvent(eid);
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
                        <ItemList 
                            items={[...events].sort((a, b) => {return new Date(b.date)-new Date(a.date)})}
                            displayParam={'title'}
                            setActive={setActiveEvent}
                            divInfoId={'toDeleteEventInfo'}
                            modalId={'deleteEventModal'}
                            styling={true}
                            subject={(event) => {return Math.round((new Date(event.date) - Date.now()) / (24*60*60*1000))}}
                            condition={(datediff) => {return (datediff < 0 ? "bg-secondary text-white" : "")}} />
                    </div>
                    <div className="col-6">
                        <div>
                            {activeEvent == 0 ? 
                                <></> :
                                <SelectedEvent
                                    editEvent={editEvent}
                                    removeParticipant={removeParticipant}
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