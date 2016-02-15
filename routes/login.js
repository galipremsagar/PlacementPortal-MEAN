/**
 * Created by KH9143 on 27-12-2015.
 */
var express = require('express');
var router = express.Router();
var pg = require('pg');
var results = [];
var companies_tables = [];

function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('login');
});

router.post('/companies',function(req,res,next) {
    console.log(req.body.name);
    cookies = parseCookies(req);

    var connect_string = "postgres://postgres:prem@localhost:5432/tnp";

    var client = new pg.Client(connect_string);
    client.connect();
    pg.connect(connect_string, function(err, client, done) {

        // SQL Query > Delete Data
        var query = client.query("SELECT * FROM placement_drives");

        // Stream results back one row at a time
        query.on('row', function(row) {
            //console.log(row.company_table_name);
            var temp = row.company_table_name;
            results.push({temp:row});
            companies_tables.push(row.company_table_name);
        });
        //console.log(yac);
        //console.log("results",companies_tables);

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            //return res.json(results);

        });

        console.log(cookies);
        var query_1 = client.query("SELECT pin FROM auth WHERE session_key=$1;",[cookies['connect.sid']]);


        query_1.on('row', function(row) {
            //console.log(row.company_table_name);
            var temp_pin = row.pin;
            console.log(temp_pin);
        });

        console.log("clearing...");
        results = [];
        console.log("cleared....");
    });


});








router.post('/',function(req,res,next) {
    console.log(req.body.name);
    /**Verify if the user is present in the database and if
     * present then return failure else, create the user and
     * return success.
     * @type {{success: boolean, date: Date, reason: string}}
     */
    response_json = {json_res:["gali","sagar","gali"]};
    res.send(response_json);
});

module.exports = router;
