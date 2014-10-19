define([], function () {

    /**
     * Factory definition for the ExecutionContext service
     */
    return function($q) {

        /**
         * Execution context is create each time dispatcher run dispatch method
         * It store the complete execution stack
         *
         * The instance is pass to the callbacks so we can manipulate the execution
         * workflow
         *
         * @constructor
         */
        function ExecutionContext() {
            this.promises = [];
            this._ignore = false;
        }

        ExecutionContext.prototype.ignore = function() {
            this._ignore = true;
        }

        /**
         * Create the list of promise to execute from the callback register in  the dispatcher
         * {@see Dispatcher.register}
         *
         * @param callbacks
         * @param payload
         * @returns {Promise}
         */
        ExecutionContext.prototype.run = function (/* Array */ callbacks, /* object */ payload) {
            var self = this;
            callbacks.forEach(function (callback) {
                var promise = $q.when(callback(payload, self));
                if (! self._ignore) {
                    self.promises.push(promise);
                }
                self._ignore = false
            });
            return $q.all(self.promises)
        };

        /**
         * Create the list of promise to execute from the callback register with the
         * {@see Dispatcher.waitForError} method of the dispatcher
         *
         * @param recovers
         * @param payload
         * @returns {function}
         */
        ExecutionContext.prototype.recover = function (/* Array */recovers, /* object */ payload) {
            return function (reason) {
                var _recoverPromises = [];
                recovers.forEach(function (/* function */ callback) {
                    _recoverPromises.push($q.when(callback(payload, reason)));
                });
                if (_recoverPromises.length > 0) {
                    return $q.all(_recoverPromises)
                } else {
                    return $q.reject(reason)
                }
            }
        };

        /**
         * Allow to make a callback wait for the execution of another callback
         *
         *  // registering callback with an execution dependency
         *  var index1 = dispatcher.register(function() { return 1 });
         *  var index2 = dispatcher.register(function(payload , ec) {
         *      return ec.waitFor([index1]).then(function() { return 2 });
         *  });
         *
         * // on execution callback 1 is execute before callback 2
         * // if callback 1 is a promise that fail, callback2 is not executed
         * dispatcher.dispatch(true)
         *
         * @param promiseIndexes
         * @returns {Promise}
         */
        ExecutionContext.prototype.waitFor = function (/* Array */ promiseIndexes) {
            var self = this;
            var selectedPromises = [];
            promiseIndexes.forEach(function (index) {
                selectedPromises.push(self.promises[index]);
            });
            return $q.all(selectedPromises);
        };

        /**
         * this method return a promise
         * whatever the given parameter is a value or a promise
         * @param v
         * @returns {Promise}
         */
        ExecutionContext.prototype.when = function(value) {
            return $q.when(value)
        };

        /**
         * This method return a promise that always fail
         * @param value
         * @returns {*}
         */
        ExecutionContext.prototype.fail = function(value) {
            return $q.reject(value)
        };

        console.info("Loading ExecutionContext Service")

        return ExecutionContext
    };
});