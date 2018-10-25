"use strict";
window.addEventListener("load", function () {
    fetch("/load/json")
        .then(function (r) { return r.json(); })
        .then(function (roomPlan) {
        var room = roomPlan;
        initAdmin(room);
    });
});
function initAdmin(roomPlan) {
    console.log("RoomPlan:");
    console.log(roomPlan);
    var visualizer = new InteractiveSVG();
    var rv = new RoomVisualizerAdmin(visualizer);
    rv.RoomPlan = roomPlan;
}
var RoomVisualizerAdmin = /** @class */ (function () {
    function RoomVisualizerAdmin(visualizer) {
        var _this = this;
        this.tables = {};
        this.visualizer = visualizer;
        document.body.appendChild(this.visualizer.Wrapper);
        var box = document.getElementById('box1');
        var savebtn = document.getElementsByClassName('saveBtn')[0];
        var updatebtn = document.getElementsByClassName('updateBtn')[0];
        box.style.width = 60 + "px";
        box.style.height = 40 + "px";
        box.onclick = function () { _this.addTable(); };
        savebtn.onclick = function () { _this.saveTableLayout('add'); };
        updatebtn.onclick = function () { _this.updateTableLayout('update'); };
    }
    Object.defineProperty(RoomVisualizerAdmin.prototype, "RoomPlan", {
        set: function (roomPlan) {
            this.roomPlan = roomPlan;
            this.visualizer.Width = this.roomPlan.width;
            this.visualizer.Height = this.roomPlan.height;
            this.drawRoom();
        },
        enumerable: true,
        configurable: true
    });
    RoomVisualizerAdmin.prototype.drawRoom = function () {
        this.visualizer.Reset();
        //this.drawWalls();
        this.drawWallsAsPoly();
        this.drawTables();
    };
    RoomVisualizerAdmin.prototype.drawWalls = function () {
        if (!this.roomPlan)
            return;
        for (var _i = 0, _a = this.roomPlan.walls; _i < _a.length; _i++) {
            var wall = _a[_i];
            this.visualizer.AddLine(wall.from, wall.to);
        }
    };
    RoomVisualizerAdmin.prototype.drawWallsAsPoly = function () {
        if (!this.roomPlan)
            return;
        var wallPoints = this.roomPlan.walls.map(function (w) { return w.from; });
        this.visualizer.AddPoly(wallPoints);
    };
    RoomVisualizerAdmin.prototype.drawTables = function () {
        var _this = this;
        if (!this.roomPlan)
            return;
        var _loop_1 = function (table) {
            var rect = this_1.visualizer.AddRect(table.width, table.height, table.position, true, "table");
            rect.OnClick = function () { console.log("Table " + table.id + " clicked!"); };
            rect.OnClick = function () { console.log("Table Position for table " + table.id + " " + table.position); };
            rect.OnMove = function () { _this.updateTablePos(table.id, rect.Position); };
            this_1.tables[table.id] = rect;
        };
        var this_1 = this;
        for (var _i = 0, _a = this.roomPlan.tables; _i < _a.length; _i++) {
            var table = _a[_i];
            _loop_1(table);
        }
    };
    RoomVisualizerAdmin.prototype.updateTablePos = function (tableID, pos) {
        if (this.roomPlan) {
            for (var _i = 0, _a = this.roomPlan.tables; _i < _a.length; _i++) {
                var t = _a[_i];
                if (t.id == tableID)
                    t.position = pos;
            }
        }
    };
    RoomVisualizerAdmin.prototype.getTableSetup = function (name, value) {
        if (!this.roomPlan)
            return;
        var dict = [];
        for (var _i = 0, _a = this.roomPlan.tables; _i < _a.length; _i++) {
            var table = _a[_i];
            dict.push({
                "id": table.id,
                "width": table.width,
                "height": table.height,
                "xpos": table.position.x,
                "ypos": table.position.y,
                "status": value,
                "name": name
            });
        }
        return dict;
    };
    RoomVisualizerAdmin.prototype.addTable = function () {
        var _this = this;
        if (!this.roomPlan)
            return;
        var box = document.getElementById('box1');
        if (box) {
            var height = box.height;
            var width = box.width;
            var e = document.getElementById('capacityList');
            var strUser = e.options[e.selectedIndex].value;
            console.log(strUser);
            // Legger til et nytt element i sentrum, med størrelse lik innparameterene
            var center = { "x": 250, "y": 250 };
            var newRect_1 = this.visualizer.AddRect(width, height, center, true, "table");
            var tableID = this.roomPlan.tables.length + 1;
            this.roomPlan.tables.push({ "id": tableID, "width": width, "height": height, "position": center });
            newRect_1.OnMove = function () { _this.updateTablePos(tableID, newRect_1.Position); };
        }
    };
    RoomVisualizerAdmin.prototype.saveTableLayout = function (value) {
        var TableName = document.getElementById('table-name').value;
        if (TableName.length < 1) {
            document.getElementById('save-response-text').innerHTML = "The name is too short";
            return;
        }
        var dict = this.getTableSetup(TableName, value);
        if (dict) {
            if (dict.length == 0) {
                document.getElementById('save-response-text').innerHTML = "You have to add tables";
                return;
            }
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/add", true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    // Sjekk om server klarte å legge inn bordoppsettet i databasen
                    var json = JSON.parse(xhr.responseText);
                    var errorMsg = document.getElementById('save-response-text');
                    var jsonStatus = json["status"];
                    if (jsonStatus == "error") {
                        errorMsg.style.color = "red";
                        errorMsg.innerHTML = json["message"];
                    }
                    if (jsonStatus == "success") {
                        location.reload();
                    }
                }
            };
            var data = JSON.stringify(dict);
            xhr.send(data);
        }
    };
    RoomVisualizerAdmin.prototype.updateTableLayout = function (value) {
        var dict = this.getTableSetup("dummie", value);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "update", true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                // Sjekk om server klarte å legge inn bordoppsettet i databasen
                var json = JSON.parse(xhr.responseText);
                var errorMsg = document.getElementById('update-response-text');
                var jsonStatus = json["status"];
                if (jsonStatus == "error") {
                    errorMsg.style.color = "red";
                    errorMsg.innerHTML = json["message"];
                }
                if (jsonStatus == "success") {
                    errorMsg.style.color = "green";
                    errorMsg.innerHTML = json["message"];
                }
            }
        };
        var data = JSON.stringify(dict);
        xhr.send(data);
    };
    return RoomVisualizerAdmin;
}());
