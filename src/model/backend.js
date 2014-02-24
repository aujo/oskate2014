
// Fake backend to simulate a real thing
function Backend(conf) {

  var self = this,
    cache = {},
    debug = conf.debug && typeof console != 'undefined';

  // underlying implementation for `call` can change
  // method: init, load, etc
  // arg: page to view, i.e type of data to retreive
  // fn: callback function to perform when reading data is ready
  self.call = function(method, arg, fn) {

    var ret = data[method](arg),
       promise = new Promise(fn);

    // debug message
    if (debug) console.info("->", method, arg);

    // configurable caching for the "load" method
    if (conf.cache && method == 'load') {
      if (cache[arg]) return promise.done(cache[arg]);
      cache[arg] = ret;
    }

    // fake delay for the call
    setTimeout(function() {
      if (debug) console.info("<-", ret);

      promise.always(ret);
      promise[ret === false ? 'fail' : 'done'](ret);

    }, 400);

    // given callback
    promise.done(fn);

    return promise;

  };
}
