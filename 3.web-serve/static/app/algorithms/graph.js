const Heap = require('heap');

function make(edges, sizes) {
    var graph = {};

    function init(v) {
        if(v in graph)
            return
        else
            graph[v] = {
                label: v,
                size: 1,
                neighbours: {},
            };
    }

    function connect(a, b, sim) {
        init(a);
        init(b);
        graph[a].neighbours[b] = sim;
        graph[b].neighbours[a] = sim;
    }

    edges.forEach(function(edge) {
        connect(...edge);
    });

    for(var a in sizes) {
        init(a);
        graph[a].size = sizes[a];
    }

    return graph;
}

function nodes(graph) {
    var n = [];

    for(var a in graph) {
        n.push(graph[a]);
    }

    return n;
}

function similarity(graph, u, v) {
    let sim = graph[u].neighbours[v] || 0;
    return sim;
}

function prims(graph, r) {
    // if no root is specified, just use the first label
    if(! r) {
        for(var a in graph) {
            r = a;
            break;
        }
    }

    // predecessor function and keys
    var data = {};

    // the MAX-priority queue
    var heap = new Heap(function(a, b) {
        return data[b].key - data[a].key;
    });

    // populate the priority queue
    nodes(graph).forEach(function(u) {
        data[u.label] = {
            key: (r == u.label) ? 1 : 0,
            parent: null,
            label: u.label,
        }
        console.debug("kens_debug: ", u.label);
        heap.push(u.label);
    });

    console.debug("Heap has %d things", heap.size());

    // greedily connect vertices to the tree
    while(! heap.empty()) {
        var u = heap.pop();
        for(var v in graph[u].neighbours) {
            if(heap.toArray().indexOf(v) >= 0) {
                let s = similarity(graph, u, v);
                if(s > data[v].key) {
                    data[v].key = s;
                    console.debug("connecting %s - %s", u, v);
                    data[v].parent = u;
                    heap.updateItem(v);
                }
            }
        }
    }

    // done
    return data;
}

module.exports = {
    make,
    prims
};
