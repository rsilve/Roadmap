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
		this.dispatchIndex = -1;
    }
    Store.prototype.emitChange = function() {
		var self = this;
		return function() {
	        console.debug("Emit "+self.id);
	        self.$scope.$broadcast(self.id)
		}
		
    };

    return Store
});