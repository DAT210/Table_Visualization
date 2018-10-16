"use strict";
window.addEventListener("load", function () {
    fetch("/visualize")
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
    rv.example(2);
}
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
    /** Example code to alter table color */
    RoomVisualizer.prototype.example = function (tableID) {
        if (tableID in this.tables) {
            this.tables[tableID].SvgElement.style.fill = "red";
        }
    };
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
