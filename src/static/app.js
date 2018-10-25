"use strict";
var RoomVisualizer = /** @class */ (function () {
    function RoomVisualizer(visualizer) {
        this.tables = {};
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
        this.drawWallsAsPoly();
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
    RoomVisualizer.prototype.drawWallsAsPoly = function () {
        if (!this.roomPlan)
            return;
        var wallPoints = this.roomPlan.walls.map(function (w) { return w.from; });
        this.visualizer.AddPoly(wallPoints);
    };
    RoomVisualizer.prototype.drawTables = function () {
        var _this = this;
        if (!this.roomPlan)
            return;
        var _loop_1 = function (table) {
            var rect = this_1.visualizer.AddRect(table.width, table.height, table.position, true, "table");
            rect.OnClick = function () { console.log("Table " + table.id + " clicked!"); };
            rect.OnMove = function () { _this.updateTablePos(table.id, rect.Position); };
            this_1.tables[table.id] = rect;
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
