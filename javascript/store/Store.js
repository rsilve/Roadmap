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
    }
    Store.prototype.emitChange = function() {
        console.debug("Emit "+this.id);
        this.$scope.$broadcast(this.id)
    };

    return Store
});