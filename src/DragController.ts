import Property from './Property';
import Connection from './Connection';

enum DragState {
    IDLE, SENSING, DRAGGING_INLET, DRAGGING_OUTLET
}

//     dragOffsetX = event.x - nodeX;
//     dragOffsetY = event.y - nodeY;
//     positionNode(node1, event.x - dragOffsetX, event.y - dragOffsetY, 300, 200);

export class DragController {
    moveListener = (event) => this.onMouseMove(event);
    upListener = (event) => this.onMouseUp(event);

    state: DragState = DragState.IDLE;
    connection: Connection = null;
    inlet: Property = null;


    onMouseDownInlet(event: MouseEvent, prop: Property): void {
        this.state = DragState.DRAGGING_INLET;
        this.connection = prop.incoming;
        this.connection.attached = false;
        this.connection.x = event.x;
        this.connection.y = event.y;
        document.addEventListener('mousemove', this.moveListener);
        document.addEventListener('mouseup', this.upListener);
    }

    onMouseDownOutlet(event: MouseEvent, prop: Property): void {
        this.state = DragState.DRAGGING_OUTLET;
        this.connection = prop.connectTo(null);
        this.connection.x = event.x;
        this.connection.y = event.y;
        document.addEventListener('mousemove', this.moveListener);
        document.addEventListener('mouseup', this.upListener);
    }

    onMouseMove(event: MouseEvent): void {
        this.connection.x = event.x;
        this.connection.y = event.y;
    }

    onMouseEnterInlet(prop: Property): void {
        if (this.state == DragState.DRAGGING_INLET || this.state == DragState.DRAGGING_OUTLET) {
            prop.highlighted = true;
            this.inlet = prop;
        }
    }

    onMouseLeaveInlet(prop: Property): void {
        if (this.state == DragState.DRAGGING_INLET || this.state == DragState.DRAGGING_OUTLET) {
            prop.highlighted = false;
            this.inlet = null;
        }
    }

    onMouseUp(event: MouseEvent): void {
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

            // Set the end point of the connection we're dragging to this inlet
            this.connection.end = this.inlet;

            this.connection.end.incoming = this.connection;
            this.connection.attached = true;
        } else {
            // Button released somewhere else
            this.connection.end.incoming = null;
            this.connection.start.node.removeConnection(this.connection);
        }

        document.removeEventListener('mousemove', this.moveListener);
        document.removeEventListener('mouseup', this.upListener);

        this.state = DragState.IDLE;
    }
}

export default DragController;
