import Property from './Property';
import Connection from './Connection';
import Node from './Node';

enum DragState {
    IDLE, DRAGGING_CONNECTION, DRAGGING_NODE
}

export class DragController {
    moveListener = (event) => this.onMouseMove(event);
    upListener = (event) => this.onMouseUp(event);

    state: DragState = DragState.IDLE;

    connection: Connection = null;
    inlet: Property = null;

    node: Node = null;
    offsetX: number = 0;
    offsetY: number = 0;


    onMouseDownInlet(svg: SVGElement, event: MouseEvent, prop: Property): void {
        this.state = DragState.DRAGGING_CONNECTION;
        this.connection = prop.incoming;
        this.connection.attached = false;
        this.connection.x = event.x;
        this.connection.y = event.y;

        let bounds = svg.getBoundingClientRect();
        this.offsetX = bounds.left;
        this.offsetY = bounds.top;

        document.addEventListener('mousemove', this.moveListener);
        document.addEventListener('mouseup', this.upListener);
    }

    onMouseDownOutlet(svg: SVGElement, event: MouseEvent, prop: Property): void {
        this.state = DragState.DRAGGING_CONNECTION;
        this.connection = prop.connectTo(null);
        this.connection.x = event.x;
        this.connection.y = event.y;

        let bounds = svg.getBoundingClientRect();
        this.offsetX = bounds.left;
        this.offsetY = bounds.top;

        document.addEventListener('mousemove', this.moveListener);
        document.addEventListener('mouseup', this.upListener);
    }

    onMouseDownNode(event: MouseEvent, node: Node): void {
        this.state = DragState.DRAGGING_NODE;
        this.node = node;
        this.offsetX = event.x - node.x;
        this.offsetY = event.y - node.y;
//     positionNode(node1, event.x - dragOffsetX, event.y - dragOffsetY, 300, 200);
        document.addEventListener('mousemove', this.moveListener);
        document.addEventListener('mouseup', this.upListener);

    }

    onMouseMove(event: MouseEvent): void {
        switch (this.state) {
            case DragState.DRAGGING_CONNECTION:
                this.connection.x = event.x - this.offsetX;
                this.connection.y = event.y - this.offsetY;
                break;

            case DragState.DRAGGING_NODE:
                this.node.x = event.x - this.offsetX;
                this.node.y = event.y - this.offsetY;
                break;
        }
    }

    onMouseEnterInlet(prop: Property): void {
        if (this.state == DragState.DRAGGING_CONNECTION) {
            prop.highlighted = true;
            this.inlet = prop;
        }
    }

    onMouseLeaveInlet(prop: Property): void {
        if (this.state == DragState.DRAGGING_CONNECTION) {
            prop.highlighted = false;
            this.inlet = null;
        }
    }

    onMouseUp(event: MouseEvent) {
        switch (this.state) {
            case DragState.DRAGGING_CONNECTION:
                this.onMouseUpConnection(event);
                break;

            case DragState.DRAGGING_NODE:
                this.onMouseUpNode(event);
                break;
        }

        document.removeEventListener('mousemove', this.moveListener);
        document.removeEventListener('mouseup', this.upListener);

        this.state = DragState.IDLE;
    }

    onMouseUpConnection(event: MouseEvent): void {
        if (this.inlet) {
            // Button released over an inlet
            if (this.inlet.incoming) {
                // The inlet already has an incoming connection, so remove it
                this.inlet.incoming.remove();
            }

            // Set the inlet's incoming connection to the one we're dragging
            this.inlet.incoming = this.connection;

            // Unhighlight the inlet, since we'll no longer be dragging when we mouseout
            this.inlet.highlighted = false;

            // If the connection was connected to another inlet, clear that one
            if (this.connection.end) {
                this.connection.end.incoming = null;
            }

            // Set the end point of the connection we're dragging to this inlet
            this.connection.end = this.inlet;

            this.connection.end.incoming = this.connection;
            this.connection.attached = true;
        } else {
            // Button released somewhere else
            if (this.connection.end) {
                this.connection.end.incoming = null;
            }

            this.connection.start.node.removeConnection(this.connection);
        }
    }

    onMouseUpNode(event: MouseEvent) {
        this.node = null;
    }
}

export default DragController;
