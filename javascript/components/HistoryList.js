define(['services/Constants'], 
function (constants) {

	return function($scope, HistoryStore, $interval) {
		
		var setState = function() {
	        $scope.history = HistoryStore.getHistory();
			$scope.progress = false;
		};
		
		// Initial state
		setState();
		
		// Binding
		$scope.$on(HistoryStore.id, setState);

		// refresh the view every minute
		// to update time display
		$interval(function() {}, 10000);


		// Interaction handlers
		
		$scope.undo = function() {
			$scope.$emit("dispatcher", constants.PROJECT_SAVE, {data : $scope.history.slice(0,1).shift() } );
			$scope.progress = true;
		}
	}
	
});