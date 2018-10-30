window.addEventListener("load", () => {
    fetch("/load/json")
        .then(r => { return r.json() })
        .then(roomPlan => {
            let room: IRoom = <IRoom>roomPlan;
            initUser(room);
        });
});

function initUser(roomPlan: IRoom) {
    console.log("RoomPlan:");
    console.log(roomPlan);
    const visualizer = new InteractiveSVG();
    const rv = new RoomVisualizer(visualizer);
    rv.SetRoomPlan(roomPlan);

    const bookings = getBookings();
    rv.SetTableAvailability(bookings.tablesIDs);
    
    // temp button for testing
    const button = document.createElement("input");
    button.type = "button";
    button.value = "Print selected tables";
    button.style.zIndex = "10";
    button.onclick = () => { console.log(rv.GetSelected()) };
    document.body.appendChild(button);
}

interface IBookings {
    tablesIDs: number[];
    people: number;
}

function getBookings(): IBookings {
    // fetch (GET): get bookings from server
    return { tablesIDs: [0, 2, 3], people: 3 };
}
function postTables(tableIDs: number[]): void {
    //fetch (POST): send tableIDs to server
}