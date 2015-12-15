// constructs a spring between two particles
function Spring(p1, p2, K, L0) {
    "use strict";
    return {
        accelerate(id) {
            var dx = p1.x - p2.x;
            var dy = p1.y - p2.y;
            var L = Math.sqrt(dx*dx + dy*dy);
            var dL = L - L0;
            var F = K * dL * dL;
            var Fx = F * dx / L;
            var Fy = F * dy / L;
            var sgn = (dL < 0) ? 1 : -1;

            if(id == p2.id) {
                sgn = -1 * sgn;
            }

            var a = {
                x: sgn * Fx,
                y: sgn * Fy,
            };

            return a;
        }
    }
}

// a drive for collision
function Collision(particles) {
    const COLLISION_DAMP = 0.5;
    var id_list = [];
    for(var id in particles) {
        id_list.push(id);
    }

    return {
        moveAll() {
            console.debug("COLLISION resolution", id_list);
            for(var i=0; i < id_list.length; i++) {
                var p1 = particles[id_list[i]];
                for(var j = i+1; j < id_list.length; j++) {
                    var p2 = particles[id_list[j]];

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
                        var w1 = p1.r / (p1.r + p2.r);
                        var w2 = p2.r / (p1.r + p2.r);
                        p1.x -= x * factor * w1;
                        p1.y -= y * factor * w1;

                        p2.x -= x * factor * w2;
                        p2.y -= y * factor * w2;

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
            }
        }
    }
}

function Draw(ctx) {
    return function(particles) {
        ctx.clearRect(0, 0, 800, 500);
        for(var id in particles) {
            var p = particles[id];
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, 2*Math.PI);
            ctx.fill();
        }
    }
}

module.exports = {
    Spring,
    Draw,
    Collision,
};
