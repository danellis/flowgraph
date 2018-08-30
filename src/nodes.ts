import Vue from 'vue';

class Node {
    cls: string;
    title: string;
    x: number;
    y: number;
    width: number;
    height: number;
    properties: Array<Property>;

    constructor(cls: string, title: string, x: number, y: number, width: number, height: number) {
        this.cls = cls;
        this.title = title;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.properties = [];
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
    outgoing: Array<Property>;
    incoming: Property;

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

    connectionPath(end: Property): string {
        let ox = this.outletX;
        let oy = this.y;
        let ix = end.inletX;
        let iy = end.y;
        let halfway = (this.outletX + end.inletX) / 2;

        return `M ${ox},${oy} C${halfway},${oy} ${halfway},${iy} ${ix},${iy}`
    }
}

let node1 = new Node('source', "Source",200, 50, 200, 200);
let node2 = new Node('inventory', "Inventory", 800, 100, 200, 200);
let node3 = new Node('filter', "Title case", 550, 150, 100, 100);

let node1prop1 = new Property(node1, 0, 'PID', '#d8e24a', false, true);
let node1prop2 = new Property(node1, 1, 'PROD_NAME', '#d8e24a', false, true);
let node2prop1 = new Property(node2, 0, 'id', '#d8e24a', true, false);
let node2prop2 = new Property(node2, 1, 'name', '#d8e24a', true, false);
let node3prop1 = new Property(node3, 0, 'Text', '#d8e24a', true, true);

node1.properties = [node1prop1, node1prop2];
node2.properties = [node2prop1, node2prop2];
node3.properties = [node3prop1];

node1prop1.outgoing = [node2prop1];
node2prop1.incoming = node1prop1;

node1prop2.outgoing = [node3prop1];
node3prop1.incoming = node1prop2;

node3prop1.outgoing = [node2prop2];
node2prop2.incoming = node3prop1;

var workspace = new Vue({
    el: '#workspace',
    data: {
        nodes: [node1, node2, node3]
    },
    methods: {
        headerPath: (node) => {
            return `M ${node.x},${node.y + 15} a 15 15 0 0 1 15,-15 h ${node.width - 30} a 15 15 0 0 1 15,15 v 15 h -${node.width} v -15`;
        },
        headerClip: (node) => {
            return `polygon(0px 0px, ${node.width - 30}px 0px, ${node.width - 30}px 30px, 0px 30px)`;
        },
    }
});

// class MercatorWorkspace {
//     private root: HTMLElement;
//
//     constructor(rootId: string) {
//         this.root = document.getElementById(rootId);
//     }
//
//     addNode(node: MercatorNode): void {
//         this.root.appendChild(node.root);
//     }
// }
//
// class MercatorProperty {
//     text: string;
//     color: string;
//     hasInlet: boolean;
//     hasOutlet: boolean;
//
//     constructor(text, color, hasInlet, hasOutlet) {
//         this.text = text;
//         this.color = color;
//         this.hasInlet = hasInlet;
//         this.hasOutlet = hasOutlet;
//     }
// }
//
// class MercatorNode {
//     static readonly namespace = 'http://www.w3.org/2000/svg';
//
//     root;
//
//     private x: number;
//     private y: number;
//     private width: number;
//     private height: number;
//     private properties: Array<MercatorProperty>;
//     private propsGroup;
//
//     constructor(nodeClass: string, title: string, x: number, y: number, width: number, height: number, properties: Array<MercatorProperty>) {
//         this.x = x;
//         this.y = y;
//         this.width = width;
//         this.height = height;
//         this.properties = properties;
//
//         this.root = this.createNode(title, nodeClass);
//         this.positionNode(this.x, this.y, this.width, this.height);
//     }
//
//     private createNode(title, nodeClass) {
//         // Group for entire node
//         let root = this.createElement('g', {'class': `node ${nodeClass}`});
//
//         // Background
//         let background = this.createElement('rect', {'class': 'node-bg', 'rx': 15, 'ry': 15});
//         root.appendChild(background);
//
//         // Title background
//         let header = this.createElement('path', {'class': `node-header`});
//         root.appendChild(header);
//
//         // Title text
//         let titleText = this.createElement('text', {'class': 'node-title'});
//         titleText.textContent = title;
//         root.appendChild(titleText);
//
//         // Node outline
//         let outline = this.createElement('rect', {'class': 'node-outline', 'rx': 15, 'ry': 15});
//         root.appendChild(outline);
//
//         this.propsGroup = this.createPropsGroup();
//         root.appendChild(this.propsGroup);
//
//         console.log("Node root is:", root);
//         return root;
//     }
//
//     positionNode(x: number, y: number, width: number, height: number): void {
//         this.x = x;
//         this.y = y;
//         this.width = width;
//         this.height = height;
//
//         let background = this.root.querySelector('.node-bg');
//         background.setAttribute('x', x.toString());
//         background.setAttribute('y', y.toString());
//         background.setAttribute('width', width.toString());
//         background.setAttribute('height', height.toString());
//
//         let header = this.root.querySelector('.node-header');
//         header.setAttribute('d', `M ${x},${y + 15} a 15 15 0 0 1 15,-15 h ${width - 30} a 15 15 0 0 1 15,15 v 15 h -${width} v -15`);
//
//         let titleText = this.root.querySelector('.node-title');
//         titleText.setAttribute('x', (x + 15).toString());
//         titleText.setAttribute('y', (y + 20).toString());
//         titleText.setAttribute('clip-path', `polygon(0px 0px, ${width - 30}px 0px, ${width - 30}px 30px, 0px 30px)`);
//
//         let outline = this.root.querySelector('.node-outline');
//         outline.setAttribute('x', x.toString());
//         outline.setAttribute('y', y.toString());
//         outline.setAttribute('width', width.toString());
//         outline.setAttribute('height', height.toString());
//
//         let propGroups = this.propsGroup.querySelectorAll('g');
//         console.log("propGroups", propGroups);
//
//         for (let i = 0; i < this.properties.length; i++) {
//             let property = this.properties[i];
//
//             if (property.hasInlet) {
//                 let cy = y + 60 + (i * 30);
//                 let circle = propGroups[i].querySelector('.node-inlet');
//                 circle.setAttribute('cx', x.toString());
//                 circle.setAttribute('cy', cy.toString());
//             }
//
//             if (property.hasOutlet) {
//                 let circle = propGroups[i].querySelector('.node-outlet');
//                 let cx = x + width;
//                 let cy = y + 60 + (i * 30);
//                 circle.setAttribute('cx', cx.toString());
//                 circle.setAttribute('cy', cy.toString());
//             }
//
//             let textX;
//             if (property.hasInlet && !property.hasOutlet) {
//                 textX = x + 15;
//             } else if (property.hasOutlet && !property.hasInlet) {
//                 textX = x + width - 15;
//             } else {
//                 textX = (x + x + width) / 2;
//             }
//
//             let textY = y + 60 + (i * 30) + 5;
//
//             let text = propGroups[i].querySelector('.property-text');
//             text.setAttribute('x', textX.toString());
//             text.setAttribute('y', textY.toString());
//         }
//     }
//
//     private createPropsGroup() {
//         let group = this.createElement('g', {'class': 'node-properties'});
//
//         for (let i = 0; i < this.properties.length; i++) {
//             let propGroup = this.createElement('g', {'class': 'node-property'});
//
//             let property = this.properties[i];
//
//             if (property.hasInlet) {
//                 let propCircle = this.createElement('circle', {
//                     'class': 'node-inlet',
//                     'r': 5,
//                     'fill': property.color
//                 });
//                 propGroup.appendChild(propCircle);
//             }
//
//             if (property.hasOutlet) {
//                 let propCircle = this.createElement('circle', {
//                     'class': 'node-outlet',
//                     'r': 5,
//                     'fill': property.color
//                 });
//                 propGroup.appendChild(propCircle);
//             }
//
//             let anchor: string;
//             if (property.hasInlet && !property.hasOutlet) {
//                 anchor = 'start';
//             } else if (property.hasOutlet && !property.hasInlet) {
//                 anchor = 'end';
//             } else {
//                 anchor = 'middle';
//             }
//
//             let propText = this.createElement('text', {
//                 'class': 'property-text',
//                 'text-anchor': anchor
//             });
//             propText.textContent = property.text;
//             propGroup.appendChild(propText);
//
//             group.appendChild(propGroup);
//         }
//
//         return group;
//     }
//
//     private createElement(name, attributes) {
//         let element = document.createElementNS(MercatorNode.namespace, name);
//
//         Object.keys(attributes).forEach(key => {
//             element.setAttribute(key, attributes[key]);
//         });
//
//         return element;
//     }
// }
//
// let workspace = new MercatorWorkspace('workspace');
//
// workspace.addNode(
//     new MercatorNode('source', "Source", 200, 50, 200, 200, [
//         new MercatorProperty('PID', '#d8e24a', false, true),
//         new MercatorProperty('PROD_NAME', '#d8e24a', false, true)
//     ])
// );
//
// workspace.addNode(
//     new MercatorNode('inventory', "Inventory", 800, 100, 200, 200, [
//         new MercatorProperty('id', '#d8e24a', true, false),
//         new MercatorProperty('name', '#d8e24a', true, false)
//     ])
// );
//
// workspace.addNode(
//     new MercatorNode('filter', "Title case", 550, 150, 100, 100, [
//         new MercatorProperty('Text', '#d8e24a', true, true)
//     ])
// );

// function createConnection(ox, oy, ix, iy) {
//     let halfway = (ix + ox) / 2;
//     return createElement('path', {
//         'class': 'connector',
//         'd': `M ${ox},${oy} C${halfway},${oy} ${halfway},${iy} ${ix},${iy} `
//     });
// }
//
// let nodeX;
// let nodeY;
// let dragOffsetX;
// let dragOffsetY;
//
// let conn1 = createConnection(400, 110, 800, 160);
// let conn2 = createConnection(400, 140, 550, 210);
// let conn3 = createConnection(650, 210, 800, 190);
// workspace.appendChild(conn1);
// workspace.appendChild(conn2);
// workspace.appendChild(conn3);
//
// node1.onmousedown = function (event) {
//     let bounds = node1.getBoundingClientRect();
//     dragOffsetX = event.x - nodeX;
//     dragOffsetY = event.y - nodeY;
//     workspace.addEventListener('mousemove', onMouseMove);
//     return false;
// };
//
// workspace.onmouseup = function (event) {
//     workspace.removeEventListener('mousemove', onMouseMove);
//     return false;
// };
//
//
// function onMouseMove(event) {
//     positionNode(node1, event.x - dragOffsetX, event.y - dragOffsetY, 300, 200);
//     return false;
// }
