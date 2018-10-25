window.addEventListener("load", () => {
    fetch("/load/json")
        .then(r => { return r.json() })
        .then(roomPlan => {
            let room: IRoom = <IRoom>roomPlan;
            init(room);
        })
        });


function init(roomPlan: IRoom) {
    console.log("RoomPlan:");
    console.log(roomPlan);
    const visualizer = new InteractiveSVG();
    const rv = new RoomVisualizerAdmin(visualizer);
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


class RoomVisualizerAdmin {
    private visualizer: IInteractiveVisualizer;
    private roomPlan: IRoom | undefined;

    constructor(visualizer: IInteractiveVisualizer) {
        this.visualizer = visualizer;
        document.body.appendChild(this.visualizer.Wrapper);
        var box = (<HTMLInputElement>document.getElementById('box1'));
        var savebtn = (<HTMLInputElement>document.getElementsByClassName('saveBtn')[0]);
        var updatebtn = (<HTMLInputElement>document.getElementsByClassName('updateBtn')[0]);
        box.style.width = 60 + "px";
        box.style.height = 40 + "px";
        box.onclick = () => { this.addTable()};
        savebtn.onclick = () => {this.saveTableLayout('add')};
        updatebtn.onclick = () => {this.updateTableLayout('update')};
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
    private getTableSetup(name: string, value: string) {
        if (!this.roomPlan) return;
    var dict = [];

        for(let table of this.roomPlan.tables) {
    dict.push({
        "id": table.id,
        "width": table.width,
        "height": table.height,
        "xpos": table.position.x,
        "ypos": table.position.y,
        "status": value,
        "name": name
    })
}
    return dict;
}

    private addTable(){
        if (!this.roomPlan) return;
        var box = (<HTMLInputElement>document.getElementById('box1'));
        var height = Number(box.style.height.split("px")[0]);
        var width = Number(box.style.width.split("px")[0]);
        var e = document.getElementById('capacityList') as HTMLSelectElement;
        var strUser = e.options[e.selectedIndex].value;
        console.log(strUser);
        // Legger til et nytt element i sentrum, med størrelse lik innparameterene
        var center = {"x":250, "y":250};
           const newRect = this.visualizer.AddRect(
                width,
                height,
                center,
                true,
                "table"
            );
        var tableID = this.roomPlan.tables.length+1;
        this.roomPlan.tables.push({"id":tableID, "width":width, "height": height, "position": center });
        newRect.OnMove = () => { this.updateTablePos(tableID, newRect.Position) };

    }
    
    private saveTableLayout(value: string){
    var TableName = (<HTMLInputElement>document.getElementById('table-name')).value;
    if (TableName.length < 1) {
        (<HTMLInputElement>document.getElementById('save-response-text')).innerHTML = "The name is too short";
        return;
    }
    var dict = this.getTableSetup(TableName, value);
    if (dict) {
    if (dict.length == 0){
    (<HTMLInputElement>document.getElementById('save-response-text')).innerHTML = "You have to add tables";
    return;
    }
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/add", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Sjekk om server klarte å legge inn bordoppsettet i databasen
            var json = JSON.parse(xhr.responseText);
            var errorMsg = (<HTMLInputElement>document.getElementById('save-response-text'));
            var jsonStatus = json["status"]
            if (jsonStatus == "error"){
            errorMsg.style.color = "red";
            errorMsg.innerHTML = json["message"];
            }
            if(jsonStatus == "success"){
            location.reload();
            }
        }
    }
    var data = JSON.stringify(dict);
    xhr.send(data);
}
    }
    private updateTableLayout(value: string){
    var dict = this.getTableSetup("dummie", value);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "update", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Sjekk om server klarte å legge inn bordoppsettet i databasen
            var json = JSON.parse(xhr.responseText);
            var errorMsg = (<HTMLInputElement>document.getElementById('update-response-text'));
            var jsonStatus = json["status"]
            if (jsonStatus == "error"){
            errorMsg.style.color = "red";
            errorMsg.innerHTML = json["message"];
            }
            if(jsonStatus == "success"){
            errorMsg.style.color = "green";
            errorMsg.innerHTML = json["message"];
            }
        }
    }
    var data = JSON.stringify(dict);
    xhr.send(data);
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
