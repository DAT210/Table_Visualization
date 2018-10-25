window.addEventListener("load", () => {
    fetch("/load/json")
        .then(r => { return r.json() })
        .then(roomPlan => {
            let room: IRoom = <IRoom>roomPlan;
            initAdmin(room);
        })
        .catch(err => console.error(JSON.stringify(err)));
});

let rv: RoomVisualizer;

function initAdmin(roomPlan: IRoom) {
    console.log("RoomPlan:");
    console.log(roomPlan);
    const visualizer = new InteractiveSVG();
    rv = new RoomVisualizer(visualizer);
    rv.OnTableClick = (id: number) => { console.log("Table " + id + " clicked") }
    rv.SetRoomPlan(roomPlan);    

    let box = (<HTMLInputElement>document.getElementById('box1'));
    let savebtn = (<HTMLInputElement>document.getElementsByClassName('saveBtn')[0]);
    let updatebtn = (<HTMLInputElement>document.getElementsByClassName('updateBtn')[0]);
    box.style.width = 60 + "px";
    box.style.height = 40 + "px";
    box.onclick = () => { addTable() };
    savebtn.onclick = () => { saveTableLayout() };
    updatebtn.onclick = () => { updateTableLayout() };
}

function addTable() {
    let box = <HTMLInputElement>document.getElementById('box1');
    if (!box) return;
    let height = box.clientHeight;
    let width = box.clientWidth;
    let e = document.getElementById('capacityList') as HTMLSelectElement;
    let strUser = e.options[e.selectedIndex].value;
    
    // Legger til et nytt element i sentrum, med størrelse lik innparameterene
    rv.AddTable(width, height);
}

function saveTableLayout() {
    const roomName = (<HTMLInputElement>document.getElementById('table-name')).value;
    if (roomName.length < 1) {
        (<HTMLInputElement>document.getElementById('save-response-text')).innerHTML = "The name is too short";
        return;
    }
    let roomPlan = rv.GetRoomPlan();
    if (!roomPlan) throw Error("rv has no roomplan");
    
    roomPlanPOST("/add", roomPlan)
        .then(res => res.json())
        .then(res => console.log("Success: " + JSON.stringify(res)))
        .catch(err => console.log("Error:" + JSON.stringify(err)))

    // add code to update GUI on success/not success
}

function updateTableLayout() {
    let roomPlan = rv.GetRoomPlan();
    if (!roomPlan) throw Error("rv has no roomplan");
    
    roomPlanPOST("/update", roomPlan)
        .then(res => res.json())
        .then(res => console.log("Success: " + JSON.stringify(res)))
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