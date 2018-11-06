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

        getBookings2(roomPlan.name).then(r => {
            console.log(r);
            rv.MarkTablesAsBooked(r.tables);
        })
        
        
        // temp button for testing
        const button = document.createElement("input");
        button.type = "button";
        button.value = "Print selected tables";
        button.style.zIndex = "10";
        button.onclick = () => { alert("Selected tables: " + rv.GetSelected()) };
        document.body.appendChild(button);
    }

    interface IBookings {
        tables: number[];
        people: number;
    }

    function getBookings(): IBookings {
        // fetch (GET): get bookings from server
        return { tables: [0, 2, 3], people: 3 };
    }

    function getBookings2(rName: string): Promise<IBookings> {
        let url = "/api/booking/" + rName;
        return fetch(url)
        .then(r => { return r.json() })
        .then(r => { return r as IBookings })
    }

    function postTables(tableIDs: number[]): void {
        //fetch (POST): send tableIDs to server
    }

}