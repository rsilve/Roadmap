define(["react-with-addons", "actions/ProjectActions"], function(React, actions) {

    return React.createClass({
        handleAdd: function(e) {
            if (!e) e = window.event;
            var keyCode = e.keyCode || e.which;
            if (keyCode == '13') {
                actions.create(this.refs.name.getDOMNode().value.trim());
                this.refs.name.getDOMNode().value = ""
            }
        },
        render: function () {
            var name = React.DOM.input({
                size: 60,
                ref : "name",
                onKeyPress: this.handleAdd,
                placeholder: "Add project"}
            );
            return name;
        }
    });

});