var pdftohtml = require('pdftohtmljs');
var converter = new pdftohtml('test.pdf', "pdftohtmljs.html");
 
// See presets (ipad, default)
// Feel free to create custom presets
// see https://github.com/fagbokforlaget/pdftohtmljs/blob/master/lib/presets/ipad.js
// convert() returns promise
converter.convert('ipad').then(function() {
  console.log("Success");
}).catch(function(err) {
  console.error("Conversion error: " + err);
});
 
// If you would like to tap into progress then create
// progress handler
converter.progress(function(ret) {
  console.log ((ret.current*100.0)/ret.total + " %");
});