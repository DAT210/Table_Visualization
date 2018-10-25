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
    rv.OnTableClick = function (id) { console.log("Table " + id + " clicked"); };
    rv.SetRoomPlan(roomPlan);
}
