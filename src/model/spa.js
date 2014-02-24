
// The ability to split your single-page application (SPA) into loosely-coupled modules

var instance;

top.oskate = $.observable(function(arg) {

  // oskate() --> return instance
  if (!arg) return instance;

  // oskate(fn) --> add a new module
  if ($.isFunction(arg)) {
    top.oskate.on("ready", arg);

  // oskate(conf) --> initialize the application
  } else {

    instance = new OSkate(arg);

    instance.on("ready", function() {
      top.oskate.trigger("ready", instance);
    });

    instance.trigger("ready");

  }

});

