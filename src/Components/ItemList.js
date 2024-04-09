// renders a list of items and a delete button for each
// items          - list of objects to be rendered
// displayParam   - property of item to be used when displaying
// setActive      - function to call when clicking on item
// modalId        - id of modal pop-up which shows up when clicking on the delete button
// styling        - boolean for when additional styling is needed (e.g. color)
// subject        - function which takes an item as input and returns the subject (i.e. input) of the condition function
// condition      - function which takes the subject returns additional styling based on the subject
const ItemList = ({items, displayParam, setActive, divInfoId, modalId, styling=false, subject=(item)=>{}, condition=(subject)=>{}}) => {
    return (
        <ul className="list-group" id="list-tab" role="tablist">
            {items.map((item, index) => {
                const s = subject(item); // subject function returns some value used in the condition function
                return (
                    <li key={item.id} className={"list-group-item p-0 d-flex justify-content-between align-items-center" + (styling ? " " + condition(s) : "")} onClick={() => {setActive(item.id)}}>
                        <div className="align-items-center">
                            <div className="ms-3">
                                <span className="">{item[displayParam]}</span>
                            </div>
                        </div>
                        <button
                            className={"btn btn-danger bi bi-trash product-trash rounded-start-0" + (index > 0 ? " rounded-top-0" : "") + (index < items.length-1 ? " rounded-bottom-0" : " rounded-bottom-left-0")}
                            onClick={() => {
                                setActive(item.id);
                                document.getElementById(divInfoId).textContent = item[displayParam];
                            }}
                            data-toggle="modal"
                            data-target={"#" + modalId}
                        ></button>
                    </li>
                );
            })}
        </ul>
    );
}

export default ItemList;