window.addEventListener("load", function () {
    fetch("/load/json")
        .then(function (r) { return r.json(); })
        .then(function (roomPlan) {
        var room = roomPlan;
        init(room);
    });
});
function init(roomPlan) {
    console.log("RoomPlan:");
    console.log(roomPlan);
    var visualizer = new InteractiveSVG();
    var rv = new RoomVisualizerAdmin(visualizer);
    rv.RoomPlan = roomPlan;
}
var RoomVisualizer = /** @class */ (function () {
    function RoomVisualizer(visualizer) {
        this.visualizer = visualizer;
        document.body.appendChild(this.visualizer.Wrapper);
    }
    Object.defineProperty(RoomVisualizer.prototype, "RoomPlan", {
        set: function (roomPlan) {
            this.roomPlan = roomPlan;
            this.visualizer.Width = this.roomPlan.width;
            this.visualizer.Height = this.roomPlan.height;
            this.drawRoom();
        },
        enumerable: true,
        configurable: true
    });
    RoomVisualizer.prototype.drawRoom = function () {
        this.visualizer.Reset();
        this.drawWalls();
        this.drawTables();
    };
    RoomVisualizer.prototype.drawWalls = function () {
        if (!this.roomPlan)
            return;
        for (var _i = 0, _a = this.roomPlan.walls; _i < _a.length; _i++) {
            var wall = _a[_i];
            this.visualizer.AddLine(wall.from, wall.to);
        }
    };
    RoomVisualizer.prototype.drawTables = function () {
        var _this = this;
        if (!this.roomPlan)
            return;
        var _loop_1 = function (table) {
            var rect = this_1.visualizer.AddRect(table.width, table.height, table.position, true, "table");
            rect.OnClick = function () { console.log("Table " + table.id + " clicked!"); };
            rect.OnClick = function () { console.log("Table Position for table " + table.id + " " + table.position); };
            rect.OnMove = function () { _this.updateTablePos(table.id, rect.Position); };
        };
        var this_1 = this;
        for (var _i = 0, _a = this.roomPlan.tables; _i < _a.length; _i++) {
            var table = _a[_i];
            _loop_1(table);
        }
    };
    RoomVisualizer.prototype.updateTablePos = function (tableID, pos) {
        if (this.roomPlan) {
            for (var _i = 0, _a = this.roomPlan.tables; _i < _a.length; _i++) {
                var t = _a[_i];
                if (t.id == tableID)
                    t.position = pos;
            }
        }
    };
    return RoomVisualizer;
}());
var RoomVisualizerAdmin = /** @class */ (function () {
    function RoomVisualizerAdmin(visualizer) {
        var _this = this;
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
        this.drawWalls();
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
    RoomVisualizerAdmin.prototype.drawTables = function () {
        var _this = this;
        if (!this.roomPlan)
            return;
        var _loop_2 = function (table) {
            var rect = this_2.visualizer.AddRect(table.width, table.height, table.position, true, "table");
            rect.OnClick = function () { console.log("Table " + table.id + " clicked!"); };
            rect.OnClick = function () { console.log("Table Position for table " + table.id + " " + table.position); };
            rect.OnMove = function () { _this.updateTablePos(table.id, rect.Position); };
        };
        var this_2 = this;
        for (var _i = 0, _a = this.roomPlan.tables; _i < _a.length; _i++) {
            var table = _a[_i];
            _loop_2(table);
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
        var height = Number(box.style.height.split("px")[0]);
        var width = Number(box.style.width.split("px")[0]);
        var e = document.getElementById('capacityList');
        var strUser = e.options[e.selectedIndex].value;
        console.log(strUser);
        // Legger til et nytt element i sentrum, med størrelse lik innparameterene
        var center = { "x": 250, "y": 250 };
        var newRect = this.visualizer.AddRect(width, height, center, true, "table");
        var tableID = this.roomPlan.tables.length + 1;
        this.roomPlan.tables.push({ "id": tableID, "width": width, "height": height, "position": center });
        newRect.OnMove = function () { _this.updateTablePos(tableID, newRect.Position); };
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
var SVGHelper = /** @class */ (function () {
    function SVGHelper() {
    }
    SVGHelper.NewSVG = function (width, height) {
        var svg = document.createElementNS(this.svgNS, "svg");
        this.SetSize(svg, width, height);
        return svg;
    };
    SVGHelper.NewRect = function (width, height) {
        var rect = document.createElementNS(this.svgNS, "rect");
        this.SetSize(rect, width, height);
        return rect;
    };
    SVGHelper.NewLine = function (pos1, pos2) {
        var line = document.createElementNS(this.svgNS, "line");
        this.SetLinePos(line, pos1, pos2);
        return line;
    };
    SVGHelper.SetSize = function (element, w, h) {
        element.setAttribute("width", w + "px");
        element.setAttribute("height", h + "px");
    };
    SVGHelper.GetWidth = function (element) {
        return element.width.baseVal.value;
    };
    SVGHelper.GetHeight = function (element) {
        return element.height.baseVal.value;
    };
    SVGHelper.SetPosition = function (element, pos) {
        element.setAttribute("x", pos.x + "px");
        element.setAttribute("y", pos.y + "px");
    };
    SVGHelper.SetLinePos = function (element, pos1, pos2) {
        element.setAttribute("x1", pos1.x + "px");
        element.setAttribute("y1", pos1.y + "px");
        element.setAttribute("x2", pos2.x + "px");
        element.setAttribute("y2", pos2.y + "px");
    };
    SVGHelper.svgNS = "http://www.w3.org/2000/svg";
    return SVGHelper;
}());
