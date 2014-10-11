define(['Constants'], 
function (constants) {

	return function($scope, HistoryStore) {
		
		var setState = function() {
	        $scope.history = HistoryStore.getHistory();
		}
		
		// Initial state
		setState();
		
		// Binding
		$scope.$on(HistoryStore.id, setState);
        
		// Interaction handlers
		
	}
	
});