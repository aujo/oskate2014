/* Riot 1.0.4, @license MIT, (c) 2014 Muut Inc + contributors */
(function(riot) { "use strict";

riot.observable = function(el) {
  var callbacks = {}, slice = [].slice;

  el.on = function(events, fn) {
    if (typeof fn === "function") {
      events.replace(/\S+/g, function(name, pos) {
        (callbacks[name] = callbacks[name] || []).push(fn);
        fn.typed = pos > 0;
      });
    }
    return el;
  };

  el.off = function(events, fn) {
    if (events === "*") callbacks = {};
    else if (fn) {
      var arr = callbacks[events];
      for (var i = 0, cb; (cb = arr && arr[i]); ++i) {
        if (cb === fn) { arr.splice(i, 1); i--; }
      }
    } else {
      events.replace(/\S+/g, function(name) {
        callbacks[name] = [];
      });
    }
    return el;
  };

  // only single event supported
  el.one = function(name, fn) {
    if (fn) fn.one = true;
    return el.on(name, fn);
  };

  el.trigger = function(name) {
    var args = slice.call(arguments, 1),
      fns = callbacks[name] || [];

    for (var i = 0, fn; (fn = fns[i]); ++i) {
      if (!fn.busy) {
        fn.busy = true;
        fn.apply(el, fn.typed ? [name].concat(args) : args);
        if (fn.one) { fns.splice(i, 1); i--; }
        fn.busy = false;
      }
    }

    return el;
  };

  return el;

};
var FN = {}, // Precompiled templates (JavaScript functions)
  template_escape = {"\\": "\\\\", "\n": "\\n", "\r": "\\r", "'": "\\'"},
  render_escape = {'&': '&amp;', '"': '&quot;', '<': '&lt;', '>': '&gt;'};

function default_escape_fn(str, key) {
  return str == null ? '' : (str+'').replace(/[&\"<>]/g, function(char) {
    return render_escape[char];
  });
}

riot.render = function(tmpl, data, escape_fn) {
  if (escape_fn === true) escape_fn = default_escape_fn;
  tmpl = tmpl || '';

  return (FN[tmpl] = FN[tmpl] || new Function("_", "e", "return '" +
    tmpl.replace(/[\\\n\r']/g, function(char) {
      return template_escape[char];
    }).replace(/{\s*([\w\.]+)\s*}/g, "' + (e?e(_.$1,'$1'):_.$1||(_.$1==null?'':_.$1)) + '") + "'")
  )(data, escape_fn);
};
/* Cross browser popstate */
(function () {
  // for browsers only
  if (typeof window === "undefined") return;

  var currentHash,
    pops = riot.observable({}),
    listen = window.addEventListener,
    doc = document;

  function pop(hash) {
    hash = hash.type ? location.hash : hash;
    if (hash !== currentHash) pops.trigger("pop", hash);
    currentHash = hash;
  }

  /* Always fire pop event upon page load (normalize behaviour across browsers) */

  // standard browsers
  if (listen) {
    listen("popstate", pop, false);
    doc.addEventListener("DOMContentLoaded", pop, false);

  // IE
  } else {
    doc.attachEvent("onreadystatechange", function() {
      if (doc.readyState === "complete") pop("");
    });
  }

  /* Change the browser URL or listen to changes on the URL */
  riot.route = function(to) {
    // listen
    if (typeof to === "function") return pops.on("pop", to);

    // fire
    if (history.pushState) history.pushState(0, 0, to);
    pop(to);

  };
})();
if (typeof exports === 'object') {
  // CommonJS support
  module.exports = riot;
} else if (typeof define === 'function' && define.amd) {
  // support AMD
  define(function() { return riot; });
} else {
  // support browser
  window.riot = riot;
}

})({});
;(function(top) {
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


/*jshint multistr:true */

// Fake server responses (aka. "fixtures"), but with real data
var distances_f = $.map([
  '500m',
  '1000m',
  '1500m',
  '3000m',
  '5000m',
  'Team Pursuit'
], function(name, i) {
  return { name: name, id: i};

});

var distances_m = $.map([
  '500m',
  '1000m',
  '1500m',
  '5000m',
  '10000m',
  'Team Pursuit'
], function(name, i) {
  return { name: name, id: i + 6};

});

var result_f500m = $.map([ //result 0
    ['1','KOR','LEE Sang Hwa',			'74.70' ], 	
    ['2','RUS','Olga FATKULINA',		'75.06' ,'+0.36'],
    ['3','NED','Margot BOER',			'75.48' ,'+0.78'],
    ['4','CHN','ZHANG Hong',			'75.58' ,'+0.88'],
    ['5','JPN','Nao KODAIRA',			'75.61' ,'+0.91'],
    ['6','GER','Jenny WOLF',			'75.67' ,'+0.97'],
    ['7','CHN','WANG Beixing',			'75.68' ,'+0.98'],
    ['8','USA','Heather RICHARDSON',	'75.75' ,'+1.05'],
    ['9','JPN','Maki TSUJI',			'76.84 ','+2.14'],
    ['10','CZE','Karolina ERBANOVA',	'76.86 ','+2.16'],
    ['11','NED','Laurine van RIESSEN',	'76.99' ,'+2.29'],
    ['12','CAN','Christine NESBITT',	'77.15 ','+2.45'],
    ['13','USA','Brittany BOWE',		'77.19 ','+2.49'],
    ['14','JPN','Miyako SUMIYOSHI',		'77.36 ','+2.56'],
    ['15','USA','Lauren CHOLEWINSKI',	'77.35 ','+2.65'],
    ['16','NED','Lotte van BEEK',		'77.40 ','+2.70'],
    ['17','RUS','Yekaterina MALYSHEVA',	'77.55 ','+2.85'],
    ['18','RUS','Angelina GOLIKOVA',	'77.68 ','+2.98'],
    ['19','NED','Marrit LEENSTRA',		'77.74 ','+3.04'],
    ['20','KOR','LEE Bo Ra',			'77.75 ','+3.05'],
    ['21','GER','Denise ROTH',			'77.78 ','+3.08'],
    ['22','KAZ','Yekaterina AYDOVA',	'77.85 ','+3.15'],
    ['23','CHN','QI Shuai',				'77.89 ','+3.19'],
    ['24','KOR','KIM Hyun Yung',		'78.23 ','+3.53'],
    ['25','RUS','Yekaterina LOBYSHEVA',	'78.24 ','+3.54'],
    ['26','KOR','PARK Seung Ju',		'78.31 ','+3.61'],
    ['27','AUT','Vanessa BITTNER',		'78.50 ','+3.80'],
    ['28','CAN','Anastasia BUCSIS',		'78.52 ','+3.82'],
    ['29','USA','Sugar TODD',			'78.53 ','+3.83'],
    ['30','ITA','Yvonne DALDOSSI',		'78.64 ','+3.94'],
    ['31','CHN','ZHANG Shuang',			'78.65 ','+3.95'],
    ['32','CAN','Marsha HUDEY',			'79.22 ','+4.52'],
    ['33','CAN','Danielle WOTHERSPOON',	'79.32 ','+4.62'],
    ['34','GER','Gabriele HIRSCHBICHLER','79.51)','+4.81']
  ], function(row, i) {
         return {rank: row[0], country: row[1], name: row[2], time: row[3], diff: row[4]};
});

var result_f1000m = $.map([ //result 1
    ['1 ','CHN','ZHANG Hong'  				 	,'1:14.02'], 	
    ['2 ','NED','Ireen WUST'  				 	,'1:14.69', 	'+0.67'],
    ['3 ','NED','Margot BOER'  				 	,'1:14.90', 	'+0.88'],
    ['4 ','RUS','Olga FATKULINA'  			 	,'1:15.08', 	'+1.06'],
    ['5 ','NED','Lotte van BEEK'  			 	,'1:15.10', 	'+1.08'],
    ['6 ','NED','Marrit LEENSTRA'  			 	,'1:15.15', 	'+1.13'],
    ['7 ','USA','Heather RICHARDSON'  		 	,'1:15.23', 	'+1.21'],
    ['8 ','USA','Brittany BOWE'  				,'1:15.47', 	'+1.45'],
    ['9 ','CAN','Christine NESBITT'  		 	,'1:15.62', 	'+1.60'],
    ['10','CZE','Karolina ERBANOVA'  		 	,'1:15.74', 	'+1.72'],
    ['11','GER','Judith HESSE'  			 	,'1:15.84', 	'+1.82'],
    ['12','KOR','LEE Sang Hwa'  			 	,'1:15.94', 	'+1.92'],
    ['13','JPN','Nao KODAIRA'  				 	,'1:16.45', 	'+2.43'],
    ['14','CHN','WANG Beixing'  			 	,'1:16.59', 	'+2.57'],
    ['15','RUS','Yekaterina SHIKHOVA' 		 	,'1:17.01', 	'+2.99'],
    ['16','RUS','Yuliya SKOKOVA'  			 	,'1:17.02', 	'+3.00'],
    ['17','NOR','Ida NJAATUN'  				 	,'1:17.15', 	'+3.13'],
    ['18','CAN','Kaylin IRVINE'  			 	,'1:17.24', 	'+3.22'],
    ['19','KAZ','Yekaterina AYDOVA'  		 	,'1:17.25', 	'+3.23'],
    ['20','RUS','Yekaterina LOBYSHEVA'  	 	,'1:17.31', 	'+3.29'],
    ['21','CAN','Kali CHRIST'  				 	,'1:17.41', 	'+3.39'],
    ['22','JPN','Miyako SUMIYOSHI'  		 	,'1:17.68', 	'+3.66'],
    ['23','POL','Natalia CZERWONKA'  		 	,'1:17.933', 	'+3.91'],
    ['24','AUT','Vanessa BITTNER'  			 	,'1:17.937', 	'+3.91'],
    ['25','GER','Jenny WOLF'  				 	,'1:17.99', 	'+3.97'],
    ['26','GER','Gabriele HIRSCHBICHLER'  	 	,'1:18.00', 	'+3.98'],
    ['27','JPN','Maki TSUJI'  				 	,'1:18.07', 	'+4.05'],
    ['28','KOR','KIM Hyun Yung'  			 	,'1:18.10', 	'+4.08'],
    ['29','POL','Luiza ZLOTKOWSKA'  		 	,'1:18.38', 	'+4.36'],
    ['30','CAN','Brittany SCHUSSLER'  		 	,'1:18.53', 	'+4.51'],
    ['31','KOR','PARK Seung Ju'  			 	,'1:18.94', 	'+4.92'],
    ['32','USA','Sugar TODD'  				 	,'1:19.13', 	'+5.11'],
    ['33','USA','Kelly GUNTHER'  			 	,'1:19.43', 	'+5.41'],
    ['34','CHN','LI Dan'  					 	,'1:20.20', 	'+6.18'],
    ['35','KOR','LEE Bo Ra'  				 	,'1:57.49', 	'+43.47'],
    [''	 ,'GER','Monique ANGERMUELLER'  	 	,'DQ'] 	
], function(row, i) {
         return {rank: row[0], country: row[1], name: row[2], time: row[3], diff: row[4]};
});

var result_f1500m = $.map([ //result 2
    ['1 ','NED','Jorien ter MORS'  			 	,'1:53.51'], 	
    ['2 ','NED','Ireen WUST'  				 	,'1:54.09', 	'+0.58'],
    ['3 ','NED','Lotte van BEEK'  			 	,'1:54.54', 	'+1.03'],
    ['4 ','NED','Marrit LEENSTRA'  			 	,'1:56.40', 	'+2.89'],
    ['5 ','RUS','Yuliya SKOKOVA'  			 	,'1:56.45', 	'+2.94'],
    ['6 ','POL','Katarzyna BACHLEDA - CURUS'   	,'1:57.18', 	'+3.67'],
    ['7 ','USA','Heather RICHARDSON'   		 	,'1:57.60', 	'+4.09'],
    ['8 ','RUS','Yekaterina LOBYSHEVA'  	 	,'1:57.70', 	'+4.19'],
    ['9 ','RUS','Olga FATKULINA' 			 	,'1:57.88', 	'+4.37'],
    ['10','RUS','Yekaterina SHIKHOVA'  		 	,'1:58.09', 	'+4.58'],
    ['11','POL','Luiza ZLOTKOWSKA'  		 	,'1:58.18', 	'+4.67'],
    ['12','NOR','Ida NJAATUN'  				 	,'1:58.21', 	'+4.70'],
    ['13','CZE','Karolina ERBANOVA'  		 	,'1:58.23', 	'+4.72'],
    ['14','USA','Brittany BOWE'  			 	,'1:58.31', 	'+4.80'],
    ['15','POL','Natalia CZERWONKA'  		 	,'1:58.46', 	'+4.95'],
    ['16','CAN','Kali CHRIST'  				 	,'1:58.63', 	'+5.12'],
    ['17','CAN','Christine NESBITT'  		 	,'1:58.67', 	'+5.16'],
    ['18','USA','Jilleanne ROOKARD'  		 	,'1:59.15', 	'+5.64'],
    ['19','GER','Claudia PECHSTEIN'  		 	,'1:59.47', 	'+5.96'],
    ['20','BEL','Jelena PEETERS'  			 	,'1:59.73', 	'+6.22'],
    ['21','KOR','KIM Bo Reum'  				 	,'1:59.78', 	'+6.27'],
    ['22','JPN','Misaki OSHIGIRI'  			 	,'2:00.03', 	'+6.52'],
    ['23','CHN','ZHAO Xin'  				 	,'2:00.27', 	'+6.76'],
    ['24','GER','Monique ANGERMUELLER'  	 	,'2:00.32', 	'+6.81'],
    ['25','JPN','Maki TABATA'  				 	,'2:00.64', 	'+7.13'],
    ['26','CAN','Brittany SCHUSSLER'  		 	,'2:00.65', 	'+7.14'],
    ['27','CHN','LI Qishi'  				 	,'2:00.89', 	'+7.38'],
    ['28','KAZ','Yekaterina AYDOVA'  		 	,'2:00.93', 	'+7.42'],
    ['29','KOR','NOH Seon Yeong'  			 	,'2:01.07', 	'+7.56'],
    ['30','GER','Gabriele HIRSCHBICHLER'  	 	,'2:01.18', 	'+7.67'],
    ['31','JPN','Ayaka KIKUCHI'  				,'2:01.29', 	'+7.78'],
    ['32','JPN','Nana TAKAGI'  				 	,'2:02.16', 	'+8.65'],
    ['33','NOR','Hege BOKKO'  				 	,'2:02.53', 	'+9.02'],
    ['34','AUT','Vanessa BITTNER'  			 	,'2:02.84', 	'+9.33'],
    ['35','CAN','Brianne TUTT'  			 	,'2:03.69', 	'+10.18'],
    ['36','KOR','YANG Shin Young'  			 	,'2:04.13', 	'+10.62']
], function(row, i) {
         return {rank: row[0], country: row[1], name: row[2], time: row[3], diff: row[4]};
}); 

var result_f3000m = $.map([ //result 3
    ['1 ','NED','Irene WUST'   					,'4:00.34'], 	
    ['2 ','CZE','Martina SABLIKOVA'   		  	,'4:01.95', 	'+1.61 '],
    ['3 ','RUS','Olga GRAF'  				  	,'4:03.47', 	'+3.13 '],
    ['4 ','GER','Claudia PECHSTEIN'  		  	,'4:05.26', 	'+4.92 '],
    ['5 ','NED','Annouk van der WEIJDEN'	  	,'4:05.75', 	'+5.41 '],
    ['6 ','NOR','Ida NJAATUN'  				  	,'4:06.73', 	'+6.39 '],
    ['7 ','NED','Antoinette de JONG'  		  	,'4:06.77', 	'+6.43 '],
    ['8 ','RUS','Yuliya SKOKOVA'  			  	,'4:09.36', 	'+9.02 '],
    ['9 ','JPN','Shiho ISHIZAWA'  			  	,'4:09.39', 	'+9.05 '],
    ['10','USA','Jilleanne ROOKARD'  		  	,'4:10.02', 	'+9.68 '],
    ['11','GER','Bente KRAUS'  				  	,'4:10.17', 	'+9.83 '],
    ['12','BEL','Jelena PEETERS'  			  	,'4:10.87', 	'+10.53'],
    ['13','KOR','KIM Bo Reum'  				  	,'4:12.08', 	'+11.74'],
    ['14','NOR','Mari HEMMER'  				  	,'4:12.21', 	'+11.87'],
    ['15','JPN','Shoko FUJIMURA'  			  	,'4:12.71', 	'+12.37'],
    ['16','POL','Natalia CZERWONKA'  		  	,'4:13.26', 	'+12.92'],
    ['17','GER','Stephanie BECKERT'  		  	,'4:13.55', 	'+13.21'],
    ['18','POL','Luiza ZLOTKOWSKA'  		  	,'4:14.19', 	'+13.85'],
    ['19','CAN','Brittany SCHUSSLER'  		  	,'4:14.65', 	'+14.31'],
    ['20','RUS','Yekaterina SHIKHOVA'  		  	,'4:14.97', 	'+14.63'],
    ['21','JPN','Masako HOZUMI'  			  	,'4:15.52', 	'+15.18'],
    ['22','AUT','Anna ROKITA'  				  	,'4:16.43', 	'+16.09'],
    ['23','ITA','Francesca LOLLOBRIGIDA'  	  	,'4:16.52', 	'+16.18'],
    ['24','CAN','Ivanie BLONDIN'  			  	,'4:18.70', 	'+18.36'],
    ['25','KOR','NOH Seon Yeong'  			  	,'4:19.02', 	'+18.68'],
    ['26','USA','Anna RINGSRED'  			  	,'4:21.51', 	'+21.17'],
    ['27','KOR','YANG Shin Young'  			  	,'4:23.67', 	'+23.33'],
    ['	','POL','Katarzyna BACHLEDA - CURUS'   	,'DQ']
], function(row, i) {                                 
         return {rank: row[0], country: row[1], name: row[2], time: row[3], diff: row[4]};
});

var result_f5000m = $.map([ //result 4
    ['1 ','CZE','Martina SABLIKOVA'   	,'6:51.54'], 	
    ['2 ','NED','Ireen WUST'  			,'6:54.28', 	'+2.74 '],
    ['3 ','NED','Carien KLEIBEUKER'   	,'6:55.66', 	'+4.12 '],
    ['4 ','RUS','Olga GRAF'  		 	,'6:55.77', 	'+4.23 '],
    ['5 ','GER','Claudia PECHSTEIN'   	,'6:58.39', 	'+6.85 '],
    ['6 ','NED','Yvonne NAUTA'  		,'7:01.76', 	'+10.22'],
    ['7 ','NOR','Mari HEMMER'  			,'7:04.45', 	'+12.91'],
    ['8 ','GER','Stephanie BECKERT'   	,'7:07.79', 	'+16.25'],
    ['9 ','RUS','Anna CHERNOVA'  	 	,'7:08.71', 	'+17.17'],
    ['10','JPN','Shoko FUJIMURA'  		,'7:09.65', 	'+18.11'],
    ['11','GER','Bente KRAUS'  			,'7:10.65', 	'+19.11'],
    ['12','JPN','Shiho ISHIZAWA'  		,'7:11.54', 	'+20.00'],
    ['13','JPN','Masako HOZUMI'  	 	,'7:12.42', 	'+20.88'],
    ['14','CAN','Ivanie BLONDIN'  		,'7:20.10', 	'+28.56'],
    ['15','POL','Katarzyna WOZNIAK'   	,'7:28.53', 	'+36.99'],
    ['16','USA','Maria LAMB'  			,'7:29.64', 	'+38.10']
], function(row, i) {
         return {rank: row[0], country: row[1], name: row[2], time: row[3], diff: row[4]};
});

var result_ftp = $.map([  //result 5
    ['1','NED'	,'2:58.05'], 	 
    ['2','POL'	,'3:05.55', 	'+7.50'],
    ['3','RUS'	,'2:59.73', 	'+1.68'],
    ['4','JPN'	,'3:02.57', 	'+4.52'],
    ['5','CAN'	,'3:02.04', 	'+2.31'],
    ['6','USA'	,'3:03.77', 	'+4.04'],
    ['7','NOR'	,'3:08.35', 	'+8.62'],
    ['8','KOR'	,'3:11.54', 	'+11.81']   
], function(row, i) {
         return {rank: row[0], country: row[1], time: row[2], diff: row[3]};
});

var result_m500m = $.map([ //result 6
    ['1','NED','Michel MULDER'			,'69.312'], 	
    ['2','NED','Jan SMEEKENS'			,'69.324',	'+0.01'],
    ['3 ','NED','Ronald MULDER'  		,'69.46'    ,'+0.15'],
    ['4 ','KOR','MO Tae Bum'  			,'69.69'    ,'+0.38'],
    ['5 ','JPN','Joji KATO'  			,'69.74'    ,'+0.43'],
    ['6 ','JPN','Keiichiro NAGASHIMA'  	,'70.040' 	,'+0.73'],
    ['7 ','KAZ','Roman KRECH'  			,'70.048' 	,'+0.73'],
    ['8 ','GER','Nico IHLE'  			,'70.10'    ,'+0.79'],
    ['9 ','POL','Artur WAS'  			,'70.21'    ,'+0.90'],
    ['10','CAN','Gilmore JUNIO'  		,'70.25'   	,'+0.94'],
    ['11','CAN','Jamie GREGG'  			,'70.27'    ,'+0.96'],
    ['12','NOR','Espen HVAMMEN'  		,'70.42'    ,'+1.11'],
    ['13','RUS','Denis KOVAL'  			,'70.440'   ,'+1.13'],
    ['14','CAN','William DUTTON'  		,'70.448'   ,'+1.13'],
    ['15','JPN','Yuya OIKAWA'  			,'70.46' 	,'+1.15'],
    ['16','RUS','Aleksey YESIN'  		,'70.50' 	,'+1.19'],
    ['17','FIN','Pekka KOSKELA'  		,'70.61' 	,'+1.30'],
    ['18','KOR','LEE Kyou Hyuk'  		,'70.65' 	,'+1.34'],
    ['19','RUS','Artyom KUZNETSOV'  	,'70.66' 	,'+1.35'],
    ['20','JPN','Yuji KAMIJO'  			,'70.851' 	,'+1.54'],
    ['21','KOR','KIM Junho'  			,'70.857' 	,'+1.54'],
    ['22','KOR','LEE Kang Seok'  		,'70.87' 	,'+1.56'],
    ['23','RUS','Dmitry LOBKOV'  		,'70.88' 	,'+1.57'],
    ['24','USA','Shani DAVIS'  			,'70.98' 	,'+1.67'],
    ['25','CAN','Muncef OUARDI'  		,'70.997' 	,'+1.68'],
    ['26','USA','Tucker FREDRICKS'  	,'70.999' 	,'+1.68'],
    ['27','USA','Mitchell WHITMORE'  	,'71.06' 	,'+1.75'],
    ['28','ITA','Mirko NENZI'  			,'71.07' 	,'+1.76'],
    ['29','FIN','Mika POUTALA'  		,'71.14' 	,'+1.83'],
    ['30','CHN','MU Zhongsheng'  		,'71.25' 	,'+1.94'],
    ['31','ITA','David BOSA'  			,'71.28' 	,'+1.97'],
    ['32','NOR','Havard LORENTZEN'  	,'71.30' 	,'+1.99'],
    ['33','TPE','SUNG Ching-Yang'  		,'71.36' 	,'+2.05'],
    ['34','GER','Samuel SCHWARZ'  		,'71.37' 	,'+2.06'],
    ['35','CHN','BAI Qiuming'  			,'71.45' 	,'+2.14'],
    ['36','POL','Artur NOGAL'  			,'71.49' 	,'+2.18'],
    ['37','LAT','Haralds SILOVS'  		,'72.44' 	,'+3.13'],
    ['38','NED','Stefan GROOTHUIS'  	,'92.24' 	,'+22.93'],
    ['39','AUS','Daniel GREIG'  		,'115.84' 	,'+46.53']
], function(row, i) {
         return {rank: row[0], country: row[1], name: row[2], time: row[3], diff: row[4]};
});

var result_m1000m = $.map([ //result 7
    ['1 ','NED','Stefan GROOTHUIS'  		,'1:08.39'], 	
    ['2 ','CAN','Denny MORRISON'  			,'1:08.43', 	'+0.04'],
    ['3 ','NED','Michel MULDER'  	 		,'1:08.74', 	'+0.35'],
    ['4 ','GER','Nico IHLE'  				,'1:08.86', 	'+0.47'],
    ['5 ','GER','Samuel SCHWARZ'  			,'1:08.89', 	'+0.50'],
    ['6 ','NED','Koen VERWEIJ'  			,'1:09.09', 	'+0.70'],
    ['7 ','KAZ','Denis KUZIN'  				,'1:09.10', 	'+0.71'],
    ['8 ','USA','Shani DAVIS'  				,'1:09.12', 	'+0.73'],
    ['9 ','USA','Brian HANSEN'  			,'1:09.21', 	'+0.82'],
    ['10','NED','Mark TUITERT'  			,'1:09.29', 	'+0.90'],
    ['11','NOR','Havard LORENTZEN'  		,'1:09.33', 	'+0.94'],
    ['12','KOR','MO Tae Bum'  				,'1:09.37', 	'+0.98'],
    ['13','KAZ','Roman KRECH'  				,'1:09.63', 	'+1.24'],
    ['14','POL','Zbigniew BRODKA'  			,'1:09.66', 	'+1.27'],
    ['15','USA','Joey MANTIA'  				,'1:09.72', 	'+1.33'],
    ['16','POL','Konrad NIEDZWIEDZKI' 		,'1:09.76', 	'+1.37'],
    ['17','RUS','Denis YUSKOV'  			,'1:09.81', 	'+1.42'],
    ['18','RUS','Aleksey YESIN'  			,'1:09.93', 	'+1.54'],
    ['19','NOR','Havard BOKKO'  			,'1:09.98', 	'+1.59'],
    ['20','CAN','Vincent de HAITRE'  		,'1:10.040', 	'+1.65'],
    ['21','KOR','LEE Kyou Hyuk'  			,'1:10.049', 	'+1.65'],
    ['22','AUS','Daniel GREIG'  			,'1:10.13', 	'+1.74'],
    ['23','BEL','Bart SWINGS'  				,'1:10.14', 	'+1.75'],
    ['24','LAT','Haralds SILOVS'  			,'1:10.29', 	'+1.90'],
    ['25','ITA','Mirko NENZI'  				,'1:10.32', 	'+1.93'],
    ['26','CAN','William DUTTON'  			,'1:10.61', 	'+2.22'],
    ['27','RUS','Dmitry LOBKOV'  			,'1:10.65', 	'+2.26'],
    ['28','USA','Jonathan GARCIA'  			,'1:10.74', 	'+2.35'],
    ['29','FRA','Benjamin MACE'  			,'1:10.80', 	'+2.41'],
    ['30','KOR','KIM Taeyun'  				,'1:10.81', 	'+2.42'],
    ['31','NOR','Espen HVAMMEN'  			,'1:11.01', 	'+2.62'],
    ['32','CAN','Muncef OUARDI'  			,'1:11.07', 	'+2.68'],
    ['33','KAZ','Fyodor MEZENTSEV'  		,'1:11.08', 	'+2.69'],
    ['34','CHN','TIAN Guojun'  				,'1:11.17', 	'+2.78'],
    ['35','JPN','Taro KONDO'  				,'1:11.44', 	'+3.05'],
    ['36','JPN','Daichi YAMANAKA'  			,'1:11.93', 	'+3.54'],
    ['37','FIN','Tommi PULLI'  				,'1:12.16', 	'+3.77'],
    ['38','SWE','David ANDERSSON'  			,'1:12.40', 	'+4.01'],
    ['39','RUS','Igor BOGOLYUBSKY'  		,'1:12.85', 	'+4.46'],
    ['40','TPE','SUNG Ching-Yang'  			,'1:13.79', 	'+5.40']		 
], function(row, i) {
         return {rank: row[0], country: row[1], name: row[2], time: row[3], diff: row[4]};
});

var result_m1500m = $.map([ //result 8
    ['1 ','POL','Zbigniew BRODKA'  		 	,'1:45.006'], 	
    ['2 ','NED','Koen VERWEIJ'  		 	,'1:45.009'], 	
    ['3 ','CAN','Denny MORRISON'  		 	,'1:45.22', 	'+0.22'],
    ['4 ','RUS','Denis YUSKOV'  		 	,'1:45.37', 	'+0.37'],
    ['5 ','NED','Mark TUITERT'  		 	,'1:45.42', 	'+0.42'],
    ['6 ','NOR','Havard BOKKO'  		 	,'1:45.48', 	'+0.48'],
    ['7 ','USA','Brian HANSEN'  		 	,'1:45.59', 	'+0.59'],
    ['8 ','NOR','Sverre Lunde PEDERSEN'  	,'1:45.66', 	'+0.66'],
    ['9 ','KAZ','Denis KUZIN'  			 	,'1:45.69', 	'+0.69'],
    ['10','BEL','Bart SWINGS'  			 	,'1:45.95', 	'+0.95'],
    ['11','USA','Shani DAVIS'  			 	,'1:45.98', 	'+0.98'],
    ['12','NED','Stefan GROOTHUIS'  	 	,'1:46.08', 	'+1.08'],
    ['13','NED','Jan BLOKHUIJSEN'  		 	,'1:46.50', 	'+1.50'],
    ['14','LAT','Haralds SILOVS'  		 	,'1:46.79', 	'+1.79'],
    ['15','POL','Jan SZYMANSKI'  		 	,'1:46.86', 	'+1.86'],
    ['16','NOR','Havard LORENTZEN'  	 	,'1:47.27', 	'+2.27'],
    ['17','ITA','Mirko NENZI'  			 	,'1:47.48', 	'+2.48'],
    ['18','RUS','Ivan SKOBREV'  		 	,'1:47.62', 	'+2.62'],
    ['19','CAN','Mathieu GIROUX'  		 	,'1:47.65', 	'+2.65'],
    ['20','POL','Konrad NIEDZWIEDZKI'  	 	,'1:47.77', 	'+2.77'],
    ['21','CHN','TIAN Guojun'  			 	,'1:47.95', 	'+2.95'],
    ['22','USA','Joey MANTIA'  			 	,'1:48.01', 	'+3.01'],
    ['23','GER','Patrick BECKERT'  		 	,'1:48.08', 	'+3.08'],
    ['24','RUS','Aleksey YESIN'  		 	,'1:48.10', 	'+3.10'],
    ['25','RUS','Aleksey SUVOROV'  		 	,'1:48.11', 	'+3.11'],
    ['26','HUN','Konrad NAGY'  			 	,'1:48.12', 	'+3.12'],
    ['27','GER','Robert LEHMANN'  		 	,'1:48.24', 	'+3.24'],
    ['28','CAN','Lucas MAKOWSKY'  		 	,'1:48.51', 	'+3.51'],
    ['29','KOR','JOO Hyong Jun'  		 	,'1:48.59', 	'+3.59'],
    ['30','KAZ','Dmitriy BABENKO'		 	,'1:48.67', 	'+3.67'],
    ['31','JPN','Taro KONDO'  			 	,'1:49.31', 	'+4.31'],
    ['32','FRA','Benjamin MACE'  		 	,'1:49.34', 	'+4.34'],
    ['33','CAN','Vincent de HAITRE'  	 	,'1:49.42', 	'+4.42'],
    ['34','KAZ','Aleksandr ZHIGIN'  	 	,'1:49.48', 	'+4.48'],
    ['35','KAZ','Fyodor MEZENTSEV'  	 	,'1:49.70', 	'+4.70'],
    ['36','NOR','Simen SPIELER NILSEN'   	,'1:49.88', 	'+4.88'],
    ['37','USA','Jonathan KUCK'  		 	,'1:50.19', 	'+5.19'],
    ['38','SWE','David ANDERSSON'  		 	,'1:50.29', 	'+5.29'],
    ['39','ITA','Matteo ANESI'  		 	,'1:50.59', 	'+5.59'],
    ['40','FRA','Ewen FERNANDEZ'  		 	,'1:52.70', 	'+7.70']
], function(row, i) {
         return {rank: row[0], country: row[1], name: row[2], time: row[3], diff: row[4]};
});

var result_m5000m = $.map([ //result 9
    ['1 ','NED','Sven KRAMER'  				,'6:10.76'], 	
    ['2 ','NED','Jan BLOKHUIJSEN'  			,'6:15.71', 	'+4.95'],
    ['3 ','NED','Jorrit BERGSMA'  			,'6:16.66', 	'+5.90'],
    ['4 ','BEL','Bart SWINGS'  				,'6:17.79', 	'+7.03'],
    ['5 ','NOR','Sverre Lunde PEDERSEN'  	,'6:18.84', 	'+8.08'],
    ['6 ','RUS','Denis YUSKOV'  			,'6:19.51', 	'+8.75'],
    ['7 ','RUS','Ivan SKOBREV'  			,'6:19.83', 	'+9.07'],
    ['8 ','GER','Patrick BECKERT'  			,'6:21.18', 	'+10.42'],
    ['9 ','NOR','Havard BOKKO'  			,'6:22.83', 	'+12.07'],
    ['10','GER','Moritz GEISREITER'  		,'6:24.79', 	'+14.03'],
    ['11','RUS','Aleksandr RUMYANTSEV'  	,'6:24.93', 	'+14.17'],
    ['12','KOR','LEE Seung Hoon'  			,'6:25.61', 	'+14.85'],
    ['13','POL','Jan SZYMANSKI'  			,'6:26.35', 	'+15.59'],
    ['14','NZL','Shane DOBBIN'  			,'6:26.90', 	'+16.14'],
    ['15','KAZ','Dmitriy BABENKO' 	 		,'6:28.26', 	'+17.50'],
    ['16','USA','Emery LEHMAN'  			,'6:29.94', 	'+19.18'],
    ['17','ITA','Andrea GIOVANNINI'  		,'6:30.84', 	'+20.08'],
    ['18','FRA','Ewen FERNANDEZ'  			,'6:31.08', 	'+20.32'],
    ['19','USA','Jonathan KUCK'  			,'6:31.53', 	'+20.77'],
    ['20','USA','Patrick MEEK'  			,'6:32.94', 	'+22.18'],
    ['21','GER','Alexej BAUMGAERTNER'  		,'6:34.34', 	'+23.58'],
    ['22','CAN','Mathieu GIROUX'  			,'6:35.77', 	'+25.01'],
    ['23','POL','Sebastian DRUSZKIEWICZ'  	,'6:37.16', 	'+26.40'],
    ['24','KOR','KIM Cheol Min'  			,'6:37.28', 	'+26.52'],
    ['25','NOR','Simen SPIELER NILSEN'  	,'6:42.47', 	'+31.71'],
    ['26','JPN','Shane WILLIAMSON'  		,'6:42.88', 	'+32.12']
], function(row, i) {
         return {rank: row[0], country: row[1], name: row[2], time: row[3], diff: row[4]};
});

var result_m10000m = $.map([ //result 10
    ['1 ','NED','Jorrit BERGSMA'  		,'12:44.45'], 	
    ['2 ','NED','Sven KRAMER'  			,'12:49.02', 	'+4.57'],
    ['3 ','NED','Bob de JONG'  			,'13:07.19', 	'+22.74'],
    ['4 ','KOR','LEE Seung Hoon'  		,'13:11.68', 	'+27.23'],
    ['5 ','BEL','Bart SWINGS'  			,'13:13.99', 	'+29.54'],
    ['6 ','GER','Patrick BECKERT'  		,'13:14.26', 	'+29.81'],
    ['7 ','NZL','Shane DOBBIN'  		,'13:16.42', 	'+31.97'],
    ['8 ','GER','Moritz GEISREITER'  	 	,'13:20.26', 	'+35.81'],
    ['9 ','RUS','Yevgeny SERYAYEV'  	 	,'13:28.61', 	'+44.16'],
    ['10','USA','Emery LEHMAN'  		,'13:28.67', 	'+44.22'],
    ['11','USA','Patrick MEEK'  		,'13:28.72', 	'+44.27'],
    ['12','KAZ','Dmitriy BABENKO'  		,'13:33.18', 	'+48.73'],
    ['13','GER','Alexej BAUMGAERTNER'  	 	,'13:44.39', 	'+59.94'],
    ['14','POL','Sebastian DRUSZKIEWICZ'  	,'13:45.31', 	'+1:00.86']
], function(row, i) {
         return {rank: row[0], country: row[1], name: row[2], time: row[3], diff: row[4]};
});

var result_mtp = $.map([  //result 5
    ['1', 'NED', 	'3:37.71'], 	 
    ['2', 'KOR', 	'3:40.85', 	'+3.14 '],
    ['3', 'POL', 	'3:41.94', 	'+4.23 '],
    ['4', 'CAN', 	'3:44.27', 	'+6.56 '],
    ['5', 'NOR', 	'3:44.91', 	'+7.20 '],
    ['6', 'RUS', 	'3:49.85', 	'+12.14'],
    ['7', 'USA', 	'3:46.50', 	'+8.79 '],
    ['8', 'FRA', 	'3:51.76', 	'+14.05']
], function(row, i) { 
         return {rank: row[0], country: row[1], time: row[2], diff: row[3]};
});


var results = [result_f500m, result_f1000m, result_f1500m, result_f3000m, result_f5000m, result_ftp,
               result_m500m, result_m1000m, result_m1500m, result_m5000m, result_m10000m, result_mtp];

		 
function result(id) {
	return results[id];
}

var medals_f = $.map([
    ['KOR','RUS','NED'],
    ['CHN','NED','NED'],
    ['NED','NED','NED'],
    ['NED','CZE','RUS'],
    ['CZE','NED','NED'],
    ['NED','POL','RUS']
], function(row, i) {
      return {name: distances_f[i].name, gold: row[0], silver: row[1], bronze: row[2]}
});

function country_medals_f(abr) {
    var ret = [];
	for(var i = 0; i < medals_f.length;i++){
   	   if (abr == medals_f[i].gold||abr==medals_f[i].silver||abr==medals_f[i].bronze)
	      ret.push({name:medals_f[i].name, gold:abr == medals_f[i].gold? abr:'o', silver:abr == medals_f[i].silver? abr:'o', bronze:abr == medals_f[i].bronze? abr:'o'});		  
	}
    return ret;	
	
}

var medals_m = $.map([
    ['NED','NED','NED'],
    ['NED','CAN','NED'],
    ['POL','NED','CAN'],
    ['NED','NED','NED'],
    ['NED','NED','NED'],
    ['NED','KOR','POL']
], function(row, i) {
      return {name: distances_m[i].name, gold: row[0], silver: row[1], bronze: row[2]}
});

function country_medals_m(abr) {
    var ret = [];
	for(var i = 0; i < medals_m.length;i++){
   	   if (abr == medals_m[i].gold||abr==medals_m[i].silver||abr==medals_m[i].bronze)
	      ret.push({name:medals_m[i].name, gold:abr == medals_m[i].gold? abr:'o', silver:abr == medals_m[i].silver? abr:'o', bronze:abr == medals_m[i].bronze? abr:'o'});		  
	}
    return ret;	
}

var countries = $.map([
    ['1','NED','8','7','8'],
    ['2','POL','1','1','1'],
    ['3','CZE','1','1','0'],
    ['4','KOR','1','1','0'],
    ['5','CHN','1','0','0'],
    ['6','RUS','0','1','2'],
    ['7','CAN','0','1','1']
], function(row, i) {
         return {rank: row[0], country: row[1], gold: row[2], silver: row[3], bronze: row[4]};
});

function country(abr) {
   for(var i = 0; i < countries.length;i++){
   	   var row = countries[i]; 
	   if (row.country == abr) return row;
	}	   
	return {rank: '', country: abr, gold: '0', silver: '0', bronze: '0'};
}


var data = {

  // load new "page"
  load: function(path) {

    var els = path.split("/"),
      page = els[0];

    return {
      path: path,
      type: page || "home",
      data: page == "distances_f" ? distances_f :
            page == "distances_m" ? distances_m :
            page == "result" ? results[els[1]] : 
	    page == "medals_f" ? medals_f : 
	    page == "medals_m" ? medals_m : 
	    page == "medals_country_f" ? country_medals_f(els[1]) : 
	    page == "medals_country_m" ? country_medals_m(els[1]) : 
	    page == "countries" ? countries : 
	    page == "country" ? country(els[1]) : [] 
     };

  },


  search: function(query) {
    return {msg: "Sorry, not implemented yet."};
  },

};


// The admin API
function OSkate(conf) {

  var self = riot.observable(this),
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


// A generic promise interface by using $.observable

function Promise(fn) {
  var self = riot.observable(this);

  $.map(['done', 'fail', 'always'], function(name) {
    self[name] = function(arg) {
      return self[$.isFunction(arg) ? 'on' : 'trigger'](name, arg);
    };

  });

}


// The ability to split your single-page application (SPA) into loosely-coupled modules

var instance;

top.oskate = riot.observable(function(arg) {

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

})(typeof top == "object" ? window : exports);
// Presenter for medals per country
oskate(function(app) {

  var root = $("#countries-page"),
    tmpl = $("#countries-page-tmpl").html(),
	list_tmpl = $("#country-list-tmpl").html();
	//render result
	app.on("load:countries", function(results) {
	
       root.html(riot.render(tmpl, results));
	   var displaydata = $.map(results, function(data, i) {
         if (i % 2 == 0) 
			return {display: 'even', rank: data.rank, country: data.country, gold: data.gold, silver: data.silver, bronze: data.bronze};
		 else
			return {display: 'odd', rank: data.rank, country: data.country, gold: data.gold, silver: data.silver, bronze: data.bronze};
		});
       
       var list = $("#country-table", root);

       $.each(displaydata, function(i, el) {
          list.append(riot.render(list_tmpl, el));
       });

    });


});

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

// Presenter for medals per distance
oskate(function(app) {

  var root_wm = $("#women"),
    root_m = $("#men"),
	tmpl = $("#medals-page-tmpl").html(),
	list_tmpl = $("#medal-list-tmpl").html();
	//render result
	app.on("load:medals_f", function(results) {

	   //template contains one placeholder: {gender}
       root_wm.html(riot.render(tmpl, {gender: 'Women medals per distance'}));
       
	   var displaydata = $.map(results, function(data, i) {
         if (i % 2 == 0) 
			return {display: 'even', name: data.name, gold: data.gold, silver: data.silver, bronze: data.bronze};
		 else
			return {display: 'odd', name: data.name, gold: data.gold, silver: data.silver, bronze: data.bronze};
		});
       var list = $("#medal-table", root_wm);

       $.each(displaydata, function(i, el) {
          list.append(riot.render(list_tmpl, el));
       });
    });
	app.on("load:medals_country_f", function(results) {

	   //template contains one placeholder: {gender}
       root_wm.html(riot.render(tmpl, {gender: 'Womens medals per distance'}));
       
	   var displaydata = $.map(results, function(data, i) {
         if (i % 2 == 0) 
			return {display: 'even', name: data.name, gold: data.gold, silver: data.silver, bronze: data.bronze};
		 else
			return {display: 'odd', name: data.name, gold: data.gold, silver: data.silver, bronze: data.bronze};
		});
       var list = $("#medal-table", root_wm);

       $.each(displaydata, function(i, el) {
          list.append(riot.render(list_tmpl, el));
       });
    });
	app.on("load:medals_m", function(results) {

	   root_m.html(riot.render(tmpl, {gender: 'Men medals per distance'}));
       
	   var displaydata = $.map(results, function(data, i) {
         if (i % 2 == 0) 
			return {display: 'even', name: data.name, gold: data.gold, silver: data.silver, bronze: data.bronze};
		 else
			return {display: 'odd', name: data.name, gold: data.gold, silver: data.silver, bronze: data.bronze};
		});
       var list = $("#medal-table", root_m);

       $.each(displaydata, function(i, el) {
          list.append(riot.render(list_tmpl, el));
       });
    });
	app.on("load:medals_country_m", function(results) {

	   //template contains one placeholder: {gender}
       root_m.html(riot.render(tmpl, {gender: 'Men medals per distance'}));
       
	   var displaydata = $.map(results, function(data, i) {
         if (i % 2 == 0) 
			return {display: 'even', name: data.name, gold: data.gold, silver: data.silver, bronze: data.bronze};
		 else
			return {display: 'odd', name: data.name, gold: data.gold, silver: data.silver, bronze: data.bronze};
		});
       var list = $("#medal-table", root_m);

       $.each(displaydata, function(i, el) {
          list.append(riot.render(list_tmpl, el));
       });
    });
  
});

// Presenter for results of one distance
oskate(function(app) {

  var root = $("#result-page"),
    tmpl = $("#result-page-tmpl").html(),
    list_tmpl = $("#result-list-tmpl").html();
    //render result
    app.on("load:result", function(results) {

	root.html(riot.render(tmpl, results));
       
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
          list.append(riot.render(list_tmpl, el));
        });
    });
  
});

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
      results.append(riot.render(tmpl, arr));

    });

    $(document).one("click keypress", function() {
      results.hide();
    });

  });

});

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
    riot.route(link.attr("href"));

  });

  // 2. listen to route clicks and back button
  riot.route(function(path) {

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

