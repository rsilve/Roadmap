define(["react-with-addons", "stores/CalendarStore", "actions/ProjectActions"],
    function(React, CalendarStore, actions) {

        function getCalendarState() {
            return {
                calendar: CalendarStore.getCalendar()
            };
        }


        return React.createClass({
        getInitialState: function () {
            return getCalendarState()
        },
        componentDidMount: function() {
            CalendarStore.addChangeListener(this._onChange);
        },
        componentWillUnmount: function() {
            CalendarStore.removeChangeListener(this._onChange);
        },
        _onChange: function() {
            this.setState(getCalendarState());
        },
        handleAdd: function(e) {
            if (!e) e = window.event;
            var keyCode = e.keyCode || e.which;
            if (keyCode == '13') {
                actions.setCalendar(this.refs.calendar.getDOMNode().value.trim());
            }
        },
        render: function () {
            return React.DOM.div({},
                React.DOM.input({
                    ref : "calendar",
                    onKeyPress: this.handleAdd
                }),
                "lkeiu3l7esjg84u49pb87gp4as@group.calendar.google.com");
        }
    });

});