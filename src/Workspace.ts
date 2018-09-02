import Node from './Node';
import DragController from './DragController';

export class Workspace {
    dragController: DragController = new DragController();
    nodes: Array<Node> = [];

    addNode(cls: string, title: string, x: number, y: number, width: number, height: number): Node {
        let node = new Node(this, cls, title, x, y, width, height);
        this.nodes.push(node);
        return node;
    }

    export(): object {
        return {
            nodes: this.nodes.map((node) => node.export())
        };
    }
}

export default Workspace;
