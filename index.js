var express = require('express');
var app = express();
// Setup static folders
app.use(express.static('public'));
app.use(express.static('js'));
app.use(express.static('assets'));

// Quick templating engine, replacing #ip# with user ip for detection.

var fs = require('fs'); // this engine requires the fs module
app.engine('ntl', function (filePath, options, callback) { // define the template engine
  fs.readFile(filePath, function (err, content) {
    if (err) return callback(new Error(err));
    // this is an extremely simple template engine
    var rendered = content.toString().replace('#ip#',options.ip);
    return callback(null, rendered);
    })
});

app.set('views', './views'); // specify the views directory
app.set('view engine', 'ntl');

//Simply get it on / and render tempate index
app.get('/', function (req, res) {
    var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
    if (ip == "::1")
    {
        ip = "78.194.186.217"
    }
    console.log('IP::',ip);
    res.render('index', { ip: ip});
})

app.listen(process.env.PORT || 4002);
console.log('Server Started.');
