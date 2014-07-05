define(["react-with-addons", "components/ProjectAdd","components/ProjectSize","components/ProjectFilter", "stores/ProjectStore"],
    function(React, ProjectAdd, ProjectSize, ProjectFilter, ProjectStore) {


    return React.createClass({
        getInitialState: function () {
            return {size: 0}
        },
        componentDidMount: function() {
            this._onChange()
            ProjectStore.addChangeListener(this._onChange);
        },
        componentWillUnmount: function() {
            ProjectStore.removeChangeListener(this._onChange);
        },
        _onChange: function() {
            var self = this
            ProjectStore.getFiltered()
                .then(function(projects) {
                    return {
                        size : projects.length
                    }
                }).then(function(state) {
                    self.setState(state);
                })
        },
        render: function () {
            var add = ProjectAdd({});
            var filter = ProjectFilter({});
            var size = ProjectSize({size : this.state.size});
            return React.DOM.div({"className": "Project-Toolbar"},
                React.DOM.div({"className": "pull-left"}, add),
                React.DOM.div({"className": "pull-right"},  size),
                React.DOM.div({"className": "pull-right"},  filter)
            )
        }
    });

});