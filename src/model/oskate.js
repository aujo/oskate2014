
// The admin API
function OSkate(conf) {

  var self = $.observable(this),
      backend = new Backend(conf);

  $.extend(self, conf);

  // load a given page from the server
  self.load = function(page, fn) {

    self.trigger("before:load", page);

    self.one("load", fn);

    backend.call("load", page, function(view) {
      self.trigger("load", view);
    });

  };

  // ... other API methods goes here

  // same as load("search")
  self.search = function(query, fn) {
    return backend.call("search", query, fn);
  };
  
  //I have moved the initilization of the view to a separate presenter
	
  // on each "page" load
  self.on("load", function(view) {
    self.trigger("load:" + view.type, view.data, view.path);
    self.page = view.type;
  });

}
