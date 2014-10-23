define(['services/Constants'], function (constants) {

	
    return function (SessionStore) {
		
		return {
		  link : function($scope, element, attrs) {
		    $scope.$emit("dispatcher", constants.SESSION_LOADED, {session : SessionStore})
		  }
		};
    };
});