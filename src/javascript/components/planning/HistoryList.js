define(['services/Constants'],
function (constants) {

	/**
	 * Factory method for the HistoryList component
	 */
	return function($scope, HistoryStore, $interval) {

		/**
		 * Helper to set component state on each Stores notification
		 */
		var setState = function() {
	        $scope.history = HistoryStore.getHistory();
			$scope.progress = false;
		};

		// Init the component
		setState();

		// Bind the component to the stores
		$scope.$on(HistoryStore.id, setState);

		// refresh the view every minute
		// to update time display
		$interval(function() {}, 10000);


		/**
		 * scope handler to start an undo action
		 */
		$scope.undo = function() {
			$scope.$emit("dispatcher", constants.UNDO, {data : HistoryStore.last()} );
			$scope.progress = true;
		}
	}
	
});