define(["react-with-addons", "actions/ProjectActions", "components/MonthTick", "stores/TimeStore"], function(React, actions, MonthTick, store) {


    function getTimeState() {
        return {
            start: store.getStart()
        };
    }

    return React.createClass({
        getInitialState: function () {
            return getTimeState()
        },
        componentDidMount: function() {
            store.addChangeListener(this._onChange);
        },
        componentWillUnmount: function() {
            store.removeChangeListener(this._onChange);
        },
        _onChange: function() {
            this.setState(getTimeState());
        },
        handleClickNext: function(event) {
            actions.nextPeriod()
        },
        handleClickPrev: function(event) {
            actions.previousPeriod();
        },
        render: function () {
            var ref = this.state.start;
            var ticks = []

            for (var i = 0; i < 24; i ++) {
                var d = ref.clone().add("month", i);
                ticks.push(MonthTick({key: d.valueOf(), date: d}));
            }
            var prev = React.DOM.div({
                className: "TimeBar-Prev",
                onClick: this.handleClickPrev
            }, "<<");
            var next = React.DOM.div({
                className: "TimeBar-Next",
                onClick: this.handleClickNext
            }, ">>");

            var r = React.DOM.div({"className": "TimeBar"},
                React.DOM.div({className: "clearfix"}, prev,next),
                React.DOM.div({className: "TimeBar-Ticks clearfix"}, ticks))
            return r;
        }
    });
});
