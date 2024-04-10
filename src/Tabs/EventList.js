import { useEffect, useState, useRef } from "react";
import SelectedEvent from "./SelectedEvent";
import { getEvents, postEvent, putEvent, deleteParticipant, deleteEvent } from "../api/events";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ConfirmDeleteModal from "../Components/ConfirmDeleteModal";
import ItemList from "../Components/ItemList";
import NewItemModal from "../Components/NewItemModal";

// renders the list of events and the active event if one is selected
const EventList = () => {
    // Query Client used to force a refetch after any changes (PUT/POST/DELETE) are made
    const queryClient = useQueryClient();
    // GET method
    const {status: eventStatus, error: eventError, data: events} = useQuery({
        queryKey: ['events'],
        queryFn: getEvents,
    })

    // POST/PUT/DELETE
    const postEventMutation = useMutation({
        mutationFn: postEvent,
        onSuccess: async (data) => {
            await queryClient.refetchQueries({queryKey: ['events']})
            var result = await data.json()
            setActiveEvent(result.id)
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

    // function which changes an event and sends a PUT request to the server
    // eventId   - id of the event to be edited
    function editEvent(eventId) {
        var event = events.find(e => e.id == eventId);

        event = updateEventValues(event);
        //setEvents(changedEvents);
        updateEvent(eventId, event);
    }

    // function which sets all properties of an event to be those saved in the states of the new values
    // event   - event to update
    function updateEventValues(event) {
        event.title = newTitle;
        event.description = newDescription;
        event.place = newPlace;
        event.price = +newPrice.replace(',','.');
        event.startTime = newStartTime;
        event.endTime = newEndTime;
        event.date = newDate;
        event.maxParticipants = newMaxParticipants;
        event.participants = newParticipants;
        return event;
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
    const newEventCancelButton = useRef(null);

    // function defining behavior for delete modal on clicking confirmation button
    // sent to the delete modal
    function onDeleteModalConfirm() {
        const eid = events.find(e => e.id == activeEvent).id;
        removeEvent(eid);
        setActiveEvent(0);

        cancelButton.current.click(); // close modal
    }

    // function defining behavior for new item modal on clicking confirmation button
    // sent to the new item modal
    function onNewModalConfirm() {
        //make new event with values from form
        var event = createNewEvent();
        event = updateEventValues(event);
        addEvent(event);

        newEventCancelButton.current.click(); // close modal
    }

    // function to send a POST request to add an event to the DB
    // event   - event info to be sent to the DB
    async function addEvent(event) {
        const {id, ...rest} = event; // separate id and rest of info
        const eventJSON = JSON.stringify(rest); // make it JSON
        console.log(eventJSON)

        try {
            await postEventMutation.mutateAsync(eventJSON)
        }
        catch (err) {
            console.log(err)
            // return -1; // potentially return error
        }
    }

    // function which creates a default event used when showing the form for a new event
    function createNewEvent() {
        var e = {
            "id":0,
            "title":"Event",
            "description":"Description",
            "date":"2024-01-01",
            "startTime":"09:00:00",
            "endTime":"17:00:00",
            "participants":[],
            "place":"Nowhere",
            "price":0.01,
            "maxParticipants":0,
        }
        return e;
    }

    var isLoading = eventStatus == 'pending'
    var LoadFailed = eventStatus == 'error'
    return ( isLoading ? <div>Loading...</div> : (LoadFailed ? <div>Load Failed, Please try again.</div> :
        <>
            {/* modal component, renders modal when delete button is pressed */}
            <ConfirmDeleteModal 
                modalId={'deleteEventModal'}
                modalTitle={'Remove Event Confirmation'}
                divInfoId={'toDeleteEventInfo'}
                cancelButtonRef={cancelButton}
                onConfirm={onDeleteModalConfirm}
            />

            {/* modal for creating a new event */}
            <NewItemModal 
                modalId={'newEventModal'}
                modalTitle={'New Event'}
                renderContent={() => {
                    return (
                        <SelectedEvent
                            editEvent={(eventId) => {}}
                            removeParticipant={removeParticipant}
                            event={() => createNewEvent}
                            newTitle={newTitle} setNewTitle={setNewTitle}
                            newDescription={newDescription} setNewDescription={setNewDescription}
                            newPlace={newPlace} setNewPlace={setNewPlace}
                            newPrice={newPrice} setNewPrice={setNewPrice}
                            newStartTime={newStartTime} setNewStartTime={setNewStartTime}
                            newEndTime={newEndTime} setNewEndTime={setNewEndTime}
                            newDate={newDate} setNewDate={setNewDate}
                            newMaxParticipants={newMaxParticipants} setNewMaxParticipants={setNewMaxParticipants}
                            newParticipants={newParticipants} setNewParticipants={setNewParticipants}
                            isNewEvent={true}
                        />
                    )
                }}
                cancelButtonRef={newEventCancelButton}
                onConfirm={onNewModalConfirm}
            />

            {/* new event button */}
            <button className="btn btn-primary m-3" 
                onClick={() => { // onClick function sets all new value states to default values
                    setActiveEvent(0)
                    var e = createNewEvent()
                    setNewTitle(e.title);
                    setNewDescription(e.description);
                    setNewPlace(e.place);
                    setNewPrice(String(e.price).replace('.',','));
                    setNewDate(e.date);
                    setNewStartTime(e.startTime);
                    setNewEndTime(e.endTime);
                    setNewMaxParticipants(e.maxParticipants);
                    setNewParticipants(e.eventParticipantName);
                }} 
                data-toggle="modal"
                data-target="#newEventModal"
            >New Event</button>

            {/* actual list and detail */}
            <div className="container-fluid mb-5">
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
                            condition={(datediff) => {return (datediff < 0 ? "bg-secondary text-white" : "")}}
                        />
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
                                    newParticipants={newParticipants} setNewParticipants={setNewParticipants}
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

export default EventList;