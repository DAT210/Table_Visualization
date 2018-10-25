"use strict";
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
    var rv = new RoomVisualizer(visualizer);
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
