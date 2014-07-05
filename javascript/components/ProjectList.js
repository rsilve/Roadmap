

define(["react-with-addons","components/Project", "stores/ProjectStore","stores/TimeStore"],
    function(React, Project, ProjectStore, TimeStore) {


    var startSort = function(a, b) {
        return a.props.start.valueOf() - b.props.start.valueOf()
    };
    var nameSort = function(a, b) {
        return a.props.name.localeCompare(b.props.name)
    };

    return React.createClass({
        getInitialState: function () {
            return {items : []}
        },
        componentDidMount: function() {
            this._onChange();
            ProjectStore.addChangeListener(this._onChange);
            TimeStore.addChangeListener(this._onChange);
        },
        componentWillUnmount: function() {
            ProjectStore.removeChangeListener(this._onChange);
            TimeStore.removeChangeListener(this._onChange);
        },
        _onChange: function() {
            var self = this
            ProjectStore.getFiltered()
                .then(function(projects) {
                    return {
                        items: projects
                    }
                }).then(function(state) {
                    self.setState(state);
                })
        },
        render: function () {
            var projectNodes = [];
            this.state.items.forEach(function(project) {
                projectNodes.push(Project({
                    key : project.id, name : project.name,
                    start: project.start, end: project.end,
                    description: project.description,
                    attendees: project.attendees
                }));
            });
            projectNodes = projectNodes.sort(startSort)
            var r = React.DOM.ul({"className": "ProjectList"}, projectNodes)
            return r;
        }
    });
});
