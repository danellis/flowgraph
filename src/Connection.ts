import Property from './Property';

export class Connection {
    attached: boolean;
    x: number = 0;
    y: number = 0;

    start: Property;
    startIndex: number;

    end: Property;
    endIndex: number;

    constructor(start: Property, index: number, end: Property) {
        this.attached = end !== null;
        this.start = start;
        this.startIndex = index;
        this.end = end;
    }

    remove(): void {
        this.start.node.removeConnection(this);

        if (this.end) {
            this.end.incoming = null;
        }
    }

    get startX() {
        return this.start.outletX;
    }

    get startY() {
        return this.start.y;
    }

    get endX() {
        return this.attached ? this.end.inletX : this.x;
    }

    endY(index) {
        return this.attached ? this.end.y(index) : this.y;
    }

    get path(): string {
        let ox = this.startX;
        let oy = this.start.node.collapsed ? this.start.node.y + 18 : this.start.y(this.startIndex);
        let ix = this.endX;
        let iy = (this.end && this.end.node.collapsed) ? this.end.node.y + 18 : this.endY(this.endIndex);
        let halfway = (ox + ix) / 2;

        return `M ${ox},${oy} C ${halfway},${oy} ${halfway},${iy} ${ix},${iy}`
    }

    export(): object {
        return {
            start: this.start.id,
            end: this.end.id
        }
    }
}

export default Connection;
