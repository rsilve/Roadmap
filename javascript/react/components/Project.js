define(["react-with-addons", "momentjs", "actions/ProjectActions", "stores/TimeStore"], function(React, moment, actions, timeStore) {


   var timeStyle = function(ref, start, end) {
        var style = { position: "absolute", top: 0 , left: 0, width: 8};

        var dayStart = start.clone().startOf("day");
        var dayEnd = end.clone().endOf("day");
        var dayRef = ref.clone().startOf("day");

        var offset = dayStart.diff(dayRef);
        style.left = moment.duration(offset).asMonths() * 80 ;

        var duration = Math.abs(dayStart.diff(dayEnd));
        style.width = moment.duration(duration).asMonths() * 80;

        return style
    };

    var guid = (function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return function() {
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        };
    })();


   var ProjectName =  React.createClass({
       handleBlur: function(event) {
           actions.updateName(this.props.id, this.refs.name.getDOMNode().innerText.trim())
       },
       handleEnter: function(e) {
           if (!e) e = window.event;
           var keyCode = e.keyCode || e.which;
           if (keyCode == '13') {
               this.refs.name.getDOMNode().blur()
           }
       },
       render: function () {
           return React.DOM.div({},
               React.DOM.span({
                   "className": "Project-Name",
                   "contentEditable": true,
                   ref : "name",
                   onBlur: this.handleBlur,
                   onKeyPress: this.handleEnter
                }, this.props.name),
               React.DOM.i({className: "fa fa-pencil project-name-edit"})
           );
       }
   });

    var EditableDate = React.createClass({
        handleEnter: function(e) {
            if (!e) e = window.event;
            var keyCode = e.keyCode || e.which;
            if (keyCode == '13') {
                this.getDOMNode().blur()
            }
        },
        render: function () {
            var date = this.props.date.format("DD/MM/YYYY");
            return React.DOM.span({
                contentEditable: true,
                onKeyPress : this.handleEnter,
                onBlur: this.props.onBlur,
                key: guid() // needed for a correct re-render
            }, date);
        }
    });

    var Collapsable = React.createClass({
        getInitialState: function () {
            return {open: this.props.initialyOpen}
        },
        handleToggle : function() {
            this.setState({open: ! this.state.open })
        },
        render: function () {
            var cx = React.addons.classSet;
            var classes = cx({
                'row-over' : true,
                'collapse-toggle': true,
                'collapse-toggle-open': this.state.open,
                'collapse-toggle-close': !this.state.open
            });
            var classesPanel = cx({
                'collapse-panel': true,
                'collapse-panel-open': this.state.open,
                'collapse-panel-close': !this.state.open
            });
            var toggleBtn = React.DOM.div({
                "className": classes,
                onClick: this.handleToggle
            });
            var panel = React.DOM.div({className: classesPanel}, this.props.children)
            return React.DOM.div({}, toggleBtn, panel);
        }
    });

    var DescriptionField = React.createClass({
        getInitialState: function () {
            return {text: this.props.initialText}
        },
        handleText : function(event) {
          this.setState({
              text: event.target.value
          })
        },
        handleDescription: function(event) {
            //console.log(event)
            actions.updateDescription(this.props.id, event.target.value)
        },

        render: function() {
                return React.DOM.div({
                        className : "Project-Description"
                    },
                    React.DOM.label({className : "Project-Description-Label"}, "Description"),
                    React.DOM.textarea({
                        ref: "description",
                        className : "Project-Description-Text",
                        value: this.state.text,
                        onChange : this.handleText,
                        onBlur : this.handleDescription
                    })
                )
            }
    });

    var DeleteAttendee = React.createClass({
        onDelete : function(event) {
            actions.removeAttendee(this.props.id, this.props.email)
        },
        render: function () {
            return React.DOM.span({
                className : "Project-Attendee-delete delete-icon",
                onClick: this.onDelete
            })
        }
    });

    var AddAttendee = React.createClass({
        handleAddAttendee: function(e) {
            actions.addAttendee(this.props.id, this.refs.input.getDOMNode().innerText.trim())
        },
        handleEnter: function(e) {
            if (!e) e = window.event;
            var keyCode = e.keyCode || e.which;
            if (keyCode == '13') {
                event.target.blur()
            }
        },
        handlePlus: function(e) {
            this.refs.input.getDOMNode().focus()
        },

        render: function () {
            var plus = React.DOM.span({
                onClick: this.handlePlus,
                className : "Project-Attendee-email clickable"
            }, "+");
            var input = React.DOM.span({
                ref: "input",
                contentEditable : true,
                onKeyPress: this.handleEnter,
                onBlur: this.handleAddAttendee
            });
            return React.DOM.div({},
                input, plus
            )
        }
    });

    var Attendee = React.createClass({
        handleAttendee: function(e) {
            actions.updateAttendee(this.props.id, this.props.email, this.refs.input.getDOMNode().innerText.trim())
        },
        handleEnter: function(e) {
            if (!e) e = window.event;
            var keyCode = e.keyCode || e.which;
            if (keyCode == '13') {
                event.target.blur()
            }
        },
        render: function () {
            return React.DOM.span({
                ref: "input",
                contentEditable : true,
                onKeyPress: this.handleEnter,
                onBlur: this.handleAttendee
            }, this.props.email);
        }
    });

    var Attendees = React.createClass({
        render: function () {
            var array = [];
            var id =  this.props.id
            this.props.attendees.forEach(function(attendee) {
                var email =  Attendee({key: guid(), id: id,  email: attendee.email})
                var del = DeleteAttendee({key: guid(), id: id,  email: attendee.email})
                array.push(React.DOM.li({className : "Project-Attendee", key : guid()}, email, del))
            });
            var add = React.DOM.li({className : "Project-Attendee"},AddAttendee({key: guid(), id: id}));
            return React.DOM.ul({className : "Project-Attendees"},
                array, add);
        }
    });



return React.createClass({
        handleRemove: function(event) {
            actions.destroy(this.props.key, this.props.name)
        },
        handleStart: function(event) {
            actions.updateStart(this.props.key, moment(this.refs.start.getDOMNode().innerText.trim(), "DD/MM/YYYY"))
        },
        handleEnd: function(event) {
            actions.updateEnd(this.props.key, moment(this.refs.end.getDOMNode().innerText.trim(), "DD/MM/YYYY"))
        },
        render: function () {
            var name = ProjectName({id: this.props.key, name: this.props.name});

            var start = EditableDate({
                ref: "start",
                className: "Project-Start",
                date: this.props.start,
                onBlur: this.handleStart
            });

            var end = EditableDate({
                ref: "end",
                className: "Project-End",
                date: this.props.end,
                onBlur: this.handleEnd
            });

            var deleteBtn = React.DOM.div({
                "className": "Project-delete delete-icon",
                onClick: this.handleRemove
            });

            var descriptionField = DescriptionField({
                id: this.props.key,
                initialText : this.props.description
            });

            var attendees = Attendees({
                id: this.props.key,
                attendees: this.props.attendees
            });

            var collapsePanel = Collapsable({}, descriptionField, attendees);

            var timebar =  React.DOM.div({
                className : "Project-timebar",
                style: timeStyle(timeStore.getStart(), this.props.start, this.props.end)
            });

            return React.DOM.li({
                "className": "Project"
            }, timebar, name, start,
                React.DOM.i({className: "fa fa-long-arrow-right", style: {paddingRight: 6, paddingLeft: 6}}),
                end, deleteBtn, collapsePanel)
        }
    });

});