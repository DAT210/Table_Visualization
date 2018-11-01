"use strict";
var Admin;
(function (Admin) {
    window.addEventListener("load", function () {
        fetch("/load/json")
            .then(function (r) { return r.json(); })
            .then(function (r) {
            var room = r;
            init(room);
        });
    });
    var rv;
    function init(roomPlan) {
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
        var cap = e.options[e.selectedIndex].value;
        // Legger til et nytt element i sentrum, med størrelse lik innparameterene
        rv.AddTable(width, height, parseInt(cap));
    }
    function saveTableLayout() {
        var roomName = document.getElementById('table-name').value;
        var errorMsg = document.getElementById('save-response-text');
        if (roomName.length < 1) {
            document.getElementById('save-response-text').innerHTML = "The name is too short";
            return;
        }
        var roomPlan = rv.GetRoomPlan();
        if (!roomPlan)
            throw Error("rv has no roomplan");
        roomPlan.name = roomName;
        roomPlanPOST("/add", roomPlan)
            .then(function (res) { return res.json(); })
            .then(function (res) { return errorMsg.innerHTML = res["message"]; })
            .catch(function (err) { return console.log("Error:" + JSON.stringify(err)); });
        // add code to update GUI on success/not success
    }
    function updateTableLayout() {
        var errorMsg = document.getElementById('update-response-text');
        var roomPlan = rv.GetRoomPlan();
        if (!roomPlan)
            throw Error("rv has no roomplan");
        roomPlanPOST("/update", roomPlan)
            .then(function (res) { return res.json(); })
            .then(function (res) { return errorMsg.innerHTML = res["message"]; })
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
})(Admin || (Admin = {}));
