define(['app', 'test/mocks/GoogleAuthMock'], function() {

    describe('Google service', function () {

        var google;
        var $httpBackend;
        var $rootScope;
        var auth;

        // Load the module which contains the directive
        beforeEach(function () {
            var injector = angular.injector(['ng', 'ngMock', 'Roadmap.services', 'GoogleAuth.mocks']);
            $rootScope = injector.get('$rootScope');
            $httpBackend = injector.get('$httpBackend');

            auth = injector.get("GoogleAuth");
            google = injector.get("Google");
        });


        it('should have a events method when a calendar is defined', function () {
            var handlerCatch = jasmine.createSpy('catch');
            var handlerThen = jasmine.createSpy('then');
            $httpBackend.expect('GET', 'https://www.googleapis.com/calendar/v3/calendars/calendarId/events')
                .respond(200, 1);
            google("calendarId").events().then(handlerThen).catch(handlerCatch);
            auth().resolve();
            $httpBackend.flush();
            $rootScope.$digest();
            expect(handlerCatch).not.toHaveBeenCalled();
            expect(handlerThen).toHaveBeenCalled();
        });

        it('should have a createEvent method  when a calendar is defined', function () {
            var handlerCatch = jasmine.createSpy('catch');
            var handlerThen = jasmine.createSpy('then');
            $httpBackend.expect('POST', 'https://www.googleapis.com/calendar/v3/calendars/calendarId/events')
                .respond(500, 1);
            google("calendarId").createEvent({}).then(handlerThen).catch(handlerCatch);
            auth().resolve();
            $rootScope.$digest();
            $httpBackend.flush();
            expect(handlerCatch).toHaveBeenCalled();
            expect(handlerThen).not.toHaveBeenCalled();
        });

        it('should have a createEvent method  when a calendar is defined that failed if the status is not 200', function () {
            var handlerCatch = jasmine.createSpy('catch');
            var handlerThen = jasmine.createSpy('then');
            $httpBackend.expect('POST', 'https://www.googleapis.com/calendar/v3/calendars/calendarId/events')
                .respond(200, 1);
            google("calendarId").createEvent({}).then(handlerThen).catch(handlerCatch);
            auth().resolve();
            $rootScope.$digest();
            $httpBackend.flush();
            expect(handlerCatch).not.toHaveBeenCalled();
            expect(handlerThen).toHaveBeenCalled();
        });

        it('should have a createEvent method  when a calendar is defined that failed if the auth is invalid', function () {
            var handlerCatch = jasmine.createSpy('catch');
            var handlerThen = jasmine.createSpy('then');
            google("calendarId").createEvent({}).then(handlerThen).catch(handlerCatch);
            auth().reject();
            $rootScope.$digest();
            expect(handlerCatch).toHaveBeenCalled();
            expect(handlerThen).not.toHaveBeenCalled();
        });

        it('should have a deleteEvent method when a calendar is defined', function () {
            var handlerCatch = jasmine.createSpy('catch');
            var handlerThen = jasmine.createSpy('then');
            $httpBackend.expect('DELETE', 'https://www.googleapis.com/calendar/v3/calendars/calendarId/events/eventId')
                .respond(200, 1);
            google("calendarId").deleteEvent("eventId").then(handlerThen).catch(handlerCatch);
            auth().resolve();
            $rootScope.$digest();
            $httpBackend.flush();
            expect(handlerCatch).not.toHaveBeenCalled();
            expect(handlerThen).toHaveBeenCalled();
        });

        it('should have a updateEvent method when a calendar is defined', function () {
            var handlerCatch = jasmine.createSpy('catch');
            var handlerThen = jasmine.createSpy('then');
            $httpBackend.expect('PUT', 'https://www.googleapis.com/calendar/v3/calendars/calendarId/events/eventId')
                .respond(200, 1);
            google("calendarId").updateEvent("eventId", {}).then(handlerThen).catch(handlerCatch);
            auth().resolve();
            $rootScope.$digest();
            $httpBackend.flush();
            expect(handlerCatch).not.toHaveBeenCalled();
            expect(handlerThen).toHaveBeenCalled();
        });

        it('should not have a calendarList method when a calendar is defined', function () {
            expect(google("calendarId").calendarList).toBeUndefined();

        });

        it('should have a failing events method when a calendar is  not defined', function () {
            var handlerCatch = jasmine.createSpy('catch');
            var handlerThen = jasmine.createSpy('then');
            google().events().then(handlerThen).catch(handlerCatch);
            auth().resolve();
            $rootScope.$digest();
            expect(handlerCatch).toHaveBeenCalled();
            expect(handlerThen).not.toHaveBeenCalled();

        });

        it('should have a failing createEvent method  when a calendar is not defined', function () {
            var handlerCatch = jasmine.createSpy('catch');
            var handlerThen = jasmine.createSpy('then');
            google().createEvent({}).then(handlerThen).catch(handlerCatch);
            auth().resolve();
            $rootScope.$digest();
            expect(handlerCatch).toHaveBeenCalled();
            expect(handlerThen).not.toHaveBeenCalled();
        });

        it('should have a failing deleteEvent method when a calendar is not defined', function () {
            var handlerCatch = jasmine.createSpy('catch');
            var handlerThen = jasmine.createSpy('then');
            google().deleteEvent("eventId").then(handlerThen).catch(handlerCatch);
            auth().resolve();
            $rootScope.$digest();
            expect(handlerCatch).toHaveBeenCalled();
            expect(handlerThen).not.toHaveBeenCalled();
        });

        it('should have a failing updateEvent method when a calendar is not  defined', function () {
            var handlerCatch = jasmine.createSpy('catch');
            var handlerThen = jasmine.createSpy('then');
            google().updateEvent("eventId", {}).then(handlerThen).catch(handlerCatch);
            auth().resolve();
            $rootScope.$digest();
            expect(handlerCatch).toHaveBeenCalled();
            expect(handlerThen).not.toHaveBeenCalled();
        });

        it('should have a calendarList method when a calendar is not defined', function () {
            $httpBackend.expect('GET', 'https://www.googleapis.com/calendar/v3/users/me/calendarList')
                .respond(200, 1);
            google().calendarList();
            auth().resolve();
            $httpBackend.flush();
        });

    });


});