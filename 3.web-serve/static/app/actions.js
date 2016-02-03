const store = require('./store');
const assign = require('object-assign');
const Graph = require('./algorithms/graph');
const Config = require('./algorithms/config');

function apiURL(attribute) {
    return "/api/similarity/" + attribute + "/";
}

function makeSys(sim, size, name, w, h) {
    var graph = Graph.make(sim, size);
    var mst   = Graph.prims(graph);
    var conf  = Config(name);
    var sys = Graph.mksys(name, graph, mst, w, h);

    return sys;
}

function fetchSimilarity(event,  attribute) {
    store.setState({
        loading: true,
        name: "",
    });
    store.emitChange();

    let url = apiURL(attribute);
    console.debug("Fetching similarity for %s", attribute);

    $.getJSON(url, function(data) {
        console.debug(
            "Fetched similarity for %s in %s", attribute, data.duration);
        if(data.err) {
            console.error(data.err);
        }

        var {sim, size} = data;
        var {width, height} = store.getState();
        var sys = makeSys(sim, size, attribute, width, height);

        store.setState({
            loading: false,
            name: attribute,
            sim: sim,
            size: size,
            sys: sys,
        });
        store.emitChange();
    });
}

function anneal(event, stage) {
    console.debug("Annealing stage = ", stage);

    // randomize the positions a bit
    var {sys} = store.getState();
    sys.addNoise();
    sys.config.Lmax *= 0.9;
    sys.config.G *= 1.2;
    sys.start();
}

module.exports = {
    fetchSimilarity,
    anneal,
};
