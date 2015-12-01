const store = require('./store');
const React = require('react');
const ReactDOM = require('react-dom');
const VisualNav = require('./components/VisualNav');

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
        return (
            <div className="visualize-app">
                <VisualNav />
            </div>
        );
    }
});


ReactDOM.render(<VisualizeApp />, $("#app")[0]);
