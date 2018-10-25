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
    rv.OnTableClick = (id: number) => { console.log("Table " + id + " clicked") }
    rv.SetRoomPlan(roomPlan);
}