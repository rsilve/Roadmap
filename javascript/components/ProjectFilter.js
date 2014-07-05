define(["react-with-addons", "actions/ProjectActions"], function(React, actions) {

    return React.createClass({
        handleChange: function(e) {
            actions.filter(this.refs.filter.getDOMNode().value.trim());
        },
        render: function () {
            var name = React.DOM.input({
                size: 20,
                ref : "filter",
                onChange: this.handleChange,
                placeholder: "Search project"}
            );
            return name;
        }
    });

});