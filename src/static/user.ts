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
    
    // temp button for testing
    const button = document.createElement("input");
    button.type = "button";
    button.value = "Print selected tables";
    button.style.zIndex = "10";
    button.onclick = () => { console.log(rv.GetSelected()) };
    document.body.appendChild(button);
}