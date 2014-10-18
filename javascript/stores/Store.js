define([], function () {

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


    function Store($scope, dispatcher) {
        this.$scope = $scope;
        this.id = guid();
		this.dispatchIndex = {};
		this.dispatcher = dispatcher;

    }
    Store.prototype.emitChange = function() {
		var self = this;
		return function() {
			console.debug("Emit ", self.id);
	        self.$scope.$broadcast(self.id)
		}
		
    };
    Store.prototype.bind = function(/* string */ event, /* function */ callback, /* boolean */ emitDisabled) {
        var self = this;
        var f = function(payload, ec) {
            if (event === payload.actionType) {
                var p = ec.when(callback(payload, ec))
                return emitDisabled ? p : p.then(self.emitChange());
            } else
                ec.ignore();
        };
        this.dispatchIndex[event] = this.dispatcher.register(f);
        return this;
    };

    Store.prototype.recover = function(/* string */ event, /* function */ callback, /* boolean */ emitDisabled) {
        var self = this;
        var f = function(payload, ec) {
            if (event === payload.actionType) {
                var p = ec.when(callback(payload, ec))
                return emitDisabled ? p : p.then(self.emitChange());
            } else
                ec.ignore();
        };
        this.dispatchIndex[event] = this.dispatcher.waitForError(f);
        return this;
    };

    return Store
});