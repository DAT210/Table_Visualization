interface IInteractiveVisualizer {
    Wrapper: HTMLElement,
    Width: number,
    Height: number,
    AddRect(w: number, h: number, pos: IPoint, movable?: boolean, tag?: string): IInteractiveVisualizerElement,
    AddLine(pos1: IPoint, pos2: IPoint): IInteractiveVisualizerElement,
    AddPath(): IInteractiveVisualizerElement,
    GetElements(tag: string): IInteractiveVisualizerElement[],
    Reset(): void
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

    get Width(): number { return this.width }
    set Width(w: number) { 
        this.width = w;
        SVGHelper.SetSize(this.svg, this.width, this.height);
    }    
    get Height(): number { return this.height }
    set Height(h: number) {
        this.height = h;
        SVGHelper.SetSize(this.svg, this.width, this.height);
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
    public AddPath() {
        const elm = new InteractiveSVGPath([{x:100, y:100}, {x:300, y:100}, {x:300, y:200}]);
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
        this.svg = SVGHelper.NewSVG(this.width, this.height);
        this.Wrapper.innerHTML = "";
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
    private addElement(element: InteractiveSVGElement): void {
        this.svg.appendChild(element.SvgElement)
        if (element.Movable) this.registerMovableElement(element);
        this.elements.push(element);
    }
    private registerMovableElement(element: InteractiveSVGElement) {
        element.SvgElement.addEventListener("mousedown", (e: MouseEvent) => {
            e.preventDefault()
            this.currentlyMoving = element;
            const elmPos = element.Position;
            this.mouseOffset = { x: (e.layerX - elmPos.x), y: (e.layerY - elmPos.y) }
        });
    }
}

interface IInteractiveVisualizerElement {
    SvgElement: SVGElement,
    Position: IPoint,
    Width: number,
    Height: number,
    PrevPosition: IPoint | undefined,
    Movable: boolean,
    OnClick: () => void,
    OnMove: () => void,
    Tag: string
}

abstract class InteractiveSVGElement implements IInteractiveVisualizerElement{
    public abstract SvgElement: SVGElement;
    public abstract Position: IPoint;
    public abstract Width: number;
    public abstract Height: number;
    
    public PrevPosition: IPoint | undefined;
    public Movable: boolean = false;
    public OnClick: () => void = () => {};
    public OnMove: () => void = () => {};

    private tag: string = "";

    constructor(movable?: boolean, tag?: string) {
        if (movable) this.Movable = movable;
        if (tag) this.tag = tag;
    }

    get Tag(): string { return this.tag }
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
        
        this.SvgElement.addEventListener("mousedown", () => {
            this.PrevPosition = this.pos;
        });
        this.SvgElement.addEventListener("mouseup", () => {
            if (this.PrevPosition == this.pos) {
                this.OnClick();
            }
        });
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

class InteractiveSVGPath extends InteractiveSVGElement {
    SvgElement: SVGPathElement;
    private points: IPoint[] = [];

    constructor(points: IPoint[]) {
        super();
        this.SvgElement = SVGHelper.NewPath();
        this.points = points;

        this.createPath();
    }

    get Position(): IPoint {
        const bbox = this.SvgElement.getBBox();
        return { x: bbox.x, y: bbox.y };
    }
    get Width(): number { return this.SvgElement.getBBox().width; }
    get Height(): number { return this.SvgElement.getBBox().height; }

    private createPath() {
        if (this.points.length < 2) return

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