interface IPoint {
    x: number,
    y: number
}

interface ITable {
    id: number,
    width: number,
    height: number,
    position: IPoint,
    capacity?: number
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
    private bookedTables: number[] = [];
    private movableTables: boolean;

    constructor(visualizer: IInteractiveVisualizer, movableTables: boolean = false) {
        this.movableTables = movableTables;
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
    public AddTable(w: number, h: number, capacity: number) {
        const pos = { x: this.visualizer.Width / 2, y: this.visualizer.Height / 2 };
        console.log(pos);
        const id = this.drawTable(w, h, pos, undefined, true);
        if (this.roomPlan) {
            this.roomPlan.tables.push({ width: w, height: h, position: pos, id: id, capacity:capacity });
            console.log(this.roomPlan);
        }
    }
    public GetSelected(): number[] {
        const selected: number[] = [];
        for (let id in this.tables) {
            if (this.tables[id].Selected) selected.push(+id);
        }
        return selected;
    }
    public MarkTablesAsBooked(tableIDs: number[]): void {
        this.bookedTables = tableIDs;
        for (let id of tableIDs) {
            if (id in this.tables) {
                this.tables[id].ToggleClass("table-booked");
            }
            else console.warn("Trying to mark non-existent table as booked. ID = " + id);
        }
    }

    private drawRoom(): void {
        this.visualizer.Reset();
        this.drawWallsAsPoly();
        this.drawTables();
        this.visualizer.CenterContent();
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
        const room = this.visualizer.AddPoly(wallPoints);
        room.ToggleClass("room");
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
        rect.ToggleClass("tables");
        this.tables[tableId] = rect;
        
        return tableId;
    }
    private onTableClick(id: number): void {
        for (let table of this.bookedTables) {
            if (table === id) return;
        }
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