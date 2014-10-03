define([], function () {

    return function ($scope, CalendarStore) {
			
        // Get the data
        $scope.list = CalendarStore.getCalendarList();

        // update the data
        $scope.$on(CalendarStore.id, function() {
            $scope.list = CalendarStore.getCalendarList();
        })	

    };
});