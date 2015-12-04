var layout = require('./layout');

module.exports = function(ctx) {
    var p1 = {
        id: 1,
        x: 100,
        y: 100,
    };
    var p2 = {
        id: 2,
        x: 100,
        y: 100,
    };

    var sys = new layout.System();

    var spring = {
        nearBy: function(id) {
            return (id == 1) ? [2] : [1];
        },
        move: function(id1, id2) {
            return {
                dx: 10,
                dy: 10,
            }
        },
    };

    var draw = {
        call: function(particles) {
            ctx.clearRect(0, 0, 800, 500);
            for(var id in particles) {
                var p = particles[id];
                ctx.beginPath();
                ctx.arc(p.x, p.y, 20, 0, 2*Math.PI);
                ctx.fill();
            }
        }
    }

    sys.add(p1).add(p2).driver(spring).driver(draw);

    return sys;
}
