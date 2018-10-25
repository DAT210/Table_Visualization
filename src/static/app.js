"use strict";
var RoomVisualizer = /** @class */ (function () {
    function RoomVisualizer(visualizer) {
        this.tables = {};
        this.OnTableClick = function (id) { };
        this.visualizer = visualizer;
        document.body.appendChild(this.visualizer.Wrapper);
    }
    RoomVisualizer.prototype.GetRoomPlan = function () {
        if (this.roomPlan)
            return this.roomPlan;
        else
            return null;
    };
    RoomVisualizer.prototype.SetRoomPlan = function (roomPlan) {
        this.roomPlan = roomPlan;
        this.visualizer.Width = this.roomPlan.width;
        this.visualizer.Height = this.roomPlan.height;
        this.drawRoom();
    };
    RoomVisualizer.prototype.AddTable = function (w, h) {
        var pos = { x: this.visualizer.Height / 2, y: this.visualizer.Height / 2 };
        var id = this.drawTable(w, h, pos);
        if (this.roomPlan) {
            this.roomPlan.tables.push({ width: w, height: h, position: pos, id: id });
        }
    };
    RoomVisualizer.prototype.drawRoom = function () {
        this.visualizer.Reset();
        this.drawWallsAsPoly();
        this.drawTables();
    };
    RoomVisualizer.prototype.drawWallsAsLines = function () {
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
        if (!this.roomPlan)
            return;
        for (var _i = 0, _a = this.roomPlan.tables; _i < _a.length; _i++) {
            var table = _a[_i];
            this.drawTable(table.width, table.height, table.position, table.id);
        }
    };
    RoomVisualizer.prototype.drawTable = function (w, h, pos, id) {
        var _this = this;
        var rect = this.visualizer.AddRect(w, h, pos, true, "table");
        var tableId = id ? id : this.generateId();
        rect.OnClick = function () { _this.OnTableClick(tableId); };
        rect.OnMove = function () { _this.updateTablePos(tableId, rect.Position); };
        this.tables[tableId] = rect;
        return tableId;
    };
    RoomVisualizer.prototype.generateId = function () {
        var id;
        do {
            id = Math.floor((Math.random() * 1000));
        } while (id in this.tables);
        console.log("Generated table ID: " + id);
        return id;
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
