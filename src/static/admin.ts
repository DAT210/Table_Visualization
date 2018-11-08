namespace Admin {

    window.addEventListener("load", () => {
        fetch("/load/json")
            .then(r => { return r.json() })
            .then(r => {
                let room: IRoom = r as IRoom;
                init(room);
            });
    });

    let rv: RoomVisualizer;
    declare var app: any;

    function init(roomPlan: IRoom) {
        console.log("RoomPlan:");
        console.log(roomPlan);
        const visualizer = new InteractiveSVG();
        rv = new RoomVisualizer(visualizer, true);
        rv.SetRoomPlan(roomPlan);
        let addBtn = (<HTMLInputElement>document.getElementById('addBtn'));
        let addwall = (<HTMLInputElement>document.getElementById('addWall'));
        let savebtn = (<HTMLInputElement>document.getElementById('saveBtn'));
        let updatebtn = (<HTMLInputElement>document.getElementById('updateBtn'));
        addBtn.onclick = () => { addTable() };
        savebtn.onclick = () => { saveTableLayout() };
        addwall.onclick = () => { addWall() };
        updatebtn.onclick = () => { updateTableLayout() };
    }

    function addTable() {
        let box = <HTMLInputElement>document.getElementById('resizable');
        if (!box) return;
        let height = box.clientHeight;
        let width = box.clientWidth;
        let e = document.getElementById('capacityList') as HTMLSelectElement;
        let cap = parseInt(e.options[e.selectedIndex].value);
        let tablePos: IPoint = { x: rv.GetCenter().x - (width / 2), y: rv.GetCenter().y - (height / 2) };

        let roomPlan = rv.GetRoomPlan();
        if (roomPlan) {
            roomPlan.tables.push({
                width: width,
                height: height,
                position: tablePos,
                capacity: cap
            });
            rv.SetRoomPlan(roomPlan);
            console.log("Roomplan updated:");
            console.log(rv.GetRoomPlan());
        }
        else {
            console.error("Cannot add table: No roomplan stored in visualizer")
        }
    }

    function addWall() {
        let walls = app.lines;
        if (!walls) throw Error("No walls");
        let newWalls: IWall[] = [];
        for (let wall in walls) {
            let x_from = parseInt(walls[wall]['lastx']);
            let x_to = parseInt(walls[wall]['newx']);
            let y_from = parseInt(walls[wall]['lasty']);
            let y_to = parseInt(walls[wall]['newy']);
            let from: IPoint = { x: x_from, y: y_from };
            let to: IPoint = { x: x_to, y: y_to };
            newWalls.push({ from: from, to: to });
        }
        let roomPlan = rv.GetRoomPlan();
        if (roomPlan) {
            roomPlan.walls = newWalls;
            rv.SetRoomPlan(roomPlan);
            console.log("Roomplan updated:");
            console.log(rv.GetRoomPlan());
        }
        else {
            console.error("Cannot add walls: No roomplan stored in visualizer");
        }
    }

    function saveTableLayout() {
        const roomName = (<HTMLInputElement>document.getElementById('tableNameForm')).value;
        const errorMsg = (<HTMLInputElement>document.getElementById('save-response-text'));
        errorMsg.style.visibility = "visible";
        if (roomName.length < 1) {
            (<HTMLInputElement>document.getElementById('save-response-text')).innerHTML = "The name is too short";
            return;
        }

        let roomPlan = rv.GetRoomPlan();
        if (!roomPlan) throw Error("rv has no roomplan");
        roomPlan.name = roomName;

        roomPlanPOST("/add", roomPlan)
            .then(res => res.json())
            .then(res => errorMsg.innerHTML = res["message"])
            .catch(err => console.log("Error:" + JSON.stringify(err)))

        // add code to update GUI on success/not success
    }

    function updateTableLayout() {
        const errorMsg = (<HTMLInputElement>document.getElementById('update-response-text'));
        let roomPlan = rv.GetRoomPlan();
        if (!roomPlan) throw Error("rv has no roomplan");
        errorMsg.style.visibility = "visible";

        roomPlanPOST("/update", roomPlan)
            .then(res => res.json())
            .then(res => errorMsg.innerHTML = res["message"])
            .catch(err => console.log("Error:" + JSON.stringify(err)))

        // add code to update GUI on success/not success
    }

    function roomPlanPOST(url: string, roomPlan: IRoom): Promise<Response> {
        return fetch(url, {
            method: "post",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(roomPlan)
        });
    }

}