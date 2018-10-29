"use strict";
window.addEventListener("load", function () {
    fetch("/load/json")
        .then(function (r) { return r.json(); })
        .then(function (roomPlan) {
        var room = roomPlan;
        initUser(room);
    })
        .catch(function (err) { return console.error(JSON.stringify(err)); });
});
function initUser(roomPlan) {
    console.log("RoomPlan:");
    console.log(roomPlan);
    var visualizer = new InteractiveSVG();
    var rv = new RoomVisualizer(visualizer);
    rv.SetRoomPlan(roomPlan);
    // temp button for testing
    var button = document.createElement("input");
    button.type = "button";
    button.value = "Click Me";
    button.style.marginTop = "600px";
    button.onclick = function () { console.log(rv.GetSelected()); };
    document.body.appendChild(button);
}
