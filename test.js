 /*
    Tests all the pages and reports any broken includes.
    Run as - casperjs test.js
 */


// For inspecting an object
// var utils = require('utils');
// utils.dump(response);

var fs = require('fs');
var casper = require('casper').create();

var base_url = 'http://localhost:7779/';

// Add a listener on `resource.received` event
// and check for errors
casper.on('resource.received', function(resource) {
    this.echo(resource);
    if (resource.status !== 200 && resource.status !== 301) {
        this.echo(resource.status + ' ' + resource.url);
    }
});

casper.start();

// Get the list of files in templates directory
// and slicing away first two results containing `.` & `..`
var templates = fs.list('templates').slice(2);


// Loop over the file names and open the urls in casper
for (var i=0; i<templates.length; i++) {
    if (templates[i][0] != '_') {
        casper.thenOpen(base_url + templates[i]);
    }
}

// Boom!
casper.run();
