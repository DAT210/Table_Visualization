"use strict";
var RoomVisualizer = /** @class */ (function () {
    function RoomVisualizer(visualizer, movableTables) {
        if (movableTables === void 0) { movableTables = false; }
        this.tables = {};
        this.unavailableTables = [];
        this.visualizer = visualizer;
        document.body.appendChild(this.visualizer.Wrapper);
        this.movableTables = movableTables;
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
    RoomVisualizer.prototype.SetTableAvailability = function (tableIDs) {
        this.unavailableTables = tableIDs;
        console.log(tableIDs);
        for (var _i = 0, tableIDs_1 = tableIDs; _i < tableIDs_1.length; _i++) {
            var tableID = tableIDs_1[_i];
            console.log(tableID);
            if (tableID in this.tables) {
                this.tables[tableID].ToggleClass("table-booked");
            }
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
        this.room = this.visualizer.AddPoly(wallPoints);
        this.room.ToggleClass("room");
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
        for (var _i = 0, _a = this.unavailableTables; _i < _a.length; _i++) {
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
        var id;
        do {
            id = Math.floor((Math.random() * 1000));
        } while (id in this.tables);
        console.log("Generated table ID: " + id);
        return id;
    };
    return RoomVisualizer;
}());
