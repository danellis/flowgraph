import Vue from 'vue';

enum DragState {
    IDLE, SENSING, INLET_DRAGGING, OUTLET_DRAGGING
}

class Workspace {
    dragController: DragController = new DragController();
    nodes: Array<Node> = [];

    addNode(cls: string, title: string, x: number, y: number, width: number, height: number): Node {
        let node = new Node(this, cls, title, x, y, width, height);
        this.nodes.push(node);
        return node;
    }
}

//     dragOffsetX = event.x - nodeX;
//     dragOffsetY = event.y - nodeY;
//     positionNode(node1, event.x - dragOffsetX, event.y - dragOffsetY, 300, 200);

class DragController {
    dragState: DragState = DragState.IDLE;
    connection: Connection = null;
    inlet: Property = null;


    onMouseDownInlet($event, prop: Property): void {
        this.dragState = DragState.INLET_DRAGGING;
        this.connection = prop.incoming;
        this.connection.attached = false;
        this.connection.x = $event.x;
        this.connection.y = $event.y;
        document.addEventListener('mousemove', (event) => this.onMouseMove(event));
        document.addEventListener('mouseup', (event) => this.onMouseUp(event));
    }

    onMouseMove($event): void {
        this.connection.x = $event.x;
        this.connection.y = $event.y;
    }

    onMouseEnterInlet(prop: Property): void {
        if (this.dragState == DragState.INLET_DRAGGING) {
            prop.highlighted = true;
            this.inlet = prop;
        }
    }

    onMouseLeaveInlet(prop: Property): void {
        if (this.dragState == DragState.INLET_DRAGGING) {
            prop.highlighted = false;
            this.inlet = null;
        }
    }

    onMouseUp(event): void {
        this.connection.end.incoming = null;

        if (this.inlet) {
            if (this.inlet.incoming) {
                this.connection.start.node.removeConnection(this.inlet.incoming)
            }

            this.inlet.incoming = this.connection;
            this.connection.end = this.inlet;
            this.connection.attached = true;
        } else {
            this.connection.start.node.removeConnection(this.connection);
        }

        this.dragState = DragState.IDLE;
    }
}

class Node {
    workspace: Workspace;
    cls: string;
    title: string;
    x: number;
    y: number;
    width: number;
    height: number;
    properties: Array<Property>;

    constructor(workspace: Workspace, cls: string, title: string, x: number, y: number, width: number, height: number) {
        this.workspace = workspace;
        this.cls = cls;
        this.title = title;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.properties = [];
    }

    addProperty(text: string, color: string, hasInlet: boolean, hasOutlet: boolean): Property {
        let property = new Property(this, this.properties.length, text, color, hasInlet, hasOutlet);
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

    get headerPath(): string {
        return `M ${this.x},${this.y + 15} a 15 15 0 0 1 15,-15 h ${this.width - 30} a 15 15 0 0 1 15,15 v 15 h -${this.width} v -15`;
    }

    get headerClip(): string {
    return `polygon(0px 0px, ${this.width - 30}px 0px, ${this.width - 30}px 30px, 0px 30px)`;
    }
}

class Property {
    static readonly offset = 45;
    static readonly textOffset = 5;
    static readonly spacing = 20;

    node: Node;
    index: number;
    text: string;
    color: string;
    hasInlet: boolean;
    hasOutlet: boolean;
    outgoing: Array<Connection>;
    incoming: Connection;
    highlighted: boolean = false;

    constructor(node: Node, index: number, text: string, color: string, hasInlet: boolean, hasOutlet: boolean) {
        this.node = node;
        this.index = index;
        this.text = text;
        this.color = color;
        this.hasInlet = hasInlet;
        this.hasOutlet = hasOutlet;
        this.outgoing = [];
        this.incoming = null;
    }

    connectTo(end: Property): Connection {
        let connection = new Connection(this, end);
        this.outgoing.push(connection);
        end.incoming = connection;
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

    onMouseDown(event: MouseEvent, prop: Property): void {
        // document.addEventListener('mousemove', (event) => this.onMouseMove(event));
        prop.incoming.attached = false;
        prop.incoming.x = 900;
        prop.incoming.y = 900;
    }

    onMouseMove(event: MouseEvent): void {
        // console.log(event.x, event.y);
    }

    onMouseEnter(event: MouseEvent, prop: Property): void {
        console.log("Entered inlet", prop);
    }
}

class Connection {
    attached: boolean = true;
    x: number = 0;
    y: number = 0;
    start: Property;
    end: Property;

    constructor(start: Property, end: Property) {
        this.start = start;
        this.end = end;
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

let workspace = new Workspace();

let node1 = workspace.addNode('source', "Source", 200, 50, 200, 200);
let node2 = workspace.addNode('inventory', "Inventory", 800, 100, 200, 200);
let node3 = workspace.addNode('filter', "Title case", 550, 150, 100, 100);

let node1prop1 = node1.addProperty('PID', '#d8e24a', false, true);
let node1prop2 = node1.addProperty('PROD_NAME', '#d8e24a', false, true);
let node2prop1 = node2.addProperty('id', '#d8e24a', true, false);
let node2prop2 = node2.addProperty('name', '#d8e24a', true, false);
let node3prop1 = node3.addProperty('Text', '#d8e24a', true, true);

node1prop1.connectTo(node2prop1);
node1prop2.connectTo(node3prop1);
node3prop1.connectTo(node2prop2);

new Vue({
    el: '#workspace',
    data: {
        workspace: workspace
    }
});
