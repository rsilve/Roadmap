define(['services/Constants'], function (constants)  {

    return function ($scope, TimeStore) {
		
		var setState = function() {
			$scope.start = TimeStore.getStart();
			$scope.months = TimeStore.getTicks();
		}	
			
			
        // Init
        setState()

		// Binding
		$scope.$on(TimeStore.id, setState)
      
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