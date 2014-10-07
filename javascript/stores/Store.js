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


    function Store($scope) {
        this.$scope = $scope;
        this.id = guid();
		this.dispatchIndex = {};

    }
    Store.prototype.emitChange = function() {
		var self = this;
		return function() {
	        console.debug("Emit "+self.id);
	        self.$scope.$broadcast(self.id)
		}
		
    };
	Store.prototype.bind = function(/* string */ event, /* function */ callback, /* boolean */ emitDisabled) {
		if (emitDisabled) {
			this.dispatchIndex[event] = dispatcher.register(callback);
		} else {
			var self = this;
			var f = function(payload) {
				return callback(payload).then(self.emitChange())
			}
			this.dispatchIndex[event] = dispatcher.register(f);
		}
		return this;
	}

    return Store
});