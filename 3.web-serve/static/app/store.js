const eventEmitter = require('events').EventEmitter;
const assign = require('object-assign');

var state = {
    sim: null,
    size: null,
    loading: false,
};

const store = assign({}, eventEmitter.prototype, {
    emitChange: function() {
        this.emit('change');
    },
    addChangeListener: function(callback) {
        this.on('change', callback);
    },
    removeChangeListener: function(callback) {
        this.removeListener('change', callback);
    },
    getState: function() {
        return state;
    },
    setState: function(data) {
        state = assign(state, data);
    },
});


window.state = state;

module.exports = store;
