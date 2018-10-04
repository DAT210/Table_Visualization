window.addEventListener("load", () => {
    fetch("/visualize")
        .then(r => { return r.json() })
        .then(roomPlan => {
            let room: IRoom = <IRoom>roomPlan;
            init(room);
        });
});

function init(roomPlan: IRoom) {
    console.log(roomPlan);
    const rv = new RoomVisualizer(roomPlan);
    console.log(rv);
}

interface IPoint {
    x: number,
    y: number
}

interface ITable {
    id: number,
    width: number,
    height: number,
    position: IPoint;
}

interface IWall {
    to: IPoint,
    from: IPoint
}

interface IRoom {
    width: number,
    height: number,
    tables: ITable[],
    walls: IWall[]
}

interface IInteractiveVisualizer {
    Wrapper: HTMLElement,
    AddRect(w: number, h: number, pos: IPoint, moveble?: boolean, clickHandler?: () => void): void,
    AddLine(pos1: IPoint, pos2: IPoint): void
}

class InteractiveSVG implements IInteractiveVisualizer {
    public Wrapper: HTMLElement;
    private svg: SVGElement;
    private width: number;
    private height: number;
    private elements: InteractiveSVGElement[] = [];
    private mousePos: IPoint | undefined;
    
    private currentlyMoving: InteractiveSVGElement | undefined;
    private mouseOffset: IPoint | undefined;

    constructor(width: number = 500, height: number = 500) {
        this.width = width;
        this.height = height;
        this.Wrapper = document.createElement("div");
        this.Wrapper.id = "InteractiveSVGWrapper";
        this.svg = SVGHelper.NewSVG(this.width, this.height)
        this.Wrapper.appendChild(this.svg);
        this.registerEventListeners();
    }

    private registerEventListeners(): void {
        this.svg.addEventListener("mousemove", (e: MouseEvent) => {
            this.mousePos = { x: e.layerX, y: e.layerY };
            if (this.currentlyMoving) {
                if (this.mouseOffset) {
                    const newX = this.mousePos.x - this.mouseOffset.x;
                    const newY = this.mousePos.y - this.mouseOffset.y;
                    this.currentlyMoving.Position = { x: newX, y: newY };
                }
            }
        });
        this.svg.addEventListener("mouseup", (e: MouseEvent) => {
            this.currentlyMoving = undefined;
            this.mouseOffset = undefined;
        });
        this.Wrapper.addEventListener("mouseleave", (e: MouseEvent) => {
            this.currentlyMoving = undefined;
            this.mouseOffset = undefined;
        });
    }

    public AddRect(w: number, h: number, pos: IPoint, moveable: boolean = false, clickHandler?: () => void): void {
        const elm = new InteractiveSVGElement(SVGHelper.NewRect(w, h), pos, moveable);
        if (clickHandler) elm.ClickHandler = clickHandler;
        this.addElement(elm);
    }

    public AddLine(pos1: IPoint, pos2: IPoint): void {
        const elm = new InteractiveSVGElement(SVGHelper.NewLine(pos1, pos2));
        this.addElement(elm);
    }

    private addElement(element: InteractiveSVGElement): void {
        this.svg.appendChild(element.SvgElement)
        if (element.Moveable) this.registerMoveableElement(element);
        this.elements.push(element);
    }

    private registerMoveableElement(element: InteractiveSVGElement) {
        element.SvgElement.addEventListener("mousedown", (e: MouseEvent) => {
            this.currentlyMoving = element;
            const elmPos = element.Position;
            this.mouseOffset = { x: (e.layerX - elmPos.x), y: (e.layerY - elmPos.y) }
        });
    }
}

class InteractiveSVGElement {
    public SvgElement: SVGElement;
    private pos: IPoint = { x: 0, y: 0 };
    private prevPos: IPoint | undefined;
    public Moveable: boolean = false;
    public ClickHandler: () => void = () => {};

    set Position(pos: IPoint) {
        SVGHelper.SetPosition(this.SvgElement, pos.x, pos.y);
        this.pos = pos;
    }
    get Position(): IPoint { return this.pos };

    constructor(element: SVGElement, position?: IPoint, moveable?: boolean) {
        this.SvgElement = element;
        if (moveable) this.Moveable = moveable;
        if (position) this.Position = position;
        else this.Position = { x: 0, y: 0 };
        
        this.SvgElement.addEventListener("mousedown", () => {
            this.prevPos = this.pos;
        });
        this.SvgElement.addEventListener("mouseup", () => {
            if (this.prevPos == this.pos) {
                this.ClickHandler();
            }
        });
    }
}

class RoomVisualizer {
    private visualizer: IInteractiveVisualizer;
    private roomPlan: IRoom;

    constructor(roomPlan: IRoom) {
        this.roomPlan = roomPlan;
        this.visualizer = new InteractiveSVG(roomPlan.width, roomPlan.height);

        document.body.appendChild(this.visualizer.Wrapper);

        this.drawWalls();
        this.drawTables();
    }

    private drawWalls(): void {
        for(let wall of this.roomPlan.walls) {
            this.visualizer.AddLine(wall.from, wall.to);
        }
    }

    private drawTables(): void {
        for(let table of this.roomPlan.tables) {
            this.visualizer.AddRect(
                table.width, 
                table.height, 
                table.position, 
                true, 
                () => { alert("Table " + table.id + " clicked!") }
            );
        }
    }
}

class SVGHelper {
    private static readonly svgNS = "http://www.w3.org/2000/svg";

    public static NewSVG(width: number, height: number): SVGElement {
        const svg = document.createElementNS(this.svgNS, "svg") as SVGElement;
        this.SetSize(svg, width, height);
        return svg;
    }
    public static NewRect(width: number, height: number): SVGRectElement {
        const rect = document.createElementNS(this.svgNS, "rect") as SVGRectElement;
        this.SetSize(rect, width, height);
        return rect;
    }
    public static NewLine(pos1: IPoint, pos2: IPoint): SVGLineElement {
        const line = document.createElementNS(this.svgNS, "line") as SVGLineElement;
        this.SetLinePos(line, pos1, pos2);
        return line;
    }
    public static SetSize(element: SVGElement, w: number, h: number) {
        element.setAttribute("width", w + "px");
        element.setAttribute("height", h + "px");
    }
    public static SetPosition(element: SVGElement, x: number, y: number) {
        element.setAttribute("x", x + "px");
        element.setAttribute("y", y + "px");
    }
    public static SetLinePos(element: SVGLineElement, pos1: IPoint, pos2: IPoint) {
        element.setAttribute("x1", pos1.x + "px");
        element.setAttribute("y1", pos1.y + "px");
        element.setAttribute("x2", pos2.x + "px");
        element.setAttribute("y2", pos2.y + "px");
    }
}