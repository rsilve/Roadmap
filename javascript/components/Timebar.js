define(['services/Constants'], function (constants)  {

    /**
     * Factory method for the Timebar component
     */
    return function ($scope, TimeStore) {

        /**
         * Helper to set component state on each Stores notification
         */
		var setState = function() {
			$scope.start = TimeStore.getStart();
			$scope.months = TimeStore.getTicks();
		};
			
			
        // Init the component
        setState();

		// Bind the component to the stores
		$scope.$on(TimeStore.id, setState);


        /**
         * scope handler to notify Timestore to change to next period
         */
		$scope.previousQuarter = function() {
			$scope.$emit("dispatcher", constants.TIME_PREV_PERIOD)
		};

        /**
         * scope handler to notify Timestore to change to previous period
         */
		$scope.nextQuarter = function() {
			$scope.$emit("dispatcher", constants.TIME_NEXT_PERIOD)
		};

    };
});