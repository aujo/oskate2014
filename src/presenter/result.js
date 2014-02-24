
// Presenter for results of one distance
oskate(function(app) {

  var root = $("#result-page"),
    tmpl = $("#result-page-tmpl").html(),
    list_tmpl = $("#result-list-tmpl").html();
    //render result
    app.on("load:result", function(results) {

	root.html($.render(tmpl, results));
       
	//display in table is based on even/odd of rownumber
	var displaydata = $.map(results, function(data, i) {
        if (i % 2 == 0) 
	   return {display: 'even', rank: data.rank, country: data.country, name: data.name, time: data.time, diff: data.diff};
	else
	   return {display: 'odd', rank: data.rank, country: data.country, name: data.name, time: data.time, diff: data.diff};
        });
	   // distances
       var list = $("#result-table", root);

        $.each(displaydata, function(i, el) {
          list.append($.render(list_tmpl, el));
        });
    });
  
});