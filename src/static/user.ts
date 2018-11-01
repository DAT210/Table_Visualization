namespace User {

    window.addEventListener("load", () => {
        fetch("/load/json")
            .then(r => { return r.json() })
            .then(r => {
                let room: IRoom = r as IRoom;
                init(room);
            });
    });

    let rv: RoomVisualizer;

    function init(roomPlan: IRoom) {
        console.log("RoomPlan:");
        console.log(roomPlan);
        const visualizer = new InteractiveSVG();
        rv = new RoomVisualizer(visualizer);
        rv.SetRoomPlan(roomPlan);

        const bookings = getBookings();
        rv.MarkTablesAsBooked(bookings.tablesIDs);
        
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

}