
/*
  Handle view switching, aka. "routing"
  The transition effect is done with CSS
*/
oskate(function(app) {
  
  var klass = "is-active";

  // 1. select elements from the page to call $.route(path)
  app.root.on("click", "[href^='#/']", function(e) {

    e.preventDefault();

    var link = $(this);

    // no action
    if (link.hasClass(klass)) return;

    // loading indicator
    link.addClass("is-loading");

    // Riot changes the URL, notifies listeners and takes care of the back button
    $.route(link.attr("href"));

  });

  // 2. listen to route clicks and back button
  $.route(function(path) {

    // Call API method to load stuff from server
	//for medals per country per distance we need two datastructures
	//hence two calls to the server
    var data = path.slice(2);
	var arg = path.split('/');
	if (data == 'medals') {
	   app.load('medals_f');
	   app.load('medals_m');
	}
	else {
	   if (arg[1] == 'country') {
	      app.load('medals_country_f/'+arg[2]);
	      app.load('medals_country_m/'+arg[2]);
       }
	   else app.load(data);
	}

  });

  // 3. Set "is-active" class name for the active page
  app.on("before:load", function() {

    // remove existing class
    $("." + klass).removeClass(klass);

  }).on("load", function(view) {

    //a somewhat ugly hack to account for the _m and _f page calls
    var type= view.type.split('_')[0];
    //but then again, the transition effect is depending on
    //having a div with a -page name (and a nav) that corresponds to the load -call (i.e. load("result") en div id="result-page")	
    // set a new class
    $("#" + type + "-page").add("#" + type + "-nav").addClass(klass);

    // remove loading indicator
    $("nav .is-loading").removeClass("is-loading");

  });

});

