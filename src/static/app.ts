window.addEventListener("load", () => {
    path = window.location.pathname;
    substring = "/table/";

    // Sjekk om det er default bordoppsett eller alternative som skal lastes inn
    if(path.includes(substring)){
        var res = path.split("/")[2];
    fetch("/othertables/" + res)
        .then(r => { return r.json() })
        .then(roomPlan => {
            let room: IRoom = <IRoom>roomPlan;
            init(room);
        })
    }
    else{
            fetch("/visualize")
        .then(r => { return r.json() })
        .then(roomPlan => {
            let room: IRoom = <IRoom>roomPlan;
            init(room);
        })
    }
        });

const rv;
function init(roomPlan: IRoom) {
    console.log("RoomPlan:");
    console.log(roomPlan);
    const visualizer = new InteractiveSVG();
    rv = new RoomVisualizer(visualizer);
    rv.RoomPlan = roomPlan;
}

interface IPoint {
    x: number,
    y: number
}

interface ITable {
    id: number,
    width: number,
    height: number,
    position: IPoint
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
    Width: number,
    Height: number,
    AddRect(w: number, h: number, pos: IPoint, moveble?: boolean, tag?: string): InteractiveSVGRect,
    AddLine(pos1: IPoint, pos2: IPoint): InteractiveSVGLine,
    GetElements(tag: string): InteractiveSVGElement[],
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

    public AddRect(w: number, h: number, pos: IPoint, moveable: boolean = false, tag?: string): InteractiveSVGRect {
        const elm = new InteractiveSVGRect(w, h, pos, moveable, tag);
        this.addElement(elm);
        return elm;
    }
    public AddLine(pos1: IPoint, pos2: IPoint): InteractiveSVGLine {
        const elm = new InteractiveSVGLine(pos1, pos2);
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
            this.currentlyMoving = element;
            const elmPos = element.Position;
            this.mouseOffset = { x: (e.layerX - elmPos.x), y: (e.layerY - elmPos.y) }
        });
    }
}

abstract class InteractiveSVGElement {
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

    constructor(w: number, h: number, position?: IPoint, moveable?: boolean, tag?: string) {
        super(moveable, tag);
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

class RoomVisualizer {
    private visualizer: IInteractiveVisualizer;
    private roomPlan: IRoom | undefined;

    constructor(visualizer: IInteractiveVisualizer) {
        this.visualizer = visualizer;
        document.body.appendChild(this.visualizer.Wrapper);
    }

    set RoomPlan(roomPlan: IRoom) {
        this.roomPlan = roomPlan;
        this.visualizer.Width = this.roomPlan.width;
        this.visualizer.Height = this.roomPlan.height;
        this.drawRoom();
    }

    private drawRoom(): void {
        this.visualizer.Reset();
        this.drawWalls();
        this.drawTables();
    }
    private drawWalls(): void {
        if (!this.roomPlan) return;
        for(let wall of this.roomPlan.walls) {
            this.visualizer.AddLine(wall.from, wall.to);
        }
    }
    private drawTables(): void {
        if (!this.roomPlan) return;
        for(let table of this.roomPlan.tables) {
            const rect = this.visualizer.AddRect(
                table.width,
                table.height,
                table.position,
                true,
                "table"
            );
            rect.OnClick = () => { console.log("Table " + table.id + " clicked!") };
            rect.OnClick = () => { console.log("Table Position for table " + table.id +" " +  table.position) };
            rect.OnMove = () => { this.updateTablePos(table.id, rect.Position) };
        }
    }
    private updateTablePos(tableID: number, pos: IPoint): void {
        if (this.roomPlan) {
            for (let t of this.roomPlan.tables) {
                if (t.id == tableID) t.position = pos;
            }
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
}


// AJAX call hvor man går gjennom nåværende bordoppsett og sender det med json til serveren
function saveTableSetup(){
    if (!rv.roomPlan) return;
    var dict = [];
    var TableName = (<HTMLInputElement>document.getElementById('table-name')).value;
    for(let table of rv.roomPlan.tables) {
        dict.push({
            "id": table.id,
            "width": table.width,
            "height": table.height,
            "xpos": table.position.x,
            "ypos": table.position.y,
            "name": TableName
        })
    }
    var xhr = new XMLHttpRequest();
    var url = "/newroom";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Sjekk om server klarte å legge inn bordoppsettet i databasen
            var json = JSON.parse(xhr.responseText);
            var errorMsg = (<HTMLInputElement>document.getElementById('response-text'));
            if (json == "error"){
            errorMsg.style.color = "red";
            errorMsg.innerHTML = "Could not save this table layout";
            }
            else{
            errorMsg.style.color = "green";
            errorMsg.innerHTML = TableName + " was successfully added";
            }
        }
    }
    var data = JSON.stringify(dict);
    xhr.send(data);
}



function addTable(width, height){
    if (!rv.roomPlan) return;
    // Legger til et nytt element i sentrum, med størrelse lik innparameterene
    var center = {"x":250, "y":250};
       const newRect = rv.visualizer.AddRect(
            width,
            height,
            center,
            true,
            "table"
        );
    var tableID = rv.roomPlan.tables.length+1;
    rv.roomPlan.tables.push({"id":tableID, "width":width, "height": height, "position": center });
    newRect.OnMove = () => { rv.updateTablePos(tableID, newRect.Position) };

}
