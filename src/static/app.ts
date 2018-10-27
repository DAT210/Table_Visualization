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
    private tables: { [id: number]: IInteractiveVisualizerElement } = {};

    public OnTableClick: (id: number) => void = (id) => {};

    constructor(visualizer: IInteractiveVisualizer) {
        this.visualizer = visualizer;
        document.body.appendChild(this.visualizer.Wrapper);
    }

    public GetRoomPlan(): IRoom | null {
        if (this.roomPlan) return this.roomPlan;
        else return null;
    }
    public SetRoomPlan(roomPlan: IRoom) {
        this.roomPlan = roomPlan;
        this.visualizer.Width = this.roomPlan.width;
        this.visualizer.Height = this.roomPlan.height;
        this.drawRoom();
    }
    public AddTable(w: number, h: number) {
        const pos = { x: this.visualizer.Width / 2, y: this.visualizer.Height / 2 };
        const id = this.drawTable(w, h, pos);
        if (this.roomPlan) {
            this.roomPlan.tables.push({ width: w, height: h, position: pos, id: id });
        }
    }

    private drawRoom(): void {
        this.visualizer.Reset();
        this.drawWallsAsPoly();
        this.drawTables();
    }
    private drawWallsAsLines(): void {
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
            this.drawTable(table.width, table.height, table.position, table.id);
        }
    }
    private drawTable(w: number, h: number, pos: IPoint, id?: number): number {
        const rect = this.visualizer.AddRect(w, h, pos, true, "table");
        let tableId = id ? id : this.generateId();
        rect.OnClick = () => { this.OnTableClick(tableId) };
        rect.OnMove = () => { this.updateTablePos(tableId, rect.Position) };
        this.tables[tableId] = rect;

        return tableId;
    }
    private generateId(): number {
        let id: number;
        do { 
            id = Math.floor((Math.random() * 1000)) 
        }
        while (id in this.tables)
        console.log("Generated table ID: " + id);
        return id;
    }
    private updateTablePos(tableID: number, pos: IPoint): void {
        if (this.roomPlan) {
            for (let t of this.roomPlan.tables) {
                if (t.id == tableID) t.position = pos;
            }
        }
    }
}