"use strict";
var RoomVisualizer = /** @class */ (function () {
    function RoomVisualizer(visualizer, movableTables) {
        if (movableTables === void 0) { movableTables = false; }
        this.tables = {};
        this.bookedTables = [];
        this.movableTables = movableTables;
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
        var pos = { x: this.visualizer.Width / 2, y: this.visualizer.Height / 2 };
        var id = this.drawTable(w, h, pos, undefined, true);
        if (this.roomPlan) {
            this.roomPlan.tables.push({ width: w, height: h, position: pos, id: id });
        }
    };
    RoomVisualizer.prototype.GetSelected = function () {
        var selected = [];
        for (var id in this.tables) {
            if (this.tables[id].Selected)
                selected.push(+id);
        }
        return selected;
    };
    RoomVisualizer.prototype.MarkTablesAsBooked = function (tableIDs) {
        this.bookedTables = tableIDs;
        for (var _i = 0, tableIDs_1 = tableIDs; _i < tableIDs_1.length; _i++) {
            var id = tableIDs_1[_i];
            if (id in this.tables) {
                this.tables[id].ToggleClass("table-booked");
            }
            else
                console.warn("Trying to mark non-existent table as booked. ID = " + id);
        }
    };
    RoomVisualizer.prototype.drawRoom = function () {
        this.visualizer.Reset();
        this.drawWallsAsPoly();
        this.drawTables();
        this.visualizer.CenterContent();
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
        var room = this.visualizer.AddPoly(wallPoints);
        room.ToggleClass("room");
    };
    RoomVisualizer.prototype.drawTables = function () {
        if (!this.roomPlan)
            return;
        for (var _i = 0, _a = this.roomPlan.tables; _i < _a.length; _i++) {
            var table = _a[_i];
            this.drawTable(table.width, table.height, table.position, table.id, this.movableTables);
        }
    };
    RoomVisualizer.prototype.drawTable = function (w, h, pos, id, movable) {
        var _this = this;
        if (movable === void 0) { movable = false; }
        var tableId = id ? id : this.generateId();
        var rect = this.visualizer.AddRect(w, h, pos, movable, "table");
        rect.OnClick = function () { _this.onTableClick(tableId); };
        rect.OnMove = function () { _this.updateRoomPlan(tableId, rect.Position); };
        rect.ToggleClass("table");
        this.tables[tableId] = rect;
        return tableId;
    };
    RoomVisualizer.prototype.onTableClick = function (id) {
        for (var _i = 0, _a = this.bookedTables; _i < _a.length; _i++) {
            var table = _a[_i];
            if (table === id)
                return;
        }
        console.log("Table " + id + " clicked!");
        this.tables[id].Selected = !this.tables[id].Selected;
        this.tables[id].ToggleClass("table-selected");
    };
    /** Updates table position in roomPlan */
    RoomVisualizer.prototype.updateRoomPlan = function (tableID, pos) {
        if (this.roomPlan) {
            for (var _i = 0, _a = this.roomPlan.tables; _i < _a.length; _i++) {
                var t = _a[_i];
                if (t.id == tableID)
                    t.position = pos;
            }
        }
    };
    RoomVisualizer.prototype.generateId = function () {
        /*let id: number;
        do {
            id = Math.floor((Math.random() * 1000))
        }
        while (id in this.tables)
        console.log("Generated table ID: " + id);
        return id;*/
        var id = 0;
        while (id in this.tables) {
            id++;
        }
        return id;
    };
    return RoomVisualizer;
}());
//# sourceMappingURL=app.js.map