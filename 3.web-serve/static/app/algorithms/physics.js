function accelerate(p, a, dt) {
    var damp = this.DAMPING || 0.4;
    var {x, y, xp, yp} = p;
    var x2, y2;

    x2 = (2 - damp) * x - (1 - damp)*xp + a.x * dt * dt;
    y2 = (2 - damp) * y - (1 - damp)*yp + a.y * dt * dt;

    if(isNaN(x + y + x2 + y2)) {
        console.error(p, a, x, y, x2, y2, damp);
        throw("Accelerate NaN error");
    }

    p.x = x2;
    p.y = y2;
    p.xp = x;
    p.yp = y;
}

function _spring(p1, p2, K, L0) {
    if(isNaN(p1.x + p1.y + p2.x + p2.y)) {
        console.error(p1, p2);
        throw("Accelerate NaN error");
    }
    var dx = p1.x - p2.x;
    var dy = p1.y - p2.y;
    var L = Math.sqrt(dx*dx + dy*dy);
    var dL = L - L0;
    var F = K * dL * dL;
    var Fx = F * dx / L;
    var Fy = F * dy / L;
    var sgn = (dL < 0) ? 1 : -1;
    var a1 = {
        x: sgn * Fx,
        y: sgn * Fy,
    };
    var a2 = {
        x: -1 * sgn * Fx,
        y: -1 * sgn * Fy,
    };

    return {
        [p1.id]: a1,
        [p2.id]: a2,
    }
}

// force acting on p by q via repulsion
function _repel(p, q, C) {
    var dx = p.x - q.x;
    var dy = p.y - q.y;
    var L2 = (dx*dx + dy*dy);
    var L = Math.sqrt(L2);

    var F = C / L2;
    var Fx = F * dx / L,
        Fy = F * dy / L;

    return {
        [p.id]: {
            x: Fx,
            y: Fy,
        },
        [q.id]: {
            x: -Fx,
            y: -Fy,
        }
    }
}


function bounce(particles, box) {
    var BOUNCE_DAMPING = this.BOUNCE_DAMPING || 0.8;

    for(var id in particles) {
        var p = particles[id];
        var vx, vy;

        if(isNaN(p.x + p.y)) {
            console.error("prebounce", box, p, BOUNCE_DAMPING);
            throw("Bounce error.");
        }

        if(p.x - p.r < box.x0) {
            vx = (p.xp - p.x) * BOUNCE_DAMPING;
            p.x = p.r;
            p.xp = p.x - vx;
        } else if(p.x + p.r > box.x1) {
            vx = (p.xp - p.x) * BOUNCE_DAMPING;
            p.x = box.x1 - p.r;
            p.xp = p.x - vx;
        }

        if(p.y - p.r < box.y0) {
            vy = (p.yp - p.y) * BOUNCE_DAMPING;
            p.y = p.r;
            p.yp = p.y - vy;
        } else if(p.y + p.r > box.y1) {
            vy = (p.yp - p.y) * BOUNCE_DAMPING;
            p.y = box.y1 - p.r;
            p.yp = p.y - vy;
        }

        if(isNaN(p.x + p.y)) {
            console.error("box", box, p, 
                    BOUNCE_DAMPING, vx, vy);
            throw("Bounce error.");
        }
    }
}

function collision(p1, p2) {
    var COLLISION_DAMP = this.COLLISION_DAMP || 0.8;
    var x = p1.x - p2.x;
    var y = p1.y - p2.y;
    var ll = x * x + y * y;
    var l = Math.sqrt(ll);
    var target = p1.r + p2.r;
    
    if(l < target) {
        var v1x = p1.x - p1.xp;
        var v1y = p1.y - p1.yp;
        var v2x = p2.x - p2.xp;
        var v2y = p2.y - p2.yp;
        var factor = (l - target) / l;

        // move them apart
        var w1 = 0.5; // p1.r / (p1.r + p2.r);
        var w2 = 0.5; // p2.r / (p1.r + p2.r);
        p1.x -= x * factor * w1;
        p1.y -= y * factor * w1;

        p2.x += x * factor * w2;
        p2.y += y * factor * w2;

        // adjust velocity for inertia transfer
        var f1 = COLLISION_DAMP * (x * v1x + y*v1y) / ll;
        var f2 = COLLISION_DAMP * (x * v2x + y*v2y) / ll;
        v1x += f2*x - f1*x;
        v2x += f1*x - f2*x;
        v1y += f2*y - f1*y;
        v2y += f1*y - f2*y;

        p1.xp = p1.x - v1x;
        p1.yp = p1.y - v1y;
        p2.xp = p2.x - v2x;
        p2.yp = p2.y - v2y;
    }
}



module.exports = {
    accelerate,
    _spring,
    _repel,
    bounce,
    collision,
}
