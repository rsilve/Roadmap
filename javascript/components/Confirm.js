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

        $scope.confirm = function(c) {
            $scope.$emit("dispatcher", constants.CONFIRM_OK, c)
        };

        $scope.cancel = function(c) {
            $scope.$emit("dispatcher", constants.CONFIRM_CANCEL, c)
        };

    }
	
});