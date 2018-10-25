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
}