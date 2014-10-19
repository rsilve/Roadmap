define(['services/Google', 'app'], function(Google) {

    describe('ExecutionContext service', function () {

        var google;
        var $httpBackend;

        // Load the module which contains the directive
        beforeEach(function () {
            var injector = angular.injector(['Roadmap.services', 'ng', 'ngMock']);
            var $q = injector.get('$q');
            $httpBackend = injector.get('$httpBackend');
            var defer = $q.defer();
            defer.resolve({access_token : "access_token"});
            var auth = defer.promise;

            google = injector.invoke(Google, null, {auth: auth})
        });


        it('should have a events method when a calendar is defined', function () {
            $httpBackend.expect('GET', 'https://www.googleapis.com/calendar/v3/calendars/calendarId/events')
                .respond(200, 1);
            google("calendarId").events();
            $httpBackend.flush();
        });

        it('should have a createEvent method  when a calendar is defined', function () {
            $httpBackend.expect('POST', 'https://www.googleapis.com/calendar/v3/calendars/calendarId/events')
                .respond(200, 1);
            google("calendarId").createEvent({});
            $httpBackend.flush();
        });

        it('should have a deleteEvent method when a calendar is defined', function () {
            $httpBackend.expect('DELETE', 'https://www.googleapis.com/calendar/v3/calendars/calendarId/events/eventId')
                .respond(200, 1);
            google("calendarId").deleteEvent("eventId");
            $httpBackend.flush();
        });

        it('should have a updateEvent method when a calendar is defined', function () {
            $httpBackend.expect('PUT', 'https://www.googleapis.com/calendar/v3/calendars/calendarId/events/eventId')
                .respond(200, 1);
            google("calendarId").updateEvent("eventId", {});
            $httpBackend.flush();
        });

        it('should not have a calendarList method when a calendar is defined', function () {
            expect(google("calendarId").calendarList).toBeUndefined();

        });


    });


});