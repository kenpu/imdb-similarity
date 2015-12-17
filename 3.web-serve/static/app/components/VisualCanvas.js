var React = require('react');
var ReactDOM = require('react-dom');
var Graph = require('../algorithms/graph');
var Parts = require('../algorithms/parts');
var Config = require('../algorithms/config');

var VisualCanvas = React.createClass({
    componentDidMount: function() {
        var {name, sim, size, width, height} = this.props;

        var box = {
                x0: 0, 
                y0: 0, 
                x1: width, 
                y1: height
            };

        var canvas = ReactDOM.findDOMNode(this.refs.canvas);
        var ctx = canvas.getContext('2d');

        // make the graph
        //
        var graph = Graph.make(sim, size);
        var mst   = Graph.prims(graph);
        var conf  = Config(name);

        // make system
        //
        var sys = Graph.mksys(name, graph, mst, width, height);
        var spring    = Parts.Spring(sys);
        var collision = Parts.Collision(sys);
        var boundary  = Parts.Boundary(sys, box);
        var charge    = Parts.Charge(sys);
        var tightRope = Parts.MaxLength(sys);
        var drawing   = Parts.Draw(ctx, sys);
        var gravity   = Parts.Gravity(sys, width, height);

           sys.edgeAccelerator(spring)
           .particleAccelerator(charge)
           .mover(gravity)
           .mover(collision)
           .mover(tightRope)
           //.mover(boundary)
           .monitor(drawing)
           ;

        window.sys = sys;

        sys.start(conf);
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
