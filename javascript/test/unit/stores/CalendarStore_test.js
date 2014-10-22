define(['services/Constants', 'app', 'test/mocks/GoogleMockForCalendar'], function(constants) {

    describe('CalendarStore service', function () {
        var google;
		var calendarStore;
        var $rootScope;

        // Load the module which contains the directive
		beforeEach(function() {

            var injector = angular.injector([
                'Roadmap.services', 'Roadmap.stores',
                'Google.mocks',
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