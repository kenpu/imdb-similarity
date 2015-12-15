var layout = require('./layout');
var drivers = require('./drivers');

module.exports = function(ctx) {
    var p1 = {
        id: 1,
        x: 100,
        y: 100,
        r: 20,
    };
    var p2 = {
        id: 2,
        x: 200,
        y: 120,
        r: 10,
    };

    var sys = new layout.System();
    var spring = drivers.Spring(p1, p2, 0.01, 10);
    var draw = drivers.Draw(ctx);

    sys.add(p1).add(p2);

    var collision = drivers.Collision(sys.particles);

    sys.driver(spring).driver(collision).monitor(draw);
    return sys;
}
