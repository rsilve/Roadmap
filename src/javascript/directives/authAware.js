define(['services/Constants'], function (constants) {

	
    return function (AuthenticationStore) {
		
		return {
			controller: function($scope) {
				$scope.$on(AuthenticationStore.id, function() { $scope.$emit("dispatcher", constants.AUTHENTICATION_COMPLETED) })
			}
		};
    };
});