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
    const rv = new RoomVisualizer(visualizer);
    rv.RoomPlan = roomPlan;
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