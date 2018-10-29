"use strict";
window.addEventListener("load", function () {
    fetch("/load/json")
        .then(function (r) { return r.json(); })
        .then(function (roomPlan) {
        var room = roomPlan;
        initAdmin(room);
    })
        .catch(function (err) { return console.error(JSON.stringify(err)); });
});
var rv;
function initAdmin(roomPlan) {
    console.log("RoomPlan:");
    console.log(roomPlan);
    var visualizer = new InteractiveSVG();
    rv = new RoomVisualizer(visualizer, true);
    rv.SetRoomPlan(roomPlan);
    var box = document.getElementById('box1');
    var savebtn = document.getElementsByClassName('saveBtn')[0];
    var updatebtn = document.getElementsByClassName('updateBtn')[0];
    box.style.width = 60 + "px";
    box.style.height = 40 + "px";
    box.onclick = function () { addTable(); };
    savebtn.onclick = function () { saveTableLayout(); };
    updatebtn.onclick = function () { updateTableLayout(); };
}
function addTable() {
    var box = document.getElementById('box1');
    if (!box)
        return;
    var height = box.clientHeight;
    var width = box.clientWidth;
    var e = document.getElementById('capacityList');
    var strUser = e.options[e.selectedIndex].value;
    // Legger til et nytt element i sentrum, med størrelse lik innparameterene
    rv.AddTable(width, height);
}
function saveTableLayout() {
    var roomName = document.getElementById('table-name').value;
    if (roomName.length < 1) {
        document.getElementById('save-response-text').innerHTML = "The name is too short";
        return;
    }
    var roomPlan = rv.GetRoomPlan();
    if (!roomPlan)
        throw Error("rv has no roomplan");
    roomPlanPOST("/add", roomPlan)
        .then(function (res) { return res.json(); })
        .then(function (res) { return console.log("Success: " + JSON.stringify(res)); })
        .catch(function (err) { return console.log("Error:" + JSON.stringify(err)); });
    // add code to update GUI on success/not success
}
function updateTableLayout() {
    var roomPlan = rv.GetRoomPlan();
    if (!roomPlan)
        throw Error("rv has no roomplan");
    roomPlanPOST("/update", roomPlan)
        .then(function (res) { return res.json(); })
        .then(function (res) { return console.log("Success: " + JSON.stringify(res)); })
        .catch(function (err) { return console.log("Error:" + JSON.stringify(err)); });
    // add code to update GUI on success/not success
}
function roomPlanPOST(url, roomPlan) {
    return fetch(url, {
        method: "post",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(roomPlan)
    });
}
