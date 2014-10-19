define(['services/Google', 'app'], function(Google) {

    describe('ExecutionContext service', function () {

        var google;
        var $httpBackend;
        var $q;
        var $rootScope;

        // Load the module which contains the directive
        beforeEach(function () {
            var injector = angular.injector(['Roadmap.services', 'ng', 'ngMock']);
            $q = injector.get('$q');
            $rootScope = injector.get('$rootScope')
            $httpBackend = injector.get('$httpBackend');
            var auth = $q.when({access_token : "access_token", token_type : "bearer"});

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

        it('should have a failing events method when a calendar is  not defined', function () {
            var handlerCatch = jasmine.createSpy('catch');
            var handlerThen = jasmine.createSpy('then');
            google().events().then(handlerThen).catch(handlerCatch);
            $rootScope.$digest();
            expect(handlerCatch).toHaveBeenCalled();
            expect(handlerThen).not.toHaveBeenCalled();

        });

        it('should have a failing createEvent method  when a calendar is not defined', function () {
            var handlerCatch = jasmine.createSpy('catch');
            var handlerThen = jasmine.createSpy('then');
            google().createEvent({}).then(handlerThen).catch(handlerCatch);
            $rootScope.$digest();
            expect(handlerCatch).toHaveBeenCalled();
            expect(handlerThen).not.toHaveBeenCalled();
        });

        it('should have a failing deleteEvent method when a calendar is not defined', function () {
            var handlerCatch = jasmine.createSpy('catch');
            var handlerThen = jasmine.createSpy('then');
            google().deleteEvent("eventId").then(handlerThen).catch(handlerCatch);
            $rootScope.$digest();
            expect(handlerCatch).toHaveBeenCalled();
            expect(handlerThen).not.toHaveBeenCalled();
        });

        it('should have a failing updateEvent method when a calendar is not  defined', function () {
            var handlerCatch = jasmine.createSpy('catch');
            var handlerThen = jasmine.createSpy('then');
            google().updateEvent("eventId", {}).then(handlerThen).catch(handlerCatch);
            $rootScope.$digest();
            expect(handlerCatch).toHaveBeenCalled();
            expect(handlerThen).not.toHaveBeenCalled();
        });

        it('should have a calendarList method when a calendar is not defined', function () {
            $httpBackend.expect('GET', 'https://www.googleapis.com/calendar/v3/users/me/calendarList')
                .respond(200, 1);
            google().calendarList();
            $httpBackend.flush();
        });

    });


});