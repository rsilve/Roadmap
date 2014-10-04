define([], function () {

	function setState($scope, TimeStore) {
		$scope.start = TimeStore.getStart();
		$scope.months = [];
		for (var i = 0; i < 24; i ++) {
			// $scope.start is a momentjs
            var d = $scope.start.clone().add(i, "month");
			var month = { label : d.format("MMM") }
			if (d.month() == 0) {
                month.label = d.format("MMM YYYY");
                month.meta += " startyear"
            }
            if (d.month() % 3 == 0) {
                month.label = d.format("MMM YYYY");
                month.meta += " quarter"
            }
			
            $scope.months.push(month );
        }
	}

    return function ($scope, actions, TimeStore) {
			
        // Get the data
        setState($scope, TimeStore)
        
        // update the data
        $scope.$on(TimeStore.id, function() {
			setState($scope, TimeStore)
        })	

		// Interaction handlers
		
		// time forward
		$scope.previousQuarter = function() {
			actions.previousPeriod();
		}

		// time forward
		$scope.nextQuarter = function() {
			actions.nextPeriod();
		}

    };
});