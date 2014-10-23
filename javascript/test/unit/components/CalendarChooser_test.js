define(['components/CalendarChooser', 'services/Constants', 'app'], function(CalendarChooser, constants) {

    describe('CalendarChooser component', function () {
        var $rootScope;
		var $scope;

		// Load the module which contains the directive
		beforeEach(function() {
            var injector = angular.injector(['Roadmap.services', 'Roadmap.stores',
                'Google.mocks','ng']);

            var $controller = injector.get('$controller');
            var CalendarStore = injector.get('CalendarStore');
            CalendarStore.clear();
            $rootScope = injector.get('$rootScope');
            $scope = $rootScope.$new();
            $controller(CalendarChooser, {$scope: $scope, CalendarStore: CalendarStore});

            // init the google mock
            $rootScope.$digest();
		});

        it('should have an initial state ', function () {
            expect($scope.list).toEqual(["A","B"]);
            expect($scope.calendar).toBeUndefined();

        });

        it('should notify for setting calendar ', function () {
            $scope.$emit("dispatcher", constants.SET_CALENDAR, { calendar : 'id' });
            $rootScope.$digest();
            expect($scope.list).toEqual(["A","B"]);
            expect($scope.calendar).toEqual('id');
        });





    });


});