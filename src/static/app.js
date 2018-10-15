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
window.addEventListener("load", function () {
    console.log("Laste injn");
    path = window.location.pathname;
    substring = "/table/";
    var res = path.split("/")[2];
    fetch("/othertables/" + res)
        .then(function (r) { return r.json(); })
        .then(function (roomPlan) {
        var room = roomPlan;
        init(room);
    });
});
var rv;
function init(roomPlan) {
    console.log("RoomPlan:");
    console.log(roomPlan);
    var visualizer = new InteractiveSVG();
    rv = new RoomVisualizer(visualizer);
    rv.RoomPlan = roomPlan;
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
    InteractiveSVG.prototype.AddRect = function (w, h, pos, moveable, tag) {
        if (moveable === void 0) { moveable = false; }
        var elm = new InteractiveSVGRect(w, h, pos, moveable, tag);
        this.addElement(elm);
        return elm;
    };
    InteractiveSVG.prototype.AddLine = function (pos1, pos2) {
        var elm = new InteractiveSVGLine(pos1, pos2);
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
        this.tag = "";
        if (movable)
            this.Movable = movable;
        if (tag)
            this.tag = tag;
    }
    Object.defineProperty(InteractiveSVGElement.prototype, "Tag", {
        get: function () { return this.tag; },
        enumerable: true,
        configurable: true
    });
    return InteractiveSVGElement;
}());
var InteractiveSVGRect = /** @class */ (function (_super) {
    __extends(InteractiveSVGRect, _super);
    function InteractiveSVGRect(w, h, position, moveable, tag) {
        var _this = _super.call(this, moveable, tag) || this;
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
var RoomVisualizer = /** @class */ (function () {
    function RoomVisualizer(visualizer) {
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
            rect.OnClick = function () { console.log("Table Position for table " + table.id + " " + table.position); };
            rect.OnMove = function () { _this.updateTablePos(table.id, rect.Position); };
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
// AJAX call hvor man går gjennom nåværende bordoppsett og sender det med json til serveren
function saveTableSetup() {
    if (!rv.roomPlan)
        return;
    var dict = [];
    var TableName = document.getElementById('table-name').value;
    for (var _i = 0, _a = rv.roomPlan.tables; _i < _a.length; _i++) {
        var table = _a[_i];
        dict.push({
            "id": table.id,
            "width": table.width,
            "height": table.height,
            "xpos": table.position.x,
            "ypos": table.position.y,
            "name": TableName
        });
    }
    var xhr = new XMLHttpRequest();
    var url = "/newroom";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Sjekk om server klarte å legge inn bordoppsettet i databasen
            var json = JSON.parse(xhr.responseText);
            var errorMsg = document.getElementById('response-text');
            if (json == "error") {
                errorMsg.style.color = "red";
                errorMsg.innerHTML = "Could not save this table layout";
            }
            else {
                errorMsg.style.color = "green";
                errorMsg.innerHTML = TableName + " was successfully added";
            }
        }
    };
    var data = JSON.stringify(dict);
    xhr.send(data);
}
function addTable(width, height) {
    if (!rv.roomPlan)
        return;
    // Legger til et nytt element i sentrum, med størrelse lik innparameterene
    var center = { "x": 250, "y": 250 };
    var newRect = rv.visualizer.AddRect(width, height, center, true, "table");
    var tableID = rv.roomPlan.tables.length + 1;
    rv.roomPlan.tables.push({ "id": tableID, "width": width, "height": height, "position": center });
    newRect.OnMove = function () { rv.updateTablePos(tableID, newRect.Position); };
}
