var assign = require('object-assign');
var physics = require('./physics');
var config = require('./config');

var damp = 0.1;

function System() {
    this.particles = {};
    this.adjacency = {};
    this.idlist = [];

    this.particleAccelerators = [];
    this.edgeAccelerators = [];
    this.movers = [];
    this.monitors = [];

    this.iter = 0;
    this.config = config();
}

System.prototype.add = function(p1) {
    if(! (p1.id in this.particles))
        this.idlist.push(p1.id);

    this.particles[p1.id] = p1;
    p1.xp = p1.x;
    p1.yp = p1.y;

    return this;
}

System.prototype.link = function(id1, id2, w) {
    var adj = this.adjacency;
    w = w || 1;
    if(id1 in adj) {
        adj[id1][id2] = w;
    } else {
        adj[id1] = {[id2]: w};
    }
    return this;
};

System.prototype.bilink = function(id1, id2, w) {
    this.link(id1, id2, w).link(id2, id1, w);
};

System.prototype.allParticles = function(f) {
    for(var id in this.particles) {
        var p = this.particles[id];
        f(p);
    }
    return this;
};

System.prototype.allEdges = function(f) {
    for(var i1 in this.adjacency) {
        var p1 = this.particles[i1];
        for(var i2 in this.adjacency[i1]) {
            var p2 = this.particles[i2];
            f(p1, p2);
        }
    }
    return this;
}

System.prototype.particleAccelerator = function(f) {
    this.particleAccelerators.push(f);
    return this;
}

System.prototype.edgeAccelerator = function(f) {
    this.edgeAccelerators.push(f);
    return this;
}

System.prototype.mover = function(f) {
    this.movers.push(f);
    return this;
}

System.prototype.monitor = function(f) {
    this.monitors.push(f);
    return this;
}

function merge(all_a, a) {
    for(var i in a) {
        if(i in all_a) {
            all_a[i].x += a[i].x;
            all_a[i].y += a[i].y;
        } else {
            all_a[i] = {
                x: a[i].x,
                y: a[i].y,
            };
        }
    }
}

System.prototype.step = function() {
    this.iter += 1;
    console.log("======================", this.iter);

    if(this.iter > this.config.maxIter) {
        return;
    }

    var system = this;
    var accelerations = {};

    // apply the accelerators
    system.particleAccelerators.forEach(function(f) {
        system.allParticles(function(p) {
            var a = f(p);
            merge(accelerations, a);
        });
    });

    system.edgeAccelerators.forEach(function(g) {
        system.allEdges(function(p1, p2) {
            var a = g(p1, p2);
            merge(accelerations, a);
        });
    });

    // update the particles by their accelerations
    system.allParticles(function(p) {
        if(p.id in accelerations)
        physics.accelerate(
            p, 
            accelerations[p.id], 
            system.config.dt);
    });

    // apply the movers
    system.movers.forEach(function(f) {
        f();
    });

    // invoke all registered monitors
    system.monitors.forEach(function(m) {
        m();
    });

    setTimeout(system.step.bind(system), system.config.delay);
    return this;
}

System.prototype.start = function(config) {
    this.config = assign({}, this.config, config);
    console.info("===== STARTING =========");
    console.info(this.config);

    this.step();
    return this;
}

module.exports = {
    System,
}
