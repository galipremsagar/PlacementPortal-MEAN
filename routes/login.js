/**
 * Created by KH9143 on 27-12-2015.
 */
var express = require('express');
var router = express.Router();
var pg = require('pg');
var temp;
var results = [];
var companies_tables = [];
var final_results = {};
var temp_pin;
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
            temp = row.company_table_name;
            results[row.company_table_name]=row;
            //console.log("immediately---------->"+results[row.company_table_name]);
            if(companies_tables.indexOf(row.company_table_name)==-1)
                companies_tables.push(row.company_table_name);
        });
        //console.log("+++++++++++++++++++end"+results[temp]+"start+++++++++++++++++++++++++++++++++++++");
        //console.log("results",companies_tables);

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            //return res.json(results);
        });

        //console.log(cookies);
        var query_1 = client.query("SELECT pin FROM auth WHERE session_key=$1;",[cookies['connect.sid']]);


        query_1.on('row', function(row) {
            //console.log(row.company_table_name);
            temp_pin = row.pin;
            //console.log(temp_pin);
        });

        companies_tables.forEach(function(company,index){
            var query_2 = client.query("SELECT * FROM "+company+";");
            //console.log("outside company is==================>"+company);

            query_2.on('row', function(row) {
                //console.log(row.company_table_name);
                //console.log("INSIDE COMPANY IS---------->"+company);
                if(row.pin_number==temp_pin)
                {
                    //console.log("pushing..."+company+"-------------"+results);
                    //if(final_results.indexOf(results[company])==-1)
                    final_results[company]=results[company];
                }
                //console.log(temp_pin);
            });


        });

        query_1.on('end',function(row){
            done();
            return res.json(final_results);
            //final_results = [];
        });

        console.log("clearing...");
        //results = [];
        //companies_tables = [];


        console.log("cleared....");

    });
    //final_results = [];

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

router.post('/attendance',function(req,res,next){
    console.log("INSIDE ATTENDANCE");
    cookies = parseCookies(req);
    console.log(cookies);


    var connect_string = "postgres://postgres:prem@localhost:5432/tnp";

    var client = new pg.Client(connect_string);
    client.connect();

    pg.connect(connect_string, function(err, client, done) {

        // SQL Query > Delete Data
        var query = client.query("SELECT * FROM placement_drives");

        // Stream results back one row at a time
        query.on('row', function(row) {
            //console.log(row.company_table_name);
            temp = row.company_table_name;
            results[row.company_table_name]=row;
            console.log("immediately---------->"+results[row.company_table_name]);
            if(companies_tables.indexOf(row.company_table_name)==-1)
                companies_tables.push(row.company_table_name);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            //return res.json(results);
        });

        console.log(cookies);
        setTimeout(function(){
            console.log("+++++++++++++++++++end"+results[temp]+"start+++++++++++++++++++++++++++++++++++++");
            console.log("results",companies_tables);

            var query_1 = client.query("SELECT pin FROM auth WHERE session_key=$1;",[cookies['connect.sid']]);


            query_1.on('row', function(row) {
                console.log("<<<<<<<<<<ROW>>>>>>>>>>>>>>>"+row);
                temp_pin = row.pin;
                console.log(temp_pin);
            });
            companies_tables.forEach(function(x,i){
                console.log("x:"+x+"i:"+i);
            });
            companies_tables.forEach(function(company,index){
                query_2 = client.query("SELECT * FROM "+company+";");
                console.log("outside company is==================>"+company);
                query_2.on('row', function(row) {
                    //console.log(row.company_table_name);
                    console.log("INSIDE COMPANY IS---------->"+company+"pin:"+row.pin_number+" "+temp_pin);
                    if(row.pin_number==temp_pin)
                    {
                        console.log("pushing..."+company+"-------------"+results);
                        //if(final_results.indexOf(results[company])==-1)
                        final_results[company]=row;
                    }
                    console.log(temp_pin);
                    console.log(final_results);
                });




            });

            query_1.on('end',function(row){
                done();

                //final_results = [];
            });
            query_2.on('end',function(row){
                return res.json({op:final_results});
            });
            console.log("clearing...");
            //results = [];
            //companies_tables = [];


            console.log("cleared....");
        },1000);
    });

});

module.exports = router;
