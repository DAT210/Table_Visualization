interface IInteractiveVisualizer {
    Wrapper: HTMLElement,
    Width: number,
    Height: number,
    AddRect(w: number, h: number, pos: IPoint, movable?: boolean, tag?: string): IInteractiveVisualizerElement,
    AddLine(pos1: IPoint, pos2: IPoint): IInteractiveVisualizerElement,
    AddPoly(points: IPoint[], pos?: IPoint, movable?: boolean): IInteractiveVisualizerElement,
    GetElements(tag: string): IInteractiveVisualizerElement[],
    Reset(): void
}

class InteractiveSVG implements IInteractiveVisualizer {
    public Wrapper: HTMLElement;
    private svg: SVGSVGElement;
    private width: number;
    private height: number;
    private elements: InteractiveSVGElement[] = [];
    private mousePos: IPoint | undefined;
    
    private scale: number = 1.0;
    
    private currentlyMoving: InteractiveSVGElement | undefined;
    private mouseOffset: IPoint | undefined;

    constructor(width: number = 500, height: number = 500) {
        this.width = width;
        this.height = height;
        this.Wrapper = document.createElement("div");
        this.Wrapper.id = "InteractiveSVGWrapper";
        this.svg = SVGHelper.NewSVG(this.width, this.height);
        window.addEventListener("resize", () => this.onResize());
        this.init();
        
        // calc scale after everything is loaded
        setTimeout(() => this.calcScale(), 500);
    }

    get Width(): number { return this.width }
    set Width(w: number) {
        this.width = w;
        //SVGHelper.SetSize(this.svg, this.width, this.height);
        SVGHelper.SetViewBox(this.svg, 0, 0, this.width, this.height);
    }    
    get Height(): number { return this.height }
    set Height(h: number) {
        this.height = h;
        //SVGHelper.SetSize(this.svg, this.width, this.height);
        SVGHelper.SetViewBox(this.svg, 0, 0, this.width, this.height);
    }

    public AddRect(w: number, h: number, pos: IPoint, movable: boolean = false, tag?: string): InteractiveSVGRect {
        const elm = new InteractiveSVGRect(w, h, pos, movable, tag);
        this.addElement(elm);
        return elm;
    }
    public AddLine(pos1: IPoint, pos2: IPoint): InteractiveSVGLine {
        const elm = new InteractiveSVGLine(pos1, pos2);
        this.addElement(elm);
        return elm;
    }
    public AddPoly(points: IPoint[], pos?: IPoint, movable?: boolean) {
        const elm = new InteractiveSVGPoly(points, pos, movable);
        this.addElement(elm);
        return elm;
    }
    public GetElements(tag: string): InteractiveSVGElement[] {
        const elms: InteractiveSVGElement[] = [];
        for (let elm of this.elements) {
            if (elm.Tag == tag) elms.push(elm);
        }
        return elms;
    }
    public Reset(): void {
        this.elements = [];
        this.Wrapper.innerHTML = "";
        this.init();
    }

    private init(): void {
        this.svg = SVGHelper.NewSVG(this.width, this.height);
        SVGHelper.SetViewBox(this.svg, 0, 0, this.width, this.height);
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
                    const newPos = { x: newX/this.scale, y: newY/this.scale };
                    this.currentlyMoving.Position = newPos;
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
    private addElement(element: InteractiveSVGElement): void {
        this.elements.push(element);
        this.svg.appendChild(element.SvgElement)
        
        element.SvgElement.addEventListener("mousedown", (e: MouseEvent) => {
            if (element.Movable) {
                e.preventDefault()
                this.currentlyMoving = element;
                const elmPos = element.Position;
                this.mouseOffset = { 
                    x: (e.layerX - elmPos.x * this.scale),
                    y: (e.layerY - elmPos.y * this.scale)
                }
            }
        });
    }
    private onResize(): void {
        this.calcScale();
    }
    private calcScale(): void {
        const newScale = this.Wrapper.clientWidth / this.width ;
        this.scale = newScale;
    }
}

interface IInteractiveVisualizerElement {
    Width: number,
    Height: number,
    Position: IPoint,
    PrevPosition: IPoint | undefined,
    Movable: boolean,
    Tag: string | undefined,
    Selected: boolean;
    ToggleClass(className: string): void,
    OnClick: () => void,
    OnMove: () => void,
}

abstract class InteractiveSVGElement implements IInteractiveVisualizerElement {
    public abstract SvgElement: SVGElement;
    public abstract Position: IPoint;
    public abstract Width: number;
    public abstract Height: number;

    public PrevPosition: IPoint | undefined;
    public Movable: boolean = false;
    public Tag: string | undefined;
    public Selected: boolean = false;
    public OnClick: () => void = () => {};
    public OnMove: () => void = () => {};

    constructor(movable?: boolean, tag?: string) {
        if (movable) this.Movable = movable;
        if (tag) this.Tag = tag;
    }

    set Fill(color: string) { this.SvgElement.style.fill = color }
    set Stroke(color: string) { this.SvgElement.style.stroke = color }

    public ToggleClass(className: string) { this.SvgElement.classList.toggle(className) }

    protected registerEventListeners(): void {
        this.SvgElement.addEventListener("mousedown", () => {
            this.PrevPosition = this.Position;
        });
        this.SvgElement.addEventListener("mouseup", () => {
            if (this.PrevPosition == this.Position) {
                this.OnClick();
            }
        });
    }
}

class InteractiveSVGRect extends InteractiveSVGElement {
    public SvgElement: SVGRectElement;

    private pos: IPoint = { x: 0, y: 0 };
    private width: number = 0;
    private height: number = 0;

    constructor(w: number, h: number, position?: IPoint, movable?: boolean, tag?: string) {
        super(movable, tag);
        this.SvgElement = SVGHelper.NewRect(w, h);
        if (position) this.Position = position;
        else this.Position = { x: 0, y: 0 };
        this.width = w;
        this.height = h;
        this.registerEventListeners();        
    }

    set Position(pos: IPoint) {
        SVGHelper.SetPosition(this.SvgElement, pos);
        this.pos = pos;
        this.OnMove();
    }
    get Position(): IPoint { return this.pos };

    set Width(w: number) {
        this.width = w;
        SVGHelper.SetSize(this.SvgElement, this.width, this.height);
    }
    get Width() { return this.width; }
    set Height(h: number) {
        this.height = h;
        SVGHelper.SetSize(this.SvgElement, this.width, this.height);
    }
    get Height() { return this.height; }
}

class InteractiveSVGLine extends InteractiveSVGElement {
    public SvgElement: SVGLineElement;

    constructor(pos1: IPoint, pos2: IPoint, movable?: boolean, tag?: string) {
        super(movable, tag);
        this.SvgElement = SVGHelper.NewLine(pos1, pos2);
        this.registerEventListeners();
    }

    get Position(): IPoint {
        const bBox = this.SvgElement.getBBox();
        return { x: bBox.x, y: bBox.y }
    }
    set Position(pos: IPoint) { throw new Error("Not implemented") }

    get Width(): number { return this.SvgElement.getBBox().width }
    set Width(w: number) { throw new Error("Not implemented") }
    get Height(): number { return this.SvgElement.getBBox().height }
    set Height(w: number) { throw new Error("Not implemented") }
}

class InteractiveSVGPoly extends InteractiveSVGElement {
    SvgElement: SVGPathElement;
    private points: IPoint[] = [];

    constructor(points: IPoint[], pos?: IPoint, movable?: boolean) {
        super(movable);
        this.SvgElement = SVGHelper.NewPath();
        this.Points = points;
        if (pos) this.Position = pos;
        this.registerEventListeners();
    }

    get Points() { return this.points; }
    set Points(points: IPoint[]) {
        this.points = points;
        this.createPath();
    }

    set Position(pos: IPoint) {
        const deltaX = pos.x - this.Position.x;
        const deltaY = pos.y - this.Position.y;
        const newPoints = this.points.slice(0);
        for (let p of newPoints) {
            p.x += deltaX;
            p.y += deltaY;
        }
        this.Points = newPoints;
    }
    get Position(): IPoint {
        const bbox = this.SvgElement.getBBox();
        return { x: bbox.x, y: bbox.y };
    }
    get Width(): number { return this.SvgElement.getBBox().width; }
    get Height(): number { return this.SvgElement.getBBox().height; }

    private createPath() {
        if (this.points.length === 0) return;

        const pointToString = (p: IPoint) => {
            return p.x + " " + p.y;
        }

        let pathDef = "M" + pointToString(this.points[0])
        for (let p of this.points.slice(1)) {
            pathDef += " L" + pointToString(p);
        }

        this.SvgElement.setAttribute("d", pathDef);
    }


}

class SVGHelper {
    private static readonly svgNS = "http://www.w3.org/2000/svg";

    public static NewSVG(width: number, height: number): SVGSVGElement {
        const svg = document.createElementNS(this.svgNS, "svg") as SVGSVGElement;
        //this.SetSize(svg, width, height);
        this.SetViewBox(svg, 0, 0, width, height);
        return svg;
    }
    public static NewSVGElement(width: number, height: number): SVGElement {
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
    public static NewPath(): SVGPathElement {
        return document.createElementNS(this.svgNS, "path");
    }
    public static SetSize(element: SVGElement, w: number, h: number) {
        element.setAttribute("width", w + "px");
        element.setAttribute("height", h + "px");
    }
    public static GetWidth(element: SVGRectElement): number {
        return element.width.baseVal.value;
    }
    public static GetHeight(element: SVGRectElement): number {
        return element.height.baseVal.value;
    }
    public static SetPosition(element: SVGElement, pos: IPoint) {
        element.setAttribute("x", pos.x + "px");
        element.setAttribute("y", pos.y + "px");
    }
    public static SetLinePos(element: SVGLineElement, pos1: IPoint, pos2: IPoint) {
        element.setAttribute("x1", pos1.x + "px");
        element.setAttribute("y1", pos1.y + "px");
        element.setAttribute("x2", pos2.x + "px");
        element.setAttribute("y2", pos2.y + "px");
    }
    public static SetViewBox(element: SVGSVGElement, x: number, y: number, w: number, h: number) {
        element.setAttribute("viewBox", `${x} ${y} ${w} ${h}`);
    }
}
