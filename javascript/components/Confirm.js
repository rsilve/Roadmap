define(['services/Constants'], function (constants) {

    /**
     * Factory method for the Confirm component
     */
	return function($scope, ConfirmStore, $interval) {

        /**
         * Helper to set component state on each Stores notification
         */
		var setState = function() {
	        $scope.confirms = ConfirmStore.getConfirms();
		};

        // Init the component
		setState();

        // Bind the component to the stores
		$scope.$on(ConfirmStore.id, setState);

        // refresh the view every minute
        $interval(function() {
            $scope.$apply()
        }, 60000);

        /**
         * notify for a confirm accpet
         * @param c
         */
        $scope.confirm = function(c) {
            $scope.$emit("dispatcher", constants.CONFIRM_OK, c)
        };

        /**
         * notify for a confirm reject
         * @param c
         */
        $scope.cancel = function(c) {
            $scope.$emit("dispatcher", constants.CONFIRM_CANCEL, c)
        };

    }
	
});