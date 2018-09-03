import uuid from 'uuid/v4';
import Workspace from './Workspace';
import Property from './Property';
import Connection from './Connection';

export class Node {
    id: string;
    workspace: Workspace;
    cls: string;
    title: string;
    x: number;
    y: number;
    width: number;
    collapsed: boolean = false;
    properties: Array<Property>;

    constructor(workspace: Workspace, cls: string, title: string, x: number, y: number, width: number, height: number) {
        this.id = uuid();
        this.workspace = workspace;
        this.cls = cls;
        this.title = title;
        this.x = x;
        this.y = y;
        this.width = width;
        this.properties = [];
    }

    addProperty(text: string, color: string, hasInlet: boolean, hasOutlet: boolean): Property {
        let property = new Property(this, text, color, hasInlet, hasOutlet);
        this.properties.push(property);
        return property;
    }

    removeConnection(connection: Connection): void {
        for (let prop of this.properties) {
            let length = prop.outgoing.length;
            for (let i = 0; i < length; i++) {
                prop.outgoing = prop.outgoing.filter((c) => c !== connection);
                if (prop.outgoing.length != length) {
                    return;
                }
            }
        }
    }

    get height(): number {
        return this.collapsed ? 45 : this.properties.length * Property.spacing + Property.offset;
    }

    get headerPath(): string {
        return `M ${this.x},${this.y + 15} a 15 15 0 0 1 15,-15 h ${this.width - 30} a 15 15 0 0 1 15,15 v 15 h -${this.width} v -15`;
    }

    get headerClip(): string {
        return `polygon(0px 0px, ${this.width - 30}px 0px, ${this.width - 30}px 30px, 0px 30px)`;
    }

    export(): object {
        return {
            id: this.id,
            'class': this.cls,
            title: this.title,
            x: this.x,
            y: this.y,
            width: this.width,
            collapsed: this.collapsed,
            properties: this.properties.map((property) => property.export())
        };
    }
}

export default Node;
