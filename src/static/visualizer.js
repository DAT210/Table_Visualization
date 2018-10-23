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
        this.elements = [];
        this.width = width;
        this.height = height;
        this.Wrapper = document.createElement("div");
        this.Wrapper.id = "InteractiveSVGWrapper";
        this.svg = SVGHelper.NewSVG(this.width, this.height);
        this.Wrapper.appendChild(this.svg);
        this.registerEventListeners();
    }
    Object.defineProperty(InteractiveSVG.prototype, "Width", {
        get: function () { return this.width; },
        set: function (w) {
            this.width = w;
            SVGHelper.SetSize(this.svg, this.width, this.height);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InteractiveSVG.prototype, "Height", {
        get: function () { return this.height; },
        set: function (h) {
            this.height = h;
            SVGHelper.SetSize(this.svg, this.width, this.height);
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
    InteractiveSVG.prototype.Reset = function () {
        this.elements = [];
        this.svg = SVGHelper.NewSVG(this.width, this.height);
        this.Wrapper.innerHTML = "";
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
    InteractiveSVG.prototype.addElement = function (element) {
        this.svg.appendChild(element.SvgElement);
        if (element.Movable)
            this.registerMovableElement(element);
        this.elements.push(element);
    };
    InteractiveSVG.prototype.registerMovableElement = function (element) {
        var _this = this;
        element.SvgElement.addEventListener("mousedown", function (e) {
            e.preventDefault();
            _this.currentlyMoving = element;
            var elmPos = element.Position;
            _this.mouseOffset = { x: (e.layerX - elmPos.x), y: (e.layerY - elmPos.y) };
        });
    };
    return InteractiveSVG;
}());
var InteractiveSVGElement = /** @class */ (function () {
    function InteractiveSVGElement(movable, tag) {
        this.Movable = false;
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
        _this.SvgElement.addEventListener("mousedown", function () {
            _this.PrevPosition = _this.pos;
        });
        _this.SvgElement.addEventListener("mouseup", function () {
            if (_this.PrevPosition == _this.pos) {
                _this.OnClick();
            }
        });
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
