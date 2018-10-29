window.addEventListener("load", () => {
    fetch("/load/json")
        .then(r => { return r.json() })
        .then(roomPlan => {
            let room: IRoom = <IRoom>roomPlan;
            initUser(room);
        })
        .catch(err => console.error(JSON.stringify(err)));
});

function initUser(roomPlan: IRoom) {
    console.log("RoomPlan:");
    console.log(roomPlan);
    const visualizer = new InteractiveSVG();
    const rv = new RoomVisualizer(visualizer);
    rv.SetRoomPlan(roomPlan);
    
    // temp button for testing
    const button = document.createElement("input");
    button.type = "button";
    button.value = "Click Me";
    button.style.marginTop = "600px";
    button.onclick = () => { console.log(rv.GetSelected()) };
    document.body.appendChild(button);
}