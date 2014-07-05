define(["react-with-addons"], function(React) {


    return React.createClass({
        render: function () {
            var month = this.props.date.format("MMM");
            var meta = {"className": "TimeBar-Month month"}
            if (this.props.date.month() == 0) {
                month = this.props.date.format("MMM YYYY");
                meta.className += " startyear"
            }
            if (this.props.date.month() % 3 == 0) {
                month = this.props.date.format("MMM YYYY");
                meta.className += " quarter"
            }


            return React.DOM.div(meta, month)
        }
    });

});