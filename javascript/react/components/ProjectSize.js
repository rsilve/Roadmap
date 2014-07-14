define(["react-with-addons"], function(React) {


    return React.createClass({
        render: function () {
            var size = this.props.size;
            if (size == 0) {
                return React.DOM.div({"className": "Project-Size"}, "no project")
            }
            if (size == 1) {
                return React.DOM.div({"className": "Project-Size"}, "One project")
            }
            if (size > 1) {
                return React.DOM.div({"className": "Project-Size"}, size, " projects")
            }

        }
    });

});