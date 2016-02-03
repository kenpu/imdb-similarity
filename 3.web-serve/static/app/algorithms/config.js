const assign = require('object-assign');

var confs = {
    default: {
        maxIter: 90,
        delay: 50,
        dt: 0.15,
        K: 1/100,
        L0: 5,
        Lmax: 50,
        C: 300000,
        G: 0.01,
        defaultR: 20,
    },
    genres: {
        defaultR: 20,
        Lmax: 100,
    },
    countries: {
        K: 1/500,
        L0: 5,
        Lmax: 20,
        defaultR: 5,
        dt: 0.02,
        delay: 10
    },
}

module.exports = function(name) {
    return assign({}, confs.default, confs[name]);
}
