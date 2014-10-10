define(['Constants'], function (constants)  {

	function setState($scope, TimeStore) {
		$scope.start = TimeStore.getStart;
		$scope.months = TimeStore.getMonths;
	}

    return function ($scope, TimeStore) {
			
        // Init
        setState($scope, TimeStore)
        
      
		// Interaction handlers
		
		// time forward
		$scope.previousQuarter = function() {
			$scope.$emit("dispatcher", constants.TIME_PREV_PERIOD)
		}

		// time forward
		$scope.nextQuarter = function() {
			$scope.$emit("dispatcher", constants.TIME_NEXT_PERIOD)
		}

    };
});