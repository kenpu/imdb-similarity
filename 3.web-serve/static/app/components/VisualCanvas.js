var React = require('react');
var ReactDOM = require('react-dom');
var Graph = require('../algorithms/graph');
var Layout = require('../algorithms/layout');
var makeSimpleSystem  = require('../algorithms/simple_system');

var VisualCanvas = React.createClass({
    componentDidMount: function() {
        var canvas = ReactDOM.findDOMNode(this.refs.canvas);
        var ctx = canvas.getContext('2d');

        var {width, height} = this.props;

        makeSimpleSystem(ctx).start();
    },
    render: function() {
        var {
            sim,
            size,
            width,
            height,
        } = this.props;

        /*
        let g = Graph.make(sim, size);
        let data = Graph.prims(g);
        */

        return (
            <div>
                <canvas width={width} height={height} ref="canvas">
                </canvas>
            </div>
        );
    }
});


module.exports = VisualCanvas;
