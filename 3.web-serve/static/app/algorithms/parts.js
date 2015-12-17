const physics = require('./physics');

function Spring(sys) {
    return function(p1, p2) {
        return physics._spring(
                    p1, 
                    p2, 
                    sys.config.K, 
                    sys.config.L0);
    }
}

function Collision(sys) {
    return function() {
        for(var i=0; i < sys.idlist.length; i++) {
            var p1 = sys.particles[sys.idlist[i]];
            for(var j=i+1; j < sys.idlist.length; j++) {
                var p2 = sys.particles[sys.idlist[j]];
                physics.collision(p1, p2);
            }
        }
    }
}

function Boundary(sys, box) {
    return function() {
        physics.bounce(sys.particles, box);
    }
}

function Charge(sys) {
    return function(p) {
        var a1 = {
            x: 0,
            y: 0
        };
        for(var i in sys.particles) {
            if(i != p.id) {
                var p2 = sys.particles[i];
                var a = physics._repel(p, p2, sys.config.C);
                a1.x += a[p.id].x;
                a1.y += a[p.id].y;
            }
        }
        return {
            [p.id]: a1
        }
    }
}

function Gravity(sys) {
    return function() {
    }
}

function Draw(ctx, sys) {
    return function() {
        var w = ctx.canvas.width,
            h = ctx.canvas.height;
        ctx.clearRect(0, 0, w, h);
        ctx.save();
        ctx.globalAlpha = 0.2;
        for(var id in sys.particles) {
            var p = sys.particles[id];
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, 2*Math.PI);
            ctx.fill();
        }
        ctx.restore();

        ctx.save();
        ctx.textAlign = "center";
        ctx.baseLine = "middle",
        ctx.fillStyle = "#000";
        ctx.font = "9pt";
        for(var id in sys.particles) {
            var p = sys.particles[id];
            ctx.fillText(p.id, p.x, p.y);
        }
        ctx.restore();

        ctx.save();
        ctx.strokeStyle = "#f00";
        ctx.lineWidth = 2;
        for(var id1 in sys.adjacency) {
            var p1 = sys.particles[id1];
            for(var id2 in sys.adjacency[id1]) {
                var p2 = sys.particles[id2];
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
        ctx.restore();
    }
}

module.exports = {
    Spring,
    Charge,
    Gravity,
    Collision,
    Boundary,
    Draw,
}
