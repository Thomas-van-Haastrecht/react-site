import { useEffect, useState } from "react";
import SelectedEvent from "./SelectedEvent";

const EventList = ({fetchData}) => {
    // state keeping track of the list of events
    const [events, setEvents] = useState([])

    const [isLoaded, setLoaded] = useState(false)
    const [LoadFailed, setLoadFailed] = useState(false)

    // effect which runs on page load and calls the fetchData function to retrieve product list
    useEffect( () => {
        /// Create an async function within the useEffect hook
        const fetch = async(urls) => {
            await Promise.all(urls.map(url => fetchData(url)))
            .then(result => {
                console.log(result)
                setEvents(result[0])
            })
            .catch( err => {
                console.log(err)
                setLoadFailed(true)
            })
            setLoaded(true)
        }
        /// Call the function
        fetch(['https://localhost:7027/api/events'])
    }, [])

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

        setEvents(oldEvents => {
            return oldEvents.filter(e => e.id !== eid);
        })
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
        setEvents(changedEvents);
        //putEvent(eventId);
    }

    return ( !isLoaded ? <div>Loading...</div> : (LoadFailed ? <div>Load Failed, Please try again.</div> :
        <>
            <div className="container-fluid mt-5">
                <div className="row">
                <div className="col-4">
                    <div className="list-group" id="list-tab" role="tablist">
                        {events.map( event => {
                            return (
                                <li key={event.id} className="list-group-item d-flex justify-content-between align-items-center" onClick={() => {setActiveEvent(event.id)}}>
                                    <div className="align-items-center">
                                        <div className="ms-3">
                                            <span className="">{event.title}</span>
                                        </div>
                                    </div>
                                    <button className="btn btn-danger bi bi-trash product-trash" onClick={() => {deleteEvent(event.id)}}></button>
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