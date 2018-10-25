window.addEventListener("load", () => {
    fetch("/load/json")
        .then(r => { return r.json() })
        .then(roomPlan => {
            let room: IRoom = <IRoom>roomPlan;
            initAdmin(room);
        })
});

function initAdmin(roomPlan: IRoom) {
    console.log("RoomPlan:");
    console.log(roomPlan);
    const visualizer = new InteractiveSVG();
    const rv = new RoomVisualizerAdmin(visualizer);
    rv.RoomPlan = roomPlan;
}

class RoomVisualizerAdmin {
    private visualizer: IInteractiveVisualizer;
    private roomPlan: IRoom | undefined;
    private tables: { [id: number]: IInteractiveVisualizerElement } = {};

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
        //this.drawWalls();
        this.drawWallsAsPoly();
        this.drawTables();
    }
    private drawWalls(): void {
        if (!this.roomPlan) return;
        for(let wall of this.roomPlan.walls) {
            this.visualizer.AddLine(wall.from, wall.to);
        }
    }
    private drawWallsAsPoly(): void {
        if (!this.roomPlan) return;
        const wallPoints = this.roomPlan.walls.map(w => w.from);
        this.visualizer.AddPoly(wallPoints);
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
            this.tables[table.id] = rect;
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
        let box = <HTMLInputElement>document.getElementById('box1');
        if (box) {
            var height = box.height;
            var width = box.width;
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
