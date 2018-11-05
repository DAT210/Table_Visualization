namespace Admin {

    window.addEventListener("load", () => {
        fetch("/load/json")
            .then(r => { return r.json() })
            .then(r => {
                let room: IRoom = <IRoom>r;
                init(room);
            });
    });

    let rv: RoomVisualizer;

    function init(roomPlan: IRoom) {
        console.log("RoomPlan:");
        console.log(roomPlan);
        const visualizer = new InteractiveSVG();
        rv = new RoomVisualizer(visualizer, true);
        rv.SetRoomPlan(roomPlan);
        let addBtn = (<HTMLInputElement>document.getElementById('addBtn'));
        let savebtn = (<HTMLInputElement>document.getElementById('saveBtn'));
        let updatebtn = (<HTMLInputElement>document.getElementsByClassName('updateBtn')[0]);
        //box.style.width = 60 + "px";
        //box.style.height = 40 + "px";
        addBtn.onclick = () => { addTable() };
        savebtn.onclick = () => { saveTableLayout() };
        updatebtn.onclick = () => { updateTableLayout() };
    }

function addTable() {
    let box = <HTMLInputElement>document.getElementById('resizable');
    if (!box) return;
    let height = box.clientHeight;
    let width = box.clientWidth;
    let e = document.getElementById('capacityList') as HTMLSelectElement;
    let cap = e.options[e.selectedIndex].value;
    
    // Legger til et nytt element i sentrum, med størrelse lik innparameterene
    rv.AddTable(width, height,parseInt(cap));
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