define(['services/Constants', 'app'], function(constants) {

    describe('CalendarStore service', function () {
        var google;
		var calendarStore;
        var $rootScope;

        // Load the module which contains the directive
		beforeEach(function() {

            // create a fake google service
            function GoogleProvider ($q) {
                console.info("Loading Google mock");
                var obj = {
                    calendarList : function() { return $q.when({items : ["A", "B"]}) }
                };
                return jasmine.createSpy("google").andReturn(obj);
            }
            // load it via an angular module
            angular.module('google.mocks', [])
                .provider('Google', function() { this.$get = ['$q', GoogleProvider] });

            var injector = angular.injector([
                'Roadmap.services', 'Roadmap.stores',
                'Roadmap.mocks', 'google.mocks',
                'ng', 'ngMock']);

            calendarStore = injector.get('CalendarStore');
            google = injector.get('Google');
            $rootScope = injector.get('$rootScope');
            $rootScope.$digest();
		});

        it('should call google at loading', function() {
           expect(google).toHaveBeenCalledWith()
        });

        it('should have a getCalendarList method', function () {
            expect(calendarStore.getCalendarList).toBeDefined();
            expect(calendarStore.getCalendarList()).toEqual(['A', 'B'])
        });


        it('should have a getCalendar method', function () {
            expect(calendarStore.getCalendar).toBeDefined()
        });

        it("could be notified to set working calendar", function() {
            $rootScope.$emit("dispatcher", constants.SET_CALENDAR, { calendar : 'id' })
            $rootScope.$digest();
            expect(calendarStore.getCalendar()).toEqual("id")
        });

        it("could be notified to unset working calendar", function() {
            $rootScope.$emit("dispatcher", constants.RESET_CALENDAR)
            $rootScope.$digest();
            expect(calendarStore.getCalendar()).toBeUndefined()
        });



    });


});