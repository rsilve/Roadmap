define(['components/planning/CalendarChooser', 'services/Constants', 'app'], function(CalendarChooser, constants) {

    describe('CalendarChooser component', function () {
        var $rootScope;
		var $scope;
        var CalendarStore
        // Load the module which contains the directive
		beforeEach(function() {
            var injector = angular.injector(['Roadmap.services', 'Roadmap.stores',
                'Google.mocks','ng']);

            var $controller = injector.get('$controller');
            CalendarStore = injector.get('CalendarStore');
            //CalendarStore.clear();
            $rootScope = injector.get('$rootScope');
            $scope = $rootScope.$new();
            $controller(CalendarChooser, {$scope: $scope, CalendarStore: CalendarStore});

            // init the google mock
            $rootScope.$digest();
		});

        it('should have an initial state ', function () {
            expect($scope.list).toEqual([]);
            expect($scope.calendar).toBeUndefined();
        });

        it('should notify for setting calendar ', function () {
            $scope.choose({id : 'id'});
            $rootScope.$digest();
            expect(CalendarStore.getCalendar()).toEqual('id');
        });

        it('should be notified on CalendarStore change', function () {
            $scope.$emit("dispatcher", constants.SET_CALENDAR, { calendar : 'calendar' });
            $rootScope.$digest();
            expect($scope.calendar).toEqual("calendar");
        });

    });


});