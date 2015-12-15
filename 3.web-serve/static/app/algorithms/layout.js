var assign = require('object-assign');

var damp = 0.0;

function System(o) {
    this.particles = {};
    this.drivers = [];
    this.monitors = [];
    this.config = assign({
        maxIter: 100,
        delay:   100,
        dt:      0.1,
        debug:   true,
    }, o);
}

System.prototype.add = function(particle) {
    this.particles[particle.id] = particle;

    particle.xp = particle.x;
    particle.yp = particle.y;

    this.iter = 0;
    return this;
}

System.prototype.update = function(id, a) {
    var dt = this.config.dt;
    var p = this.particles[id];
    var {x, y, xp, yp} = p;
    var x2, y2;

    x2 = (2 - damp) * x - (1 - damp)*xp + a.x * dt * dt;
    y2 = (2 - damp) * y - (1 - damp)*yp + a.y * dt * dt;

    p.x = x2;
    p.y = y2;
    p.xp = x;
    p.yp = y;
    
    return this;
}

System.prototype.driver = function(driver) {
    this.drivers.push(driver);
    return this;
}

System.prototype.monitor = function(monitor) {
    this.monitors.push(monitor);
    return this;
}

System.prototype.step = function() {
    this.iter += 1;
    if(this.iter > this.config.maxIter) {
        return;
    }

    console.debug("[%s]: t = %s", this.iter, this.iter * this.config.dt);

    var system = this;
    var allAcceleration = {};

    for(var id in system.particles) {
        var a = {
            x: 0,
            y: 0,
        };

        // compute the accumulated acceleration
        // from all the drivers
        system.drivers.forEach(function(driver) {
            if(driver.accelerate) {
                var da = driver.accelerate.call(driver, id);
                a.x += da.x;
                a.y += da.y;
            }
        });

        if(isNaN(a.x + a.y)) {
            console.error("NaN Error", a);
            throw("NaN Error:" + a);
        }

        allAcceleration[id] = a;
    }

    // update the particles by their accelerations
    for(var id in system.particles) {
        system.update(id, allAcceleration[id]);
    }

    // apply the movers
    system.drivers.forEach(function(driver) {
        if(driver.moveAll) {
            driver.moveAll.call(driver);
        }
    });

    // invoke all registered monitors
    system.monitors.forEach(function(m) {
        m.call(m, system.particles);
    });

    setTimeout(system.step.bind(system), system.config.delay);
}

System.prototype.start = function() {
    this.step();
}

module.exports = {
    System,
}
