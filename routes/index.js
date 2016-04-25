var express = require('express');
var router = express.Router();
var pg = require('pg');
var results = [];
function parseCookies (request) {
  var list = {},
      rc = request.headers.cookie;

  rc && rc.split(';').forEach(function( cookie ) {
    var parts = cookie.split('=');
    list[parts.shift().trim()] = decodeURI(parts.join('='));
  });

  return list;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


router.post('/auth', function(req, res, next) {
  console.log(req.body);
  console.log(req.headers.cookie);
  cookies = parseCookies(req);
  console.log(cookies);

  console.log(parseInt(req.body.pin,10));

  var connect_string = "postgres://postgres:prem@localhost:5432/tnp";

  var client = new pg.Client(connect_string);
  client.connect();

  pg.connect(connect_string, function(err, client, done) {

    var query = client.query("SELECT * FROM auth WHERE pin=$1;",[parseInt(req.body.pin,10)]);

    console.log("This is the query...");
    // Stream results back one row at a time

    query.on('row', function(row) {
      console.log(row);
      results.push(row);
      if(row.password==req.body.password)
      {
        console.log("correct password");
        client.query("UPDATE auth SET session_key = $1 WHERE pin = $2;",[cookies['connect.sid'],parseInt(req.body.pin,10)]);
        return res.status(200).send({ redirect:"/login"});
      }
      else
      {
        console.log("wrong password");
        return res.status(500).send({ redirect:"/index"});
      }
    });

    console.log("THIS is result");
    console.log(results);
    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
    });


    console.log("clearing...");
    results = [];
    console.log("cleared....");
  });

});

module.exports = router;
