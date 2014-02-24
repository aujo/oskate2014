
// Presenter for medals per country
oskate(function(app) {

  var root = $("#countries-page"),
    tmpl = $("#countries-page-tmpl").html(),
	list_tmpl = $("#country-list-tmpl").html();
	//render result
	app.on("load:countries", function(results) {
	
       root.html($.render(tmpl, results));
	   var displaydata = $.map(results, function(data, i) {
         if (i % 2 == 0) 
			return {display: 'even', rank: data.rank, country: data.country, gold: data.gold, silver: data.silver, bronze: data.bronze};
		 else
			return {display: 'odd', rank: data.rank, country: data.country, gold: data.gold, silver: data.silver, bronze: data.bronze};
		});
       
       var list = $("#country-table", root);

       $.each(displaydata, function(i, el) {
          list.append($.render(list_tmpl, el));
       });

    });


});