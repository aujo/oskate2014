
// Presenter for initial load, i.e
// this presenter determines what the
// webapp shows initially

oskate(function(app) {

  var root = $("#menuleft"),
    tmpl = $("#leftMenu-tmpl").html(),
    dist_tmpl = $("#dist-link-tmpl").html(),
    root_mr = $("#menuright"),
    tmpl_mr = $("#rightMenu-tmpl").html()

    app.load(app.page||"home");
	
    //load leftMenu;
    app.load("distances_f");
    //load rightMenu;
    app.load("distances_m");
	
    //render leftMenu
    app.on("load:distances_f", function(data) {

       root.html(riot.render(tmpl, data));
       // distances
       var list = $("#dist-list ul", root);

       $.each(data, function(i, el) {
           list.append(riot.render(dist_tmpl, el));
       });
    });
    
    //render rightmenu
    app.on("load:distances_m", function(data) {

       root_mr.html(riot.render(tmpl_mr, data));
       // distances
       var list = $("#dist-list-right ul", root_mr);

       $.each(data, function(i, el) {
          list.append(riot.render(dist_tmpl, el));
       });
    });
});