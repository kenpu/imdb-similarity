const Heap = require('heap');
const Simulate = require('./simulate');

// Makes a graph
//   edges: [ [a, b, edgeWeight], ... ]
//   sizes: { a: weight, ... }
//
// Returns:
//   { a: { "id": a,
//          "label": label,
//          "size": weight,
//          "neighbours": {
//            b: edgeWeight,
//            ...
//          }
//      }, ...
//   }
function make(edges, sizes) {
    var graph = {};

    function init(v) {
        if(v in graph)
            return
        else
            graph[v] = {
                id: v,
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

// Returns [ a, ... ]
function nodes(graph) {
    var n = [];

    for(var a in graph) {
        n.push(graph[a]);
    }

    return n;
}

// Returns the edgeWeight between two nodes
//   u, v: ID
function similarity(graph, u, v) {
    let sim = graph[u].neighbours[v] || 0;
    return sim;
}

// Computes a MST starting with a root node.
//   r: ID
// Returns
//   data: {?}
function prims(graph, r) {
    // if no root is specified, just use the first id
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
        data[u.id] = {
            key: (r == u.id) ? 1 : 0,
            parent: null,
            id: u.id,
        }
        console.debug("kens_debug: ", u.id);
        heap.push(u.id);
    });

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

    // done.  Now convert it to a tree
    var children = {};
    for(var v in data) {
        var p = data[v].parent;
        if(p == null) continue;

        if(p in children) {
            children[p].push(v);
        } else {
            children[p] = [v];
        }
    }

    return children;
}

// export a graph to a system
function mksys(graph, mst, w, h) {
    var sys = new Simulate.System();
    for(var i in graph) {
        var p = {
            id: i,
            x: Math.random() * w,
            y: Math.random() * h,
            r: 30 //graph[i].size,
        };
        sys.add(p);
    }

    for(var id in mst) {
        mst[id].forEach(function(id2) {
            sys.link(id, id2, 1);
        });
    }

    return sys;
}

module.exports = {
    make,
    prims,
    mksys,
};
