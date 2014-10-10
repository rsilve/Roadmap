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


    function Store( dispatcher) {
        this.id = guid();
		this.dispatchIndex = {};
		this.dispatcher = dispatcher;

    }
   Store.prototype.bind = function(/* string */ event, /* function */ callback) {
		var self = this;
		var f = function(payload) {
            if (payload.actionType === event) {
                return callback(payload)
            } else
                return self.dispatcher.noop();
			
		}
		this.dispatchIndex[event] = this.dispatcher.register(f)
		return this;
	}

    return Store
});