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
        rv.CenterContent();
        let nrOfPeople = 0;
        getBookings(roomPlan.name).then(r => {
            console.log(r);
            nrOfPeople = r.nrOfPeople;
            console.log(nrOfPeople);
            rv.MarkTablesAsBooked(r.tables);
        })

        let roomtables = rv.GetRoomPlan();

        // temp button for testing
        const button = document.createElement("input");
        button.type = "button";
        button.value = "Print selected tables";
        button.style.zIndex = "10";
        button.onclick = () => {
            if (roomtables) {
                let capacityTables: number = 0;
                let rtables = roomtables.tables;
                let select = rv.GetSelected();
                for (var i = 0; i < select.length; i++) {
                    let t = rtables[select[i]];
                    if (t !== undefined) {
                        let x = t.capacity;
                        if (x !== undefined) {
                            capacityTables += x;
                        }
                    }   
                }
                if (capacityTables >= nrOfPeople) {
                    testFunn(rv.GetSelected());
                } else {
                    alert("Not enough tables");
                }
            }
        };
        document.body.appendChild(button);
    }

    interface IBookings {
        tables: number[];
        nrOfPeople: number;
    }

    function getBookings(restaurantName: string): Promise<IBookings> {
        let url = "/api/booking/" + restaurantName;
        return fetch(url)
            .then(r => { return r.json() })
            .then(r => { return r as IBookings })
    }

    function testFunn(tableIDs: number[]): void {
        let body = {"tables": tableIDs};
        console.log(JSON.stringify(body));
        console.log(body["tables"]);
        console.log("Det funker");
    }

    function postTables(tableIDs: number[]): void {
        //fetch (POST): send tableIDs to server
        let url ="/api/tablevis/tables";
        let tables = {"tables": tableIDs}
        fetch(url, {
            method: "post",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(tables)
        });
    }
}