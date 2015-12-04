var assign = require('object-assign');

function System(o) {
    this.particles = {};
    this.config = assign({
        maxIter: 100,
        delay:   100,
        dt:      0.1,
        debug:   true,
    }, o);
}

System.prototype.add = function(particle) {
    this.particles[particle.id] = particle;
    this.drivers = [];
    this.iter = 0;
    return this;
}

System.prototype.update = function(id, delta) {
    var p = this.particles[id];
    var {x, y, xp, yp} = p;
    var x2, y2;

    if('dx' in delta) {
        x2 = x + delta.dx;
        y2 = y + delta.dy;
    } else if( 'x' in delta ) {
        x2 = delta.x;
        y2 = delta.y;
    } else if( 'ax' in delta) {
        x2 = (2 - damp) * x - (1 - damp)*xp + delta.ax * dt * dt;
        y2 = (2 - damp) * y - (1 - damp)*yp + delta.ay * dt * dt;
    }

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

System.prototype.step = function() {
    this.iter += 1;
    if(this.iter > this.config.maxIter) {
        return;
    }

    console.debug("[%s]: t = %s", this.iter, this.iter * this.config.dt);
    var system = this;
    for(var id in this.particles) {
        let p = this.particles[id];

        this.drivers.forEach(function(driver) {
            if('move' in driver) {
                let neighbours = driver.nearBy(id);
                neighbours.forEach(function(id2) {
                    let delta = driver.move(id, id2);
                    system.update(id, delta);
                });
            }

            if('call' in driver) {
                driver.call(system.particles);
            }
        });
    }

    setTimeout(system.step.bind(system), system.config.delay);
}

System.prototype.start = function() {
    this.step();
}


module.exports = {
    System,
}
