define(['components/planning/Timebar', 'services/Constants', 'moment',  'app'], function(Timebar, constants, moment) {

    describe('Timebar component', function () {
        var $rootScope;
		var $scope;
        var TimeStore;

		// Load the module which contains the directive
		beforeEach(function() {
			var injector = angular.injector(['Roadmap.services', 'Roadmap.stores', 'ng']);
            var $controller = injector.get('$controller');
            TimeStore = injector.get('TimeStore');
            $rootScope = injector.get('$rootScope');
            $scope = $rootScope.$new();
            $controller(Timebar, {$scope: $scope, TimeStore: TimeStore});
		});


        it('should have an initial state ', function () {
            expect($scope.start.toString()).toBe(moment().startOf('year').toString());
            for (var i = 0; i < 24; i ++) {
                var d = $scope.start.clone().add(i, 'months').startOf('months');
                expect($scope.months[i].date.toString).toEqual(d.toString);
            }
        });

        it('should update on TimeStore change to months scale', function () {
            $rootScope.$emit("dispatcher", constants.TIME_MONTHS);
            $rootScope.$digest();
            expect($scope.start.toString()).toBe(moment().startOf('year').toString());
            for (var i = 0; i < 24; i ++) {
                var d = $scope.start.clone().add(i, 'months').startOf('months');
                expect($scope.months[i].date.toString).toEqual(d.toString);
            }
        });

        it('should update on TimeStore change to weeks scale', function () {
            $rootScope.$emit("dispatcher", constants.TIME_WEEKS);
            $rootScope.$digest();
            expect($scope.start.toString()).toBe(moment().startOf('year').toString());
            for (var i = 0; i < 24; i ++) {
                var d = $scope.start.clone().add(i, 'weeks').startOf('weeks');
                expect($scope.months[i].date.toString).toEqual(d.toString);
            }
        });

        it('should update on TimeStore change to weeks scale', function () {
            $rootScope.$emit("dispatcher", constants.TIME_DAYS);
            $rootScope.$digest();
            expect($scope.start.toString()).toBe(moment().startOf('year').toString());
            for (var i = 0; i < 24; i ++) {
                var d = $scope.start.clone().add(i, 'days').startOf('days');
                expect($scope.months[i].date.toString).toEqual(d.toString);
            }
        });

        it('should update on TimeStore change to next period', function () {
            $rootScope.$emit("dispatcher", constants.TIME_NEXT_PERIOD);
            $rootScope.$digest();
            expect($scope.start.toString()).toBe(moment().startOf('year').add(3, 'months').toString());
            for (var i = 0; i < 24; i ++) {
                var d = $scope.start.clone().add(i, 'days').startOf('days');
                expect($scope.months[i].date.toString).toEqual(d.toString);
            }
        });

        it('should update on TimeStore change to next period', function () {
            $rootScope.$emit("dispatcher", constants.TIME_PREV_PERIOD);
            $rootScope.$digest();
            expect($scope.start.toString()).toBe(moment().startOf('year').subtract(3, 'months').toString());
            for (var i = 0; i < 24; i ++) {
                var d = $scope.start.clone().add(i, 'days').startOf('days');
                expect($scope.months[i].date.toString).toEqual(d.toString);
            }
        });


        it('could notify timestore to change to next period', function () {
            $scope.nextQuarter();
            $rootScope.$digest();
            expect($scope.start.toString()).toBe(moment().startOf('year').add(3, 'months').toString());
            for (var i = 0; i < 24; i ++) {
                var d = $scope.start.clone().add(i, 'days').startOf('days');
                expect($scope.months[i].date.toString).toEqual(d.toString);
            }
        });

        it('could notify timestore to change to previous period', function () {
            $scope.previousQuarter();
            $rootScope.$digest();
            expect($scope.start.toString()).toBe(moment().startOf('year').subtract(3, 'months').toString());
            for (var i = 0; i < 24; i ++) {
                var d = $scope.start.clone().add(i, 'days').startOf('days');
                expect($scope.months[i].date.toString).toEqual(d.toString);
            }
        });




    });


});