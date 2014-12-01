oskate2014
==========

An exercise in creating an web application with Riot.js



This webapp is mainly based on the demo of Riot.js found here: https://github.com/moot/riotjs-admin".
I took out the login-functionality, added a presenter to determine what the screen shows on start-up, split up the view-styles (though not very thourougly) and played a bit with the same data getting a different view in the presenters. The data in this webapp is static and is all contained in one text-file. No database connection or abstraction.
 

## Installation

Hit following commands to run the administration panel on the console

``` sh
bower install
npm install
./make.js gen
open index.html
./make.js watch
```

You should be able to modify JS and Stylus files and the concatenation and pre-compilation is automatically taken care of. Check make.js for more other targets than `watch`.

[Live version](http://oskate2014.raspberryadventures.in) &bull;
[Riot website](https://moot.it/riotjs/) &bull;


