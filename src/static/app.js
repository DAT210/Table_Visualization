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
    console.log(roomPlan);
    var rv = new RoomVisualizer(roomPlan);
    console.log(rv);
}
var InteractiveSVG = /** @class */ (function () {
    function InteractiveSVG(width, height) {
        if (width === void 0) { width = 500; }
        if (height === void 0) { height = 500; }
        this.elements = [];
        this.width = width;
        this.height = height;
        this.Wrapper = document.createElement("div");
        this.Wrapper.id = "InteractiveSVGWrapper";
        this.svg = SVGHelper.NewSVG(this.width, this.height);
        this.Wrapper.appendChild(this.svg);
        this.registerEventListeners();
    }
    InteractiveSVG.prototype.registerEventListeners = function () {
        var _this = this;
        this.svg.addEventListener("mousemove", function (e) {
            _this.mousePos = { x: e.layerX, y: e.layerY };
            if (_this.currentlyMoving) {
                if (_this.mouseOffset) {
                    var newX = _this.mousePos.x - _this.mouseOffset.x;
                    var newY = _this.mousePos.y - _this.mouseOffset.y;
                    _this.currentlyMoving.Position = { x: newX, y: newY };
                }
            }
        });
        this.svg.addEventListener("mouseup", function (e) {
            _this.currentlyMoving = undefined;
            _this.mouseOffset = undefined;
        });
        this.Wrapper.addEventListener("mouseleave", function (e) {
            _this.currentlyMoving = undefined;
            _this.mouseOffset = undefined;
        });
    };
    InteractiveSVG.prototype.AddRect = function (w, h, pos, moveable, clickHandler) {
        if (moveable === void 0) { moveable = false; }
        var elm = new InteractiveSVGElement(SVGHelper.NewRect(w, h), pos, moveable);
        if (clickHandler)
            elm.ClickHandler = clickHandler;
        this.addElement(elm);
    };
    InteractiveSVG.prototype.AddLine = function (pos1, pos2) {
        var elm = new InteractiveSVGElement(SVGHelper.NewLine(pos1, pos2));
        this.addElement(elm);
    };
    InteractiveSVG.prototype.addElement = function (element) {
        this.svg.appendChild(element.SvgElement);
        if (element.Moveable)
            this.registerMoveableElement(element);
        this.elements.push(element);
    };
    InteractiveSVG.prototype.registerMoveableElement = function (element) {
        var _this = this;
        element.SvgElement.addEventListener("mousedown", function (e) {
            _this.currentlyMoving = element;
            var elmPos = element.Position;
            _this.mouseOffset = { x: (e.layerX - elmPos.x), y: (e.layerY - elmPos.y) };
        });
    };
    return InteractiveSVG;
}());
var InteractiveSVGElement = /** @class */ (function () {
    function InteractiveSVGElement(element, position, moveable) {
        var _this = this;
        this.pos = { x: 0, y: 0 };
        this.Moveable = false;
        this.ClickHandler = function () { };
        this.SvgElement = element;
        if (moveable)
            this.Moveable = moveable;
        if (position)
            this.Position = position;
        else
            this.Position = { x: 0, y: 0 };
        this.SvgElement.addEventListener("mousedown", function () {
            _this.prevPos = _this.pos;
        });
        this.SvgElement.addEventListener("mouseup", function () {
            if (_this.prevPos == _this.pos) {
                _this.ClickHandler();
            }
        });
    }
    Object.defineProperty(InteractiveSVGElement.prototype, "Position", {
        get: function () { return this.pos; },
        set: function (pos) {
            SVGHelper.SetPosition(this.SvgElement, pos.x, pos.y);
            this.pos = pos;
        },
        enumerable: true,
        configurable: true
    });
    ;
    return InteractiveSVGElement;
}());
var RoomVisualizer = /** @class */ (function () {
    function RoomVisualizer(roomPlan) {
        this.roomPlan = roomPlan;
        this.visualizer = new InteractiveSVG(roomPlan.width, roomPlan.height);
        document.body.appendChild(this.visualizer.Wrapper);
        this.drawWalls();
        this.drawTables();
    }
    RoomVisualizer.prototype.drawWalls = function () {
        for (var _i = 0, _a = this.roomPlan.walls; _i < _a.length; _i++) {
            var wall = _a[_i];
            this.visualizer.AddLine(wall.from, wall.to);
        }
    };
    RoomVisualizer.prototype.drawTables = function () {
        var _loop_1 = function (table) {
            this_1.visualizer.AddRect(table.width, table.height, table.position, true, function () { alert("Table " + table.id + " clicked!"); });
        };
        var this_1 = this;
        for (var _i = 0, _a = this.roomPlan.tables; _i < _a.length; _i++) {
            var table = _a[_i];
            _loop_1(table);
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
    SVGHelper.SetPosition = function (element, x, y) {
        element.setAttribute("x", x + "px");
        element.setAttribute("y", y + "px");
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
