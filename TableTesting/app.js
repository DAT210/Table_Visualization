"use strict";
window.addEventListener("load", function () {
    fetch("roomPlan.json")
        .then(function (r) { return r.json(); })
        .then(function (roomPlan) {
        var room = roomPlan;
    });
    new testing();
    /*let rect1 = SVGHelper.NewRect(30, 20);
    let rect2 = SVGHelper.NewRect(30, 20);
    let intSvg = new InteractiveSVG();
    intSvg.addElement(rect1, {x: 10, y: 40});
    intSvg.addElement(rect2, {x: 136, y: 60});

    document.body.appendChild(intSvg.wrapper);*/
});
var testing = /** @class */ (function () {
    function testing() {
        var _this = this;
        this.moving = false;
        this.x = 0;
        this.y = 0;
        var svg = SVGHelper.NewSVG(500, 500);
        var rect = SVGHelper.NewRect(50, 10);
        svg.appendChild(rect);
        var wrapper = document.getElementById("wrapper");
        if (wrapper != null) {
            wrapper.appendChild(svg);
        }
        this.svg = svg;
        this.rect = rect;
        rect.addEventListener("mousedown", function (e) {
            _this.moving = true;
        });
        svg.addEventListener("mouseup", function (e) {
            _this.moving = false;
        });
        svg.addEventListener("mousemove", function (e) {
            _this.x = e.layerX;
            _this.y = e.layerY;
            if (_this.moving) {
                rect.setAttribute("x", _this.x + "px");
                rect.setAttribute("y", _this.y + "px");
            }
        });
    }
    return testing;
}());
var InteractiveSVG = /** @class */ (function () {
    function InteractiveSVG(width, height) {
        if (width === void 0) { width = 500; }
        if (height === void 0) { height = 500; }
        this.wrapper = document.createElement("div");
        this.wrapper.id = "InteractiveSVGWrapper";
        this.wrapper.style.position = "absolute"; // subject to change
        this.svg = SVGHelper.NewSVG(width, height);
        this.wrapper.appendChild(this.svg);
    }
    InteractiveSVG.prototype.addElement = function (element, position, moveable) {
        if (moveable === void 0) { moveable = true; }
        this.svg.appendChild(element);
        SVGHelper.SetLocation(element, position.x, position.y);
        if (moveable) {
            this.registerMoveableElement(element);
        }
    };
    InteractiveSVG.prototype.registerMoveableElement = function (element) {
        var _this = this;
        element.addEventListener("mousedown", function (e) { return _this.movementHandler(e); });
    };
    InteractiveSVG.prototype.movementHandler = function (e) {
        console.log(e);
    };
    return InteractiveSVG;
}());
var MoveableSVGElement = /** @class */ (function () {
    function MoveableSVGElement(element, posistion) {
        this.element = element;
        this.posistion = posistion;
        element.addEventListener("mousedown", function (e) { return ; });
    }
    return MoveableSVGElement;
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
    SVGHelper.SetLocation = function (element, x, y) {
        element.setAttribute("x", x + "px");
        element.setAttribute("y", y + "px");
    };
    SVGHelper.svgNS = "http://www.w3.org/2000/svg";
    return SVGHelper;
}());
