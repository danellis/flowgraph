import Property from './Property';

export class Connection {
    attached: boolean;
    x: number = 0;
    y: number = 0;
    start: Property;
    end: Property;

    constructor(start: Property, end: Property) {
        this.attached = end !== null;
        this.start = start;
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

    get endY() {
        return this.attached ? this.end.y : this.y;
    }

    get path(): string {
        let ox = this.startX;
        let oy = this.startY;
        let ix = this.endX;
        let iy = this.endY;
        let halfway = (ox + ix) / 2;

        return `M ${ox},${oy} C${halfway},${oy} ${halfway},${iy} ${ix},${iy}`
    }
}

export default Connection;
