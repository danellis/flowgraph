class MercatorWorkspace {
    private root: HTMLElement;

    constructor(rootId: string) {
        this.root = document.getElementById(rootId);
    }

    addNode(node: MercatorNode): void {
        this.root.appendChild(node.root);
    }
}

class MercatorProperty {
    text: string;
    color: string;
    hasInlet: boolean;
    hasOutlet: boolean;

    constructor(text, color, hasInlet, hasOutlet) {
        this.text = text;
        this.color = color;
        this.hasInlet = hasInlet;
        this.hasOutlet = hasOutlet;
    }
}

class MercatorNode {
    static readonly namespace = 'http://www.w3.org/2000/svg';

    root;

    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private properties: Array<MercatorProperty>;
    private propsGroup;

    constructor(nodeClass: string, title: string, x: number, y: number, width: number, height: number, properties: Array<MercatorProperty>) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.properties = properties;

        this.root = this.createNode(title, nodeClass);
        this.positionNode(this.x, this.y, this.width, this.height);
    }

    private createNode(title, nodeClass) {
        // Group for entire node
        let root = this.createElement('g', {'class': `node ${nodeClass}`});

        // Background
        let background = this.createElement('rect', {'class': 'node-bg', 'rx': 15, 'ry': 15});
        root.appendChild(background);

        // Title background
        let header = this.createElement('path', {'class': `node-header`});
        root.appendChild(header);

        // Title text
        let titleText = this.createElement('text', {'class': 'node-title'});
        titleText.textContent = title;
        root.appendChild(titleText);

        // Node outline
        let outline = this.createElement('rect', {'class': 'node-outline', 'rx': 15, 'ry': 15});
        root.appendChild(outline);

        this.propsGroup = this.createPropsGroup();
        root.appendChild(this.propsGroup);

        console.log("Node root is:", root);
        return root;
    }

    positionNode(x: number, y: number, width: number, height: number): void {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        let background = this.root.querySelector('.node-bg');
        background.setAttribute('x', x.toString());
        background.setAttribute('y', y.toString());
        background.setAttribute('width', width.toString());
        background.setAttribute('height', height.toString());

        let header = this.root.querySelector('.node-header');
        header.setAttribute('d', `M ${x},${y + 15} a 15 15 0 0 1 15,-15 h ${width - 30} a 15 15 0 0 1 15,15 v 15 h -${width} v -15`);

        let titleText = this.root.querySelector('.node-title');
        titleText.setAttribute('x', (x + 15).toString());
        titleText.setAttribute('y', (y + 20).toString());
        titleText.setAttribute('clip-path', `polygon(0px 0px, ${width - 30}px 0px, ${width - 30}px 30px, 0px 30px)`);

        let outline = this.root.querySelector('.node-outline');
        outline.setAttribute('x', x.toString());
        outline.setAttribute('y', y.toString());
        outline.setAttribute('width', width.toString());
        outline.setAttribute('height', height.toString());

        let propGroups = this.propsGroup.querySelectorAll('g');
        console.log("propGroups", propGroups);

        for (let i = 0; i < this.properties.length; i++) {
            let property = this.properties[i];

            if (property.hasInlet) {
                let cy = y + 60 + (i * 30);
                let circle = propGroups[i].querySelector('.node-inlet');
                circle.setAttribute('cx', x.toString());
                circle.setAttribute('cy', cy.toString());
            }

            if (property.hasOutlet) {
                let circle = propGroups[i].querySelector('.node-outlet');
                let cx = x + width;
                let cy = y + 60 + (i * 30);
                circle.setAttribute('cx', cx.toString());
                circle.setAttribute('cy', cy.toString());
            }

            let textX;
            if (property.hasInlet && !property.hasOutlet) {
                textX = x + 15;
            } else if (property.hasOutlet && !property.hasInlet) {
                textX = x + width - 15;
            } else {
                textX = (x + x + width) / 2;
            }

            let textY = y + 60 + (i * 30) + 5;

            let text = propGroups[i].querySelector('.property-text');
            text.setAttribute('x', textX.toString());
            text.setAttribute('y', textY.toString());
        }
    }

    private createPropsGroup() {
        let group = this.createElement('g', {'class': 'node-properties'});

        for (let i = 0; i < this.properties.length; i++) {
            let propGroup = this.createElement('g', {'class': 'node-property'});

            let property = this.properties[i];

            if (property.hasInlet) {
                let propCircle = this.createElement('circle', {
                    'class': 'node-inlet',
                    'r': 5,
                    'fill': property.color
                });
                propGroup.appendChild(propCircle);
            }

            if (property.hasOutlet) {
                let propCircle = this.createElement('circle', {
                    'class': 'node-outlet',
                    'r': 5,
                    'fill': property.color
                });
                propGroup.appendChild(propCircle);
            }

            let anchor: string;
            if (property.hasInlet && !property.hasOutlet) {
                anchor = 'start';
            } else if (property.hasOutlet && !property.hasInlet) {
                anchor = 'end';
            } else {
                anchor = 'middle';
            }

            let propText = this.createElement('text', {
                'class': 'property-text',
                'text-anchor': anchor
            });
            propText.textContent = property.text;
            propGroup.appendChild(propText);

            group.appendChild(propGroup);
        }

        return group;
    }

    private createElement(name, attributes) {
        let element = document.createElementNS(MercatorNode.namespace, name);

        Object.keys(attributes).forEach(key => {
            element.setAttribute(key, attributes[key]);
        });

        return element;
    }
}

let workspace = new MercatorWorkspace('workspace');

workspace.addNode(
    new MercatorNode('source', "Source", 200, 50, 200, 200, [
        new MercatorProperty('PID', '#d8e24a', false, true),
        new MercatorProperty('PROD_NAME', '#d8e24a', false, true)
    ])
);

workspace.addNode(
    new MercatorNode('inventory', "Inventory", 800, 100, 200, 200, [
        new MercatorProperty('id', '#d8e24a', true, false),
        new MercatorProperty('name', '#d8e24a', true, false)
    ])
);

workspace.addNode(
    new MercatorNode('filter', "Title case", 550, 150, 100, 100, [
        new MercatorProperty('Text', '#d8e24a', true, true)
    ])
);

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