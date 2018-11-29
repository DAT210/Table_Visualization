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
        var addBtn = document.getElementById('addBtn');
        var addwall = document.getElementById('addWall');
        var savebtn = document.getElementById('saveBtn');
        var updatebtn = document.getElementById('updateBtn');
        addBtn.onclick = function () { addTable(); };
        savebtn.onclick = function () { saveTableLayout(); };
        addwall.onclick = function () { addWall(); };
        updatebtn.onclick = function () { updateTableLayout(); };
    }
    function addTable() {
        var box = document.getElementById('resizable');
        if (!box)
            return;
        var height = box.clientHeight;
        var width = box.clientWidth;
        var e = document.getElementById('capacityList');
        var cap = parseInt(e.options[e.selectedIndex].value);
        var tablePos = { x: rv.GetCenter().x - (width / 2), y: rv.GetCenter().y - (height / 2) };
        var roomPlan = rv.GetRoomPlan();
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
            console.error("Cannot add table: No roomplan stored in visualizer");
        }
    }
    function addWall() {
        var walls = app.lines;
        if (!walls)
            throw Error("No walls");
        var newWalls = [];
        for (var wall in walls) {
            var x_from = parseInt(walls[wall]['lastx']);
            var x_to = parseInt(walls[wall]['newx']);
            var y_from = parseInt(walls[wall]['lasty']);
            var y_to = parseInt(walls[wall]['newy']);
            var from = { x: x_from, y: y_from };
            var to = { x: x_to, y: y_to };
            newWalls.push({ from: from, to: to });
        }
        var roomPlan = rv.GetRoomPlan();
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
        var roomName = document.getElementById('tableNameForm').value;
        var errorMsg = document.getElementById('save-response-text');
        errorMsg.style.visibility = "visible";
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
        errorMsg.style.visibility = "visible";
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
//# sourceMappingURL=admin.js.map