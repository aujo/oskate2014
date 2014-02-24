
// Presenter for medals per distance
oskate(function(app) {

  var root_wm = $("#women"),
    root_m = $("#men"),
	tmpl = $("#medals-page-tmpl").html(),
	list_tmpl = $("#medal-list-tmpl").html();
	//render result
	app.on("load:medals_f", function(results) {

	   //template contains one placeholder: {gender}
       root_wm.html($.render(tmpl, {gender: 'Women medals per distance'}));
       
	   var displaydata = $.map(results, function(data, i) {
         if (i % 2 == 0) 
			return {display: 'even', name: data.name, gold: data.gold, silver: data.silver, bronze: data.bronze};
		 else
			return {display: 'odd', name: data.name, gold: data.gold, silver: data.silver, bronze: data.bronze};
		});
       var list = $("#medal-table", root_wm);

       $.each(displaydata, function(i, el) {
          list.append($.render(list_tmpl, el));
       });
    });
	app.on("load:medals_country_f", function(results) {

	   //template contains one placeholder: {gender}
       root_wm.html($.render(tmpl, {gender: 'Womens medals per distance'}));
       
	   var displaydata = $.map(results, function(data, i) {
         if (i % 2 == 0) 
			return {display: 'even', name: data.name, gold: data.gold, silver: data.silver, bronze: data.bronze};
		 else
			return {display: 'odd', name: data.name, gold: data.gold, silver: data.silver, bronze: data.bronze};
		});
       var list = $("#medal-table", root_wm);

       $.each(displaydata, function(i, el) {
          list.append($.render(list_tmpl, el));
       });
    });
	app.on("load:medals_m", function(results) {

	   root_m.html($.render(tmpl, {gender: 'Men medals per distance'}));
       
	   var displaydata = $.map(results, function(data, i) {
         if (i % 2 == 0) 
			return {display: 'even', name: data.name, gold: data.gold, silver: data.silver, bronze: data.bronze};
		 else
			return {display: 'odd', name: data.name, gold: data.gold, silver: data.silver, bronze: data.bronze};
		});
       var list = $("#medal-table", root_m);

       $.each(displaydata, function(i, el) {
          list.append($.render(list_tmpl, el));
       });
    });
	app.on("load:medals_country_m", function(results) {

	   //template contains one placeholder: {gender}
       root_m.html($.render(tmpl, {gender: 'Men medals per distance'}));
       
	   var displaydata = $.map(results, function(data, i) {
         if (i % 2 == 0) 
			return {display: 'even', name: data.name, gold: data.gold, silver: data.silver, bronze: data.bronze};
		 else
			return {display: 'odd', name: data.name, gold: data.gold, silver: data.silver, bronze: data.bronze};
		});
       var list = $("#medal-table", root_m);

       $.each(displaydata, function(i, el) {
          list.append($.render(list_tmpl, el));
       });
    });
  
});