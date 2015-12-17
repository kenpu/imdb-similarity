var React = require('react');
var ReactDOM = require('react-dom');
var Graph = require('../algorithms/graph');
var Parts = require('../algorithms/parts');

var VisualCanvas = React.createClass({
    componentDidMount: function() {
        var {sim, size, width, height} = this.props;

        var box = {
                x0: 0, 
                y0: 0, 
                width: width, 
                height: height
            };

        var canvas = ReactDOM.findDOMNode(this.refs.canvas);
        var ctx = canvas.getContext('2d');

        // make the graph
        //
        var graph = Graph.make(sim, size);
        var mst   = Graph.prims(graph);

        // make system
        //
        var sys       = Graph.mksys(graph, mst, width, height);
        var spring    = Parts.Spring(sys);
        var collision = Parts.Collision(sys);
        var boundary  = Parts.Boundary(sys, box);
        var charge    = Parts.Charge(sys);
        var drawing   = Parts.Draw(ctx, sys);

        sys.edgeAccelerator(spring)
           .particleAccelerator(charge)
           .mover(collision)
           .monitor(drawing)
           ;

        window.sys = sys;
        sys.config.maxIter = 100;
        sys.start();
    },
    render: function() {
        var {
            width,
            height,
        } = this.props;

        return (
            <div>
                <canvas width={width} height={height} ref="canvas">
                </canvas>
            </div>
        );
    }
});


module.exports = VisualCanvas;
