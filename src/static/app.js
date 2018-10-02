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
    var intSvg = new InteractiveSVG(roomPlan.width, roomPlan.height);
    var testElm1 = new InteractiveSVGElement(SVGHelper.NewRect(50, 50), { x: 620, y: 134 }, true);
    var testElm2 = new InteractiveSVGElement(SVGHelper.NewRect(50, 50), { x: 150, y: 400 }, true);
    var testElm3 = new InteractiveSVGElement(SVGHelper.NewRect(50, 50), { x: 250, y: 200 }, true);
    intSvg.AddElement(testElm1);
    intSvg.AddElement(testElm2);
    intSvg.AddElement(testElm3);
    document.body.appendChild(intSvg.Wrapper);
}
var InteractiveSVGElement = /** @class */ (function () {
    function InteractiveSVGElement(element, position, moveable) {
        var _this = this;
        this.pos = { x: 0, y: 0 };
        this.Moveable = false;
        this.SvgElement = element;
        if (moveable)
            this.Moveable = moveable;
        if (position)
            this.Position = position;
        else
            this.Position = { x: 0, y: 0 };
        this.SvgElement.addEventListener("mousemove", function (e) {
            _this.MousePos = { x: (e.layerX - _this.pos.x), y: (e.layerY - _this.pos.y) };
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
var InteractiveSVG = /** @class */ (function () {
    function InteractiveSVG(width, height) {
        var _this = this;
        this.width = 500;
        this.height = 500;
        this.elements = [];
        this.width, this.height = width, height;
        this.Wrapper = document.createElement("div");
        this.Wrapper.id = "InteractiveSVGWrapper";
        this.svg = SVGHelper.NewSVG(width, height);
        this.Wrapper.appendChild(this.svg);
        this.svg.addEventListener("mousemove", function (e) {
            _this.mousePos = { x: e.layerX, y: e.layerY };
            if (_this.moving) {
                if (_this.mouseOffset) {
                    var newX = _this.mousePos.x - _this.mouseOffset.x;
                    var newY = _this.mousePos.y - _this.mouseOffset.y;
                    _this.moving.Position = { x: newX, y: newY };
                }
            }
        });
        this.svg.addEventListener("mouseup", function (e) {
            _this.moving = undefined;
            _this.mouseOffset = undefined;
        });
    }
    InteractiveSVG.prototype.AddElement = function (element) {
        this.svg.appendChild(element.SvgElement);
        if (element.Moveable)
            this.registerMoveableElement(element);
        this.elements.push(element);
    };
    InteractiveSVG.prototype.registerMoveableElement = function (element) {
        var _this = this;
        element.SvgElement.addEventListener("mousedown", function (e) {
            _this.moving = element;
            var elmPos = element.Position;
            _this.mouseOffset = { x: (e.layerX - elmPos.x), y: (e.layerY - elmPos.y) };
        });
    };
    return InteractiveSVG;
}());
var RoomVisualizer = /** @class */ (function () {
    function RoomVisualizer() {
    }
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
    SVGHelper.SetSize = function (element, w, h) {
        element.setAttribute("width", w + "px");
        element.setAttribute("height", h + "px");
    };
    SVGHelper.SetPosition = function (element, x, y) {
        element.setAttribute("x", x + "px");
        element.setAttribute("y", y + "px");
    };
    SVGHelper.svgNS = "http://www.w3.org/2000/svg";
    return SVGHelper;
}());
