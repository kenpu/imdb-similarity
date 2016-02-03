var React = require('react');
var ReactDOM = require('react-dom');
var Parts = require('../algorithms/parts');

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
        var sys = this.props.sys;

        // make system
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
        sys.start();
    },


    render: function() {
        var {
            width,
            height,
        } = this.props;

        return (
            <div>
                <canvas width={width} height={height} ref="canvas" />
            </div>
        );
    }
});


module.exports = VisualCanvas;
