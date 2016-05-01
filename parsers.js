exports.parseMicrosoft = function (error, html, results, cheerio)
{
    if(!error){
    var $ = cheerio.load(html);
    $('.font16').filter(function(){
            var json = { };
            var data = $(this);
            json.title = data;
            json.link = '';
            json.source = 'Microsoft';
            results.push(json);
    })}
};

exports.parseUdemy = function (error, html, results, cheerio)
{
    if(!error){
    var $ = cheerio.load(html);
    $('.course-box-flat').filter(function(){
            var json = { };
            var data = $(this);
            json.title = data.children('a').children('div')[1].children[1].children[1].children[1].children[0].data;
            json.link = 'https://www.udemy.com' + data[0].children[1].attribs.href;
            json.source = 'Udemy';
            results.push(json);
    })
}};

exports.parseLynda = function (error, html, results, cheerio)
{
    if(!error){
    var $ = cheerio.load(html);
    $('.course-list-thumb').filter(function(){
            var json = { };
            var data = $(this);
            json.title = data[0].attribs.title.replace('Go to course details for ','');
            json.link = data[0].attribs.href;
            json.source = 'Lynda';
            results.push(json);
    })
}};

exports.parseCoursera = function (error, html, results, cheerio)
{
    if(!error){
    var $ = cheerio.load(html);
    $('.title').filter(function(){
            var json = { };
            var data = $(this);
            json.title = '';
            json.link = ''
            json.source = 'Coursera';
            results.push(json);
    })
}};

exports.parsePluralsight = function (error, html, results, cheerio, fs)
{
    if(!error){
    var $ = cheerio.load(html);
    var data = JSON.parse(html);
    for(var i = 0; i < data.items.length; i++)
    {
        results.push({ 'title': data.items[i].title, 'link': data.items[i].link, 'source': 'PluralSight'});
    }
}};