define(['services/Constants'], 
function (constants) {

	return function($scope, ConfirmStore) {
		
		var setState = function() {
	        $scope.confirms = ConfirmStore.getConfirms();
		};
		
		// Initial state
		setState();
		
		// Binding
		$scope.$on(ConfirmStore.id, setState);
        

	}
	
});