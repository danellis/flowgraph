import uuid from 'uuid/v4';
import Node from './Node';
import Connection from './Connection';

export class Property {
    static readonly offset = 45;
    static readonly textOffset = 5;
    static readonly spacing = 20;

    id: string;
    node: Node;
    index: number;
    text: string;
    color: string;
    hasInlet: boolean;
    hasOutlet: boolean;
    outgoing: Array<Connection> = [];
    incoming: Connection = null;
    highlighted: boolean = false;

    constructor(node: Node, index: number, text: string, color: string, hasInlet: boolean, hasOutlet: boolean) {
        this.id = uuid();
        this.node = node;
        this.index = index;
        this.text = text;
        this.color = color;
        this.hasInlet = hasInlet;
        this.hasOutlet = hasOutlet;
    }

    connectTo(end: Property): Connection {
        let connection = new Connection(this, end);
        this.outgoing.push(connection);

        if (end) {
            end.incoming = connection;
        }

        return connection;
    }

    get inletX(): number {
        return this.node.x;
    }

    get outletX(): number {
        return this.node.x + this.node.width;
    }

    get y(): number {
        return this.node.y + Property.offset + (this.index * Property.spacing);
    }

    get textX() {
        if (this.hasInlet && !this.hasOutlet) return this.node.x + 15;
        if (this.hasOutlet && !this.hasInlet) return this.node.x + this.node.width - 15;
        return ((this.node.x * 2) + this.node.width) / 2;
    }

    get textY() {
        return this.y + Property.textOffset;
    }

    get anchor() {
        if (this.hasInlet && !this.hasOutlet) return 'start';
        if (this.hasOutlet && !this.hasInlet) return 'end';
        return 'middle';
    }

    export(): object {
        return {
            id: this.id,
            text: this.text,
            color: this.color,
            hasInlet: this.hasInlet,
            hasOutlet: this.hasOutlet,
            outgoing: this.outgoing.map((connection) => connection.export()),
            incoming: this.incoming ? this.incoming.export() : null
        };
    }
}

export default Property;
