"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var InteractiveSVG = /** @class */ (function () {
    function InteractiveSVG(width, height) {
        if (width === void 0) { width = 500; }
        if (height === void 0) { height = 500; }
        var _this = this;
        this.elements = [];
        this.scale = 1.0;
        this.width = width;
        this.height = height;
        this.Wrapper = document.createElement("div");
        this.Wrapper.id = "InteractiveSVGWrapper";
        this.svg = SVGHelper.NewSVG(this.width, this.height);
        window.addEventListener("resize", function () { return _this.onResize(); });
        this.init();
        // calc scale after everything is loaded
        setTimeout(function () { return _this.calcScale(); }, 500);
    }
    Object.defineProperty(InteractiveSVG.prototype, "Width", {
        get: function () { return this.width; },
        set: function (w) {
            this.width = w;
            //SVGHelper.SetSize(this.svg, this.width, this.height);
            SVGHelper.SetViewBox(this.svg, 0, 0, this.width, this.height);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InteractiveSVG.prototype, "Height", {
        get: function () { return this.height; },
        set: function (h) {
            this.height = h;
            //SVGHelper.SetSize(this.svg, this.width, this.height);
            SVGHelper.SetViewBox(this.svg, 0, 0, this.width, this.height);
        },
        enumerable: true,
        configurable: true
    });
    InteractiveSVG.prototype.AddRect = function (w, h, pos, movable, tag) {
        if (movable === void 0) { movable = false; }
        var elm = new InteractiveSVGRect(w, h, pos, movable, tag);
        this.addElement(elm);
        return elm;
    };
    InteractiveSVG.prototype.AddLine = function (pos1, pos2) {
        var elm = new InteractiveSVGLine(pos1, pos2);
        this.addElement(elm);
        return elm;
    };
    InteractiveSVG.prototype.AddPoly = function (points, pos, movable) {
        var elm = new InteractiveSVGPoly(points, pos, movable);
        this.addElement(elm);
        return elm;
    };
    InteractiveSVG.prototype.GetElements = function (tag) {
        var elms = [];
        for (var _i = 0, _a = this.elements; _i < _a.length; _i++) {
            var elm = _a[_i];
            if (elm.Tag == tag)
                elms.push(elm);
        }
        return elms;
    };
    InteractiveSVG.prototype.CenterContent = function () {
        var left = this.width;
        var right = 0;
        var top = this.height;
        var bottom = 0;
        for (var _i = 0, _a = this.elements; _i < _a.length; _i++) {
            var e = _a[_i];
            var elementLeft = e.Position.x;
            var elementRight = e.Position.x + e.Width;
            var elementTop = e.Position.y;
            var elementBottom = e.Position.y + e.Height;
            if (elementLeft < left)
                left = elementLeft;
            if (elementRight > right)
                right = elementRight;
            if (elementTop < top)
                top = elementTop;
            if (elementBottom > bottom)
                bottom = elementBottom;
        }
        var diffX = Math.abs((this.width - right) - left);
        var diffY = Math.abs((this.height - bottom) - top);
        SVGHelper.SetViewBox(this.svg, diffX / 2, diffY / 2, this.width, this.height);
    };
    InteractiveSVG.prototype.Reset = function () {
        this.elements = [];
        this.Wrapper.innerHTML = "";
        this.init();
    };
    InteractiveSVG.prototype.init = function () {
        this.svg = SVGHelper.NewSVG(this.width, this.height);
        SVGHelper.SetViewBox(this.svg, 0, 0, this.width, this.height);
        this.Wrapper.appendChild(this.svg);
        this.registerEventListeners();
    };
    InteractiveSVG.prototype.registerEventListeners = function () {
        var _this = this;
        this.svg.addEventListener("mousemove", function (e) {
            _this.mousePos = { x: e.layerX, y: e.layerY };
            if (_this.currentlyMoving) {
                if (_this.mouseOffset) {
                    var newX = _this.mousePos.x - _this.mouseOffset.x;
                    var newY = _this.mousePos.y - _this.mouseOffset.y;
                    var newPos = { x: newX / _this.scale, y: newY / _this.scale };
                    _this.currentlyMoving.Position = newPos;
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
    InteractiveSVG.prototype.addElement = function (element) {
        var _this = this;
        this.elements.push(element);
        this.svg.appendChild(element.SvgElement);
        element.SvgElement.addEventListener("mousedown", function (e) {
            if (element.Movable) {
                e.preventDefault();
                _this.currentlyMoving = element;
                var elmPos = element.Position;
                _this.mouseOffset = {
                    x: (e.layerX - elmPos.x * _this.scale),
                    y: (e.layerY - elmPos.y * _this.scale)
                };
            }
        });
    };
    InteractiveSVG.prototype.onResize = function () {
        this.calcScale();
    };
    InteractiveSVG.prototype.calcScale = function () {
        var newScale = this.Wrapper.clientWidth / this.width;
        this.scale = newScale;
    };
    return InteractiveSVG;
}());
var InteractiveSVGElement = /** @class */ (function () {
    function InteractiveSVGElement(movable, tag) {
        this.Movable = false;
        this.Selected = false;
        this.OnClick = function () { };
        this.OnMove = function () { };
        if (movable)
            this.Movable = movable;
        if (tag)
            this.Tag = tag;
    }
    Object.defineProperty(InteractiveSVGElement.prototype, "Fill", {
        set: function (color) { this.SvgElement.style.fill = color; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InteractiveSVGElement.prototype, "Stroke", {
        set: function (color) { this.SvgElement.style.stroke = color; },
        enumerable: true,
        configurable: true
    });
    InteractiveSVGElement.prototype.ToggleClass = function (className) { this.SvgElement.classList.toggle(className); };
    InteractiveSVGElement.prototype.registerEventListeners = function () {
        var _this = this;
        this.SvgElement.addEventListener("mousedown", function () {
            _this.PrevPosition = _this.Position;
        });
        this.SvgElement.addEventListener("mouseup", function () {
            if (_this.PrevPosition == _this.Position) {
                _this.OnClick();
            }
        });
    };
    return InteractiveSVGElement;
}());
var InteractiveSVGRect = /** @class */ (function (_super) {
    __extends(InteractiveSVGRect, _super);
    function InteractiveSVGRect(w, h, position, movable, tag) {
        var _this = _super.call(this, movable, tag) || this;
        _this.pos = { x: 0, y: 0 };
        _this.width = 0;
        _this.height = 0;
        _this.SvgElement = SVGHelper.NewRect(w, h);
        if (position)
            _this.Position = position;
        else
            _this.Position = { x: 0, y: 0 };
        _this.width = w;
        _this.height = h;
        _this.registerEventListeners();
        return _this;
    }
    Object.defineProperty(InteractiveSVGRect.prototype, "Position", {
        get: function () { return this.pos; },
        set: function (pos) {
            SVGHelper.SetPosition(this.SvgElement, pos);
            this.pos = pos;
            this.OnMove();
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(InteractiveSVGRect.prototype, "Width", {
        get: function () { return this.width; },
        set: function (w) {
            this.width = w;
            SVGHelper.SetSize(this.SvgElement, this.width, this.height);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InteractiveSVGRect.prototype, "Height", {
        get: function () { return this.height; },
        set: function (h) {
            this.height = h;
            SVGHelper.SetSize(this.SvgElement, this.width, this.height);
        },
        enumerable: true,
        configurable: true
    });
    return InteractiveSVGRect;
}(InteractiveSVGElement));
var InteractiveSVGLine = /** @class */ (function (_super) {
    __extends(InteractiveSVGLine, _super);
    function InteractiveSVGLine(pos1, pos2, movable, tag) {
        var _this = _super.call(this, movable, tag) || this;
        _this.SvgElement = SVGHelper.NewLine(pos1, pos2);
        _this.registerEventListeners();
        return _this;
    }
    Object.defineProperty(InteractiveSVGLine.prototype, "Position", {
        get: function () {
            var bBox = this.SvgElement.getBBox();
            return { x: bBox.x, y: bBox.y };
        },
        set: function (pos) { throw new Error("Not implemented"); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InteractiveSVGLine.prototype, "Width", {
        get: function () { return this.SvgElement.getBBox().width; },
        set: function (w) { throw new Error("Not implemented"); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InteractiveSVGLine.prototype, "Height", {
        get: function () { return this.SvgElement.getBBox().height; },
        set: function (w) { throw new Error("Not implemented"); },
        enumerable: true,
        configurable: true
    });
    return InteractiveSVGLine;
}(InteractiveSVGElement));
var InteractiveSVGPoly = /** @class */ (function (_super) {
    __extends(InteractiveSVGPoly, _super);
    function InteractiveSVGPoly(points, pos, movable) {
        var _this = _super.call(this, movable) || this;
        _this.points = [];
        _this.SvgElement = SVGHelper.NewPath();
        _this.Points = points;
        if (pos)
            _this.Position = pos;
        _this.registerEventListeners();
        return _this;
    }
    Object.defineProperty(InteractiveSVGPoly.prototype, "Points", {
        get: function () { return this.points; },
        set: function (points) {
            this.points = points;
            this.createPath();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InteractiveSVGPoly.prototype, "Position", {
        get: function () {
            var bbox = this.SvgElement.getBBox();
            return { x: bbox.x, y: bbox.y };
        },
        set: function (pos) {
            var deltaX = pos.x - this.Position.x;
            var deltaY = pos.y - this.Position.y;
            var newPoints = this.points.slice(0);
            for (var _i = 0, newPoints_1 = newPoints; _i < newPoints_1.length; _i++) {
                var p = newPoints_1[_i];
                p.x += deltaX;
                p.y += deltaY;
            }
            this.Points = newPoints;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InteractiveSVGPoly.prototype, "Width", {
        get: function () { return this.SvgElement.getBBox().width; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InteractiveSVGPoly.prototype, "Height", {
        get: function () { return this.SvgElement.getBBox().height; },
        enumerable: true,
        configurable: true
    });
    InteractiveSVGPoly.prototype.createPath = function () {
        if (this.points.length === 0)
            return;
        var pointToString = function (p) {
            return p.x + " " + p.y;
        };
        var pathDef = "M" + pointToString(this.points[0]);
        for (var _i = 0, _a = this.points.slice(1); _i < _a.length; _i++) {
            var p = _a[_i];
            pathDef += " L" + pointToString(p);
        }
        this.SvgElement.setAttribute("d", pathDef);
    };
    return InteractiveSVGPoly;
}(InteractiveSVGElement));
var SVGHelper = /** @class */ (function () {
    function SVGHelper() {
    }
    SVGHelper.NewSVG = function (width, height) {
        var svg = document.createElementNS(this.svgNS, "svg");
        //this.SetSize(svg, width, height);
        this.SetViewBox(svg, 0, 0, width, height);
        return svg;
    };
    SVGHelper.NewSVGElement = function (width, height) {
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
    SVGHelper.NewPath = function () {
        return document.createElementNS(this.svgNS, "path");
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
    SVGHelper.SetViewBox = function (element, x, y, w, h) {
        element.setAttribute("viewBox", x + " " + y + " " + w + " " + h);
    };
    SVGHelper.svgNS = "http://www.w3.org/2000/svg";
    return SVGHelper;
}());
//# sourceMappingURL=visualizer.js.map