const Graph = require('./graph');
const Layout = require('./layout');

function makeGraphSystem(sim, sizes) {
    var graph = Graph.make(sim, sizes);
    var mst   = Graph.prims(graph);

    
}

module.exports = {
    makeGraphSystem,
}
