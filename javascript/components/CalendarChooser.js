define(["react-with-addons", "stores/CalendarStore", "actions/ProjectActions"],
    function(React, CalendarStore, actions) {

        function getCalendarState() {
            return {
                calendar: CalendarStore.getCalendar()
            };
        }
        function getCalendarList() {
            return {
                calendarList: CalendarStore.getCalendarList(),
                calendar: CalendarStore.getCalendar()
            };
        }

        var Calendar = React.createClass({
            handleCalendarSelect : function() {
                actions.setCalendar(this.props.id)
            },
            render: function () {
                var cx = React.addons.classSet;
                var classes = cx({
                    'calendar-selected': this.props.selected,
                    'calendar': true
                });
                return React.DOM.li({
                    className : classes,
                    onClick: this.handleCalendarSelect
                }, this.props.name, this.props.selected)
            }
        });

        return  React.createClass({
            getInitialState: function () {
                return getCalendarList()
            },
            componentDidMount: function() {
                CalendarStore.addChangeListener(this._onChange);
            },
            componentWillUnmount: function() {
                CalendarStore.removeChangeListener(this._onChange);
            },
            _onChange: function() {
                this.setState(getCalendarList());
            },
            render: function () {
                var actual = this.state.calendar;
                var calendarNodes = [];
                this.state.calendarList.forEach(function(calendar) {
                    var selected = actual == calendar.id;
                    calendarNodes.push(Calendar({
                        key : calendar.id,
                        id: calendar.id,
                        name : calendar.summary,
                        selected : selected
                    }))
                });
                var cx = React.addons.classSet;
                var classes = cx({
                    'calendar-need-select': ! this.state.calendar,
                    'calendar-chooser': true
                });
                return React.DOM.div({
                        className : classes
                    },
                    React.DOM.div({}, "Choisissez un calendrier"),
                    React.DOM.ul({className: "calendar-list"}, calendarNodes));
            }
        });


});