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
			console.debug("Emit ", self.id)
	        self.$scope.$broadcast(self.id)
		}
		
    };
	Store.prototype.bind = function(/* string */ event, /* function */ callback, /* boolean */ emitDisabled) {
		var self = this;
		if (emitDisabled) {
			var f = function(payload) {
				if (event === payload.actionType)
				 	return self.dispatcher.when(callback(payload))
				else 
					return self.dispatcher.noop()
			}
			this.dispatchIndex[event] = this.dispatcher.register(f);
		} else {
			var f = function(payload) {
				if (event === payload.actionType)
				 	return self.dispatcher.when(callback(payload)).then(self.emitChange())
				else 
					return self.dispatcher.noop()
			}
			this.dispatchIndex[event] = this.dispatcher.register(f);
		}
		return this;
	}

    return Store
});