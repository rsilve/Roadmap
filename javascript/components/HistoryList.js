define(['services/Constants'], 
function (constants) {

	return function($scope, HistoryStore) {
		
		var setState = function() {
	        $scope.history = HistoryStore.getHistory();
			$scope.progress = false;
		};
		
		// Initial state
		setState();
		
		// Binding
		$scope.$on(HistoryStore.id, setState);
        
		// Interaction handlers
		
		$scope.undo = function() {
			$scope.$emit("dispatcher", constants.UNDO, {data : $scope.history.slice(0,1).shift() } )
			$scope.progress = true;
		}
	}
	
});