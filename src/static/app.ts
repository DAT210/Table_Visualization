interface IPoint {
    x: number,
    y: number
}

interface ITable {
    id: number,
    width: number,
    height: number,
    position: IPoint,
    booked: number
}

interface IWall {
    to: IPoint,
    from: IPoint
}

interface IRoom {
    width: number,
    height: number,
    tables: ITable[],
    walls: IWall[],
    name: string
}

class RoomVisualizer {
    private visualizer: IInteractiveVisualizer;
    private roomPlan: IRoom | undefined;
    private tables: { [id: number]: IInteractiveVisualizerElement } = {};
    private room: IInteractiveVisualizerElement | undefined;
    private movableTables: boolean;

    constructor(visualizer: IInteractiveVisualizer, movableTables: boolean = false) {
        this.visualizer = visualizer;
        document.body.appendChild(this.visualizer.Wrapper);
        this.movableTables = movableTables;
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
            this.roomPlan.tables.push({ width: w, height: h, position: pos, id: id, booked: 0 });
        }
    }
    public GetSelected(): number[] {
        const selected: number[] = [];
        for (let id in this.tables) {
            if (this.tables[id].Selected) selected.push(+id);
        }
        return selected;
    }

    private drawRoom(): void {
        this.visualizer.Reset();
        this.drawWallsAsPoly();
        this.drawTables();
    }
    private drawWallsAsLines(): void {
        if (!this.roomPlan) return;
        for (let wall of this.roomPlan.walls) {
            this.visualizer.AddLine(wall.from, wall.to);
        }
    }
    private drawWallsAsPoly(): void {
        if (!this.roomPlan) return;
        const wallPoints = this.roomPlan.walls.map(w => w.from);
        this.room = this.visualizer.AddPoly(wallPoints);
        this.room.ToggleClass("room");
    }
    private drawTables(): void {
        if (!this.roomPlan) return;
        for(let table of this.roomPlan.tables) {
            this.drawTable(table.width, table.height, table.position, table.id, this.movableTables);
        }
    }
    private drawTable(w: number, h: number, pos: IPoint, id?: number, movable: boolean = false): number {
        const tableId = id ? id : this.generateId();
        
        const rect = this.visualizer.AddRect(w, h, pos, movable, "table");
        rect.OnClick = () => { this.onTableClick(tableId) };
        rect.OnMove = () => { this.updateRoomPlan(tableId, rect.Position) };
        rect.ToggleClass("table");
        this.tables[tableId] = rect;
        
        return tableId;
    }
    private onTableClick(id: number): void {
        console.log("Table " + id + " clicked!");
        this.tables[id].Selected = !this.tables[id].Selected;
        this.tables[id].ToggleClass("table-selected");
    }
    /** Updates table position in roomPlan */
    private updateRoomPlan(tableID: number, pos: IPoint): void {
        if (this.roomPlan) {
            for (let t of this.roomPlan.tables) {
                if (t.id == tableID) t.position = pos;
            }
        }
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
}