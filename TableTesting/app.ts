window.addEventListener("load", () => {
    fetch("roomPlan.json")
        .then(r => { return r.json() })
        .then(roomPlan => {
            let room: IRoom = <IRoom>roomPlan;
        });

    new testing();
    
    /*let rect1 = SVGHelper.NewRect(30, 20);
    let rect2 = SVGHelper.NewRect(30, 20);
    let intSvg = new InteractiveSVG();
    intSvg.addElement(rect1, {x: 10, y: 40});
    intSvg.addElement(rect2, {x: 136, y: 60});

    document.body.appendChild(intSvg.wrapper);*/
});

class testing {
    svg: SVGElement;
    rect: SVGElement;
    moving = false;

    x: number = 0;
    y: number = 0;
    
    constructor() {
        let svg = SVGHelper.NewSVG(500, 500);
        let rect = SVGHelper.NewRect(50, 10);
        svg.appendChild(rect);
        let wrapper = document.getElementById("wrapper")
        if (wrapper != null) {
            wrapper.appendChild(svg);
        }

        this.svg = svg;
        this.rect = rect;

        rect.addEventListener("mousedown", (e) => {
            this.moving = true;
        });

        svg.addEventListener("mouseup", (e) => {
            this.moving = false;
        });

        svg.addEventListener("mousemove", (e) => {
            this.x = e.layerX;
            this.y = e.layerY;
            if (this.moving) {
                rect.setAttribute("x", this.x + "px")
                rect.setAttribute("y", this.y + "px")
            }
        });
    }
}


class InteractiveSVG {
    public wrapper: HTMLElement;
    private svg: SVGElement;

    constructor(width: number = 500, height: number = 500) {
        this.wrapper = document.createElement("div");
        this.wrapper.id = "InteractiveSVGWrapper";
        this.wrapper.style.position = "absolute"; // subject to change
        this.svg = SVGHelper.NewSVG(width, height)
        this.wrapper.appendChild(this.svg);
    }

    addElement(element: SVGElement, position: IPoint, moveable: boolean = true): void {
        this.svg.appendChild(element);
        SVGHelper.SetLocation(element, position.x, position.y);
        if (moveable) {
            this.registerMoveableElement(element);
        }
    }

    private registerMoveableElement(element: SVGElement) {
        element.addEventListener("mousedown", (e) => this.movementHandler(e));
    }

    private movementHandler(e: MouseEvent) {
        console.log(e);
    }
}

class MoveableSVGElement {
    element: SVGElement;
    posistion: IPoint;

    constructor(element: SVGElement, posistion: IPoint) {
        this.element = element;
        this.posistion = posistion;
        element.addEventListener("mousedown", (e) => );
    }
}

interface IPoint {
    x: number,
    y: number
}

interface ITable {
    width: number,
    height: number,
    location: IPoint;
}

interface IRoom {
    width: number,
    height: number,
    tables: ITable[]
}

class SVGHelper {
    private static readonly svgNS = "http://www.w3.org/2000/svg";

    public static NewSVG(width: number, height: number): SVGElement {
        let svg = document.createElementNS(this.svgNS, "svg") as SVGElement;
        this.SetSize(svg, width, height);
        return svg;
    }
    public static NewRect(width: number, height: number): SVGRectElement {
        let rect = document.createElementNS(this.svgNS, "rect") as SVGRectElement;
        this.SetSize(rect, width, height);
        return rect;
    }
    public static SetSize(element: SVGElement, w: number, h: number) {
        element.setAttribute("width", w + "px");
        element.setAttribute("height", h + "px");
    }
    public static SetLocation(element: SVGElement, x: number, y: number) {
        element.setAttribute("x", x + "px");
        element.setAttribute("y", y + "px");
    }
}