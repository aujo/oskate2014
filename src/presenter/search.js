
// Search dropdown
oskate(function(app) {

  var form = $("#search"),
      tmpl = $("#result-tmpl").html(),
      results = $("#results");

  form.submit(function(e) {

    e.preventDefault();

    var form = $(this),
        val = $.trim(this.q.value);

    if (!val) return;

    form.addClass("is-loading");

    app.search(val, function(arr) {
      form.removeClass("is-loading");
      results.empty().show();
      results.append($.render(tmpl, arr));

    });

    $(document).one("click keypress", function() {
      results.hide();
    });

  });

});