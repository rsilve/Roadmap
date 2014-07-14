var dispatcher = require("../javascript/react/dispatcher/AppDispatcher")

exports.tests = {
    setUp: function (done) {
        dispatcher.clearAll(); // important : dispatcher is a singleton !!
        done();
    },
    handleViewAction : function(test) {
        test.expect(2);
        dispatcher.register(function(p) {
            return dispatcher.noop(p)
        });
        dispatcher.handleViewAction({name : "test"}).then(function(v){
            test.equal(1, v.length, 'dispatch send payload');
            test.equal("test", v[0].name)
        }).finally(function() {
            test.done();
        })

    },

    registerCallbacks : function(test) {
        test.expect(1);
        var callbacks = {
            action1 : function() {
                return dispatcher.noop(1);
            }
        };
        dispatcher.registerCallbacks(callbacks);
        dispatcher.handleViewAction({actionType :"action1"}).then(function(v){
            test.equal(1, v, 'registerCallbacks should register actions');
        }).finally(function() {
            test.done();
        })

    }


};