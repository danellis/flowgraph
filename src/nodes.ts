import Vue from 'vue';
import Workspace from './Workspace';

let workspace = new Workspace();
window['workspace'] = workspace;

let node1 = workspace.addNode('source', "Source", 200, 50, 200, 200);
let node2 = workspace.addNode('inventory', "Inventory", 800, 100, 200, 200);
let node3 = workspace.addNode('filter', "Title case", 550, 150, 100, 100);
let node4 = workspace.addNode('filter', "Create ID", 550, 50, 100, 100);
let node5 = workspace.addNode('filter', "Concatenate", 450, 50, 120, 100);

let node1prop1 = node1.addProperty("Handset Brand", '#d8e24a', false, true);
let node1prop2 = node1.addProperty("Handset Title", '#d8e24a', false, true);
let node1prop3 = node1.addProperty("Handset Colour", '#d8e24a', false, true);
let node1prop4 = node1.addProperty("Handset Image", '#d8e24a', false, true);
let node1prop5 = node1.addProperty("Contract Length", '#d8e24a', false, true);
let node1prop6 = node1.addProperty("Line Rental", '#d8e24a', false, true);
let node1prop7 = node1.addProperty("Effective Line Rental", '#d8e24a', false, true);
let node1prop8 = node1.addProperty("Network", '#d8e24a', false, true);
let node1prop9 = node1.addProperty("Tariff Name", '#d8e24a', false, true);
let node1prop10 = node1.addProperty("Tariff Type", '#d8e24a', false, true);
let node1prop11 = node1.addProperty("Deal Price", '#d8e24a', false, true);
let node1prop12 = node1.addProperty("Inclusive Minutes", '#d8e24a', false, true);
let node1prop13 = node1.addProperty("Inclusive Texts", '#d8e24a', false, true);
let node1prop14 = node1.addProperty("Inclusive Data", '#d8e24a', false, true);
let node1prop15 = node1.addProperty("Purchase URL", '#d8e24a', false, true);
let node1prop16 = node1.addProperty("Gift Title", '#d8e24a', false, true);
let node1prop17 = node1.addProperty("Cashback Amount", '#d8e24a', false, true);
let node1prop18 = node1.addProperty("Cashback Type", '#d8e24a', false, true);
let node1prop19 = node1.addProperty("inclusive", '#d8e24a', false, true);
let node1prop20 = node1.addProperty("inclusive_2", '#d8e24a', false, true);

let node2prop1 = node2.addProperty('id', '#d8e24a', true, false);
let node2prop2 = node2.addProperty('name', '#d8e24a', true, false);

let node3prop1 = node3.addProperty('Text', '#d8e24a', true, true);

let node4prop1 = node4.addProperty('Text', '#d8e24a', true, true);

let node5prop1 = node5.addProperty('First', '#d8e24a', true, false);
let node5prop2 = node5.addProperty('Second', '#d8e24a', true, false);
let node5prop3 = node5.addProperty('Output', '#d8e24a', false, true);

new Vue({
    el: '#workspace',
    data: {
        workspace: workspace
    }
});
