var express = require('express');
var config = require('config');
var request = require('request');
var cheerio = require('cheerio');
var parsers = require('./parsers');
var jade = require('jade');
var app     = express();
require('events').EventEmitter.prototype._maxListeners = 15;

app.set('views', __dirname + '/views')
app.set('view engine', 'jade');
console.log('hello world!');


app.get('/', function (req, res) {
  res.render('index');
});

app.get('/scrape', function(req, res){
    console.log('query: '+ req.query.q);

var results = [];    
var qry = req.query.q;
var udemy = 'https://www.udemy.com/courses/search/?q='+qry+'&lang=en';
var ps = 'https://www.pluralsight.com/search?q='+qry+'&categories=course'; // AngularJs not interpolated.
ps = 'https://www.google.com/#q='+qry+'+site:pluralsight.com'; //Google all JavaScript.
ps = 'https://www.googleapis.com/customsearch/v1?key='+config.get('GOOGLE_API_KEY')+'&cx='+config.get('GOOGLE_SEARCH_CX')+'&q='+qry;
var mva = 'https://mva.microsoft.com/search/SearchResults.aspx#!q='+qry+'&lang=1033';
var coursera = 'https://www.coursera.org';
var lynda = 'http://www.lynda.com/search?q='+qry;

var callbackComplete = function(error, resp, body)
{
    parsers.parseLynda(error, body, results, cheerio);
    console.log('rendering');
    res.render('results', { results: results, title: 'Results' })
}

var callbackLynda = function(error, resp, body)
{
    console.log('calling lynda');
    request(lynda, callbackComplete);
}

var callbackCoursera = function(error, resp, body)
{
    parsers.parsePluralsight(error, body, results, cheerio);
    console.log('calling coursera');
    request(coursera, callbackLynda);
}

var callbackPluralsight = function(error, resp, body)
{
    parsers.parseMicrosoft(error, body, results, cheerio);
    console.log('calling pluralsight');
    request(ps, callbackCoursera);
}

var callbackMicrosoft = function(error, resp, body)
{
    parsers.parseUdemy(error, body, results, cheerio);
    console.log('calling ms');
    request('https://www.microsoft.com/en-us/', callbackPluralsight);
}

console.log('calling udemy');
request(udemy, callbackMicrosoft)

});

app.listen('8081');
console.log('Searching on 8081'); 
exports = module.exports = app;