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
    const intSvg = new InteractiveSVG(roomPlan.width, roomPlan.height)
    const testElm1 = new InteractiveSVGElement(SVGHelper.NewRect(50, 50), {x: 620, y: 134}, true)
    const testElm2 = new InteractiveSVGElement(SVGHelper.NewRect(50, 50), {x: 150, y: 400}, true)
    const testElm3 = new InteractiveSVGElement(SVGHelper.NewRect(50, 50), {x: 250, y: 200}, true)
    intSvg.AddElement(testElm1);
    intSvg.AddElement(testElm2);
    intSvg.AddElement(testElm3);
    document.body.appendChild(intSvg.Wrapper);
}

class InteractiveSVGElement {
    public SvgElement: SVGElement;
    private pos: IPoint = { x: 0, y: 0 };
    public Moveable: boolean = false;
    public MousePos: IPoint | undefined; // for testing

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

        this.SvgElement.addEventListener("mousemove", (e) => {
            this.MousePos = { x: (e.layerX - this.pos.x), y: (e.layerY - this.pos.y) };
        });
    }
}

class InteractiveSVG {
    public Wrapper: HTMLElement;
    private svg: SVGElement;
    private width: number = 500;
    private height: number = 500;
    private elements: InteractiveSVGElement[] = [];
    private mousePos: IPoint | undefined;
    
    private moving: InteractiveSVGElement | undefined;
    private mouseOffset: IPoint | undefined;

    constructor(width: number, height: number) {
        this.width, this.height = width, height;
        this.Wrapper = document.createElement("div");
        this.Wrapper.id = "InteractiveSVGWrapper";
        this.svg = SVGHelper.NewSVG(width, height)
        this.Wrapper.appendChild(this.svg);

        this.svg.addEventListener("mousemove", (e: MouseEvent) => {
            this.mousePos = { x: e.layerX, y: e.layerY };
            if (this.moving) {
                if (this.mouseOffset) {
                    const newX = this.mousePos.x - this.mouseOffset.x;
                    const newY = this.mousePos.y - this.mouseOffset.y;
                    this.moving.Position = { x: newX, y: newY };
                }
            }
        });
        this.svg.addEventListener("mouseup", (e: MouseEvent) => {
            this.moving = undefined;
            this.mouseOffset = undefined;
        });
    }

    public AddElement(element: InteractiveSVGElement): void {
        this.svg.appendChild(element.SvgElement)
        if (element.Moveable) this.registerMoveableElement(element);
        this.elements.push(element);
    }

    private registerMoveableElement(element: InteractiveSVGElement) {
        element.SvgElement.addEventListener("mousedown", (e: MouseEvent) => {
            this.moving = element;
            const elmPos = element.Position;
            this.mouseOffset = { x: (e.layerX - elmPos.x), y: (e.layerY - elmPos.y) }
        });
    }
}

class RoomVisualizer {
    // takes IRoom as input and uses InteractiveSVG to visulize room
}

interface IPoint {
    x: number,
    y: number
}

interface ITable {
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
    public static SetSize(element: SVGElement, w: number, h: number) {
        element.setAttribute("width", w + "px");
        element.setAttribute("height", h + "px");
    }
    public static SetPosition(element: SVGElement, x: number, y: number) {
        element.setAttribute("x", x + "px");
        element.setAttribute("y", y + "px");
    }
}