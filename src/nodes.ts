import Vue from 'vue';
import Workspace from './Workspace';

let workspace = new Workspace();
window['workspace'] = workspace;

let node1 = workspace.addNode('source', "Source", 200, 50, 200, 200);
let node2 = workspace.addNode('inventory', "Inventory", 800, 100, 200, 200);
let node3 = workspace.addNode('filter', "Title case", 550, 150, 100, 100);

let node1prop1 = node1.addProperty('PID', '#d8e24a', false, true);
let node1prop2 = node1.addProperty('PROD_NAME', '#d8e24a', false, true);
let node2prop1 = node2.addProperty('id', '#d8e24a', true, false);
let node2prop2 = node2.addProperty('name', '#d8e24a', true, false);
let node3prop1 = node3.addProperty('Text', '#d8e24a', true, true);

new Vue({
    el: '#workspace',
    data: {
        workspace: workspace
    }
});
