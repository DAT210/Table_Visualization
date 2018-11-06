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
        var cap = e.options[e.selectedIndex].value;
        // Legger til et nytt element i sentrum, med størrelse lik innparameterene
        rv.AddTable(width, height, parseInt(cap));
    }
    function addWall() {
        console.log("admin add wall");
        var x_from = 150;
        var x_to = 150;
        var y_from = 90;
        var y_to = 200;
        // Legger til et nytt element i sentrum, med størrelse lik innparameterene
        //rv.AddWall(x_from,x_to,y_from,y_to);
        rv.AddWall(200, 600, 100, 100);
        rv.AddWall(600, 600, 100, 400);
        rv.AddWall(600, 300, 400, 400);
        rv.AddWall(300, 300, 400, 300);
        rv.AddWall(300, 200, 300, 300);
        rv.AddWall(200, 200, 300, 100);
        var roomPlan = rv.GetRoomPlan();
        if (!roomPlan)
            throw Error("rv has no roomplan");
        rv.SetRoomPlan(roomPlan);
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