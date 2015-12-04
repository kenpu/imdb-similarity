const store = require('./store');
const React = require('react');
const ReactDOM = require('react-dom');
const VisualNav = require('./components/VisualNav');
const VisualCanvas = require('./components/VisualCanvas');

var VisualizeApp = React.createClass({
    getInitialState: function() {
        return {
        };
    },
    onChange: function() {
        this.setState(store.getState());
    },
    componentWillMount: function() {
        store.addChangeListener(this.onChange);
    },
    componentWillUnmount: function() {
        store.removeChangeListener(this.onChange);
    },
    render: function() {
        var {
            sim,
            size,
            loading,
        } = store.getState();

        var body;
        if(! loading) {
            if(sim && size)
                body = (<VisualCanvas 
                            sim={sim} 
                            size={size}
                            width={800}
                            height={500} />);
            else
                body = <div>Empty</div>;
        }
        else
            body = <div className="loading">Loading</div>

        return (
            <div className="visualize-app">
                <VisualNav />
                <div className="main">
                    {body}
                </div>
            </div>
        );
    }
});


ReactDOM.render(<VisualizeApp />, $("#app")[0]);
