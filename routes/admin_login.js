/**
 * Created by KH9143 on 09-02-2016.
 */

var express = require('express');
var router = express.Router();
var pg = require('pg');
var results = [];
var approvals = [];

var temp;
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
    res.render('admin_login');
});

router.post('/drive', function(req, res, next) {
    console.log("came to notify");
    console.log(req.body);
    console.log("end  to notify");
    cookies = parseCookies(req);
    console.log(cookies);
    var connect_string = "postgres://postgres:prem@localhost:5432/tnp";

    var client = new pg.Client(connect_string);
    client.connect();


    pg.connect(connect_string, function(err, client, done) {



        var query = client.query("CREATE TABLE IF NOT EXISTS "+req.body.companyName +"(pin_number numeric NOT NULL,attendance boolean,hiring_decision boolean,CONSTRAINT "+req.body.companyName+"_pkey PRIMARY KEY (pin_number)) WITH (OIDS=FALSE);");

        query.on('end', function() {
            done();
            console.log("first query execution done");
        });
        console.log("came after first one");

        for(i in req.body.array_of_students)
        {
            query_1 = client.query("INSERT INTO "+req.body.companyName+"(pin_number,attendance,hiring_decision) VALUES ($1,$2,$3);",[req.body.array_of_students[i].pin,req.body.array_of_students[i].attendance,req.body.array_of_students[i].hiring_decision]);
        }
        query_1.on('end', function() {
            done();
            console.log("END");

        });

        console.log("clearing...");
        results = [];
        console.log("cleared....");
        return res.json({success:true});
    });
});

router.post('/companies',function(req,res,next) {
    /*console.log("....start");
     console.log(JSON.stringify(req.body));
     console.log(req.body.ctc);
     console.log("....stop");*/
    cookies = parseCookies(req);
    console.log(cookies);
    var connect_string = "postgres://postgres:prem@localhost:5432/tnp";

    var client = new pg.Client(connect_string);
    client.connect();


    pg.connect(connect_string, function(err, client, done) {

        console.log(JSON.stringify(req.body));
        console.log(req.body.ctc);
        // SQL Query > Delete Data
        var query = client.query("INSERT INTO placement_drives (company_name, company_table_name, logo_url, company_description,job_description, ctc," +
            " date_of_drive, company_type, job_role, process, venue, reporting_time, branches, btech_cutoff)" +
            " VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14);",[req.body.companyName, req.body.companyName, req.body.logoUrl, req.body.companyDescription,req.body.jobDescription, req.body.ctc, req.body.dateOfPlacementDrive, req.body.companyType, req.body.jobRole,req.body.driveProcess, req.body.venue, req.body.reportingTime, req.body.branchNames, req.body.cutoff_cgpa]);

        query.on('end', function() {
            done();
            console.log("first query execution done");
        });

        var query_new = client.query("CREATE TABLE IF NOT EXISTS "+req.body.companyName +"(pin_number numeric NOT NULL,attendance boolean,hiring_decision boolean,CONSTRAINT "+req.body.companyName+"_pkey PRIMARY KEY (pin_number)) WITH (OIDS=FALSE);");

        query_new.on('end', function() {
            done();
            console.log("first query execution done");
        });
        console.log("came after first one");
        //results = [];
        for (i in req.body.branchNames)
        {
            var query_branch = client.query("SELECT * FROM mdb WHERE (btech_percentage>= $1 AND branch= $2);",[req.body.cutoff_cgpa*10,req.body.branchNames[i]]);
            query_branch.on('row', function (row) {
                console.log("pushing....."+row);
                results.push(row);

            });

            console.log(req.body.branchNames[i]);

        }
        console.log("outside"+results);
        //var fetch_query = client.query("SELECT * FROM ")
        // Stream results back one row at a time
        /*query.on('row', function(row) {

         results.push(row);

         });*/
        //console.log(yac);
        //console.log("results",results);

        // After all data is returned, close connection and return results
        query_branch.on('end', function() {
            done();
            console.log("END");
            return res.json({result:results});
        });



        console.log("clearing...");
        results = [];
        console.log("cleared....");
    });


});

router.post('/reject',function(req,res,next) {
    console.log("came to reject");
    console.log(req.body);

    var connect_string = "postgres://postgres:prem@localhost:5432/tnp";

    var client = new pg.Client(connect_string);
    client.connect();

    pg.connect(connect_string, function(err, client, done) {

        var query_1 = client.query("DELETE FROM approvals_marks WHERE pin=$1;",[parseInt(req.body.pin_num)]);


        query_1.on('end',function(row){
            done();
            return res.json({op:"success"});
        });

    });

});

router.post('/accept',function(req,res,next) {
    console.log("came to accept");
    console.log(req.body);

    var connect_string = "postgres://postgres:prem@localhost:5432/tnp";

    var client = new pg.Client(connect_string);
    client.connect();

    pg.connect(connect_string, function(err, client, done) {

        var query_1 = client.query("SELECT * FROM approvals_marks WHERE pin=$1;",[parseInt(req.body.pin_num)]);


        query_1.on('row', function(row) {
            console.log("<<<<<<<<<<ROW>>>>>>>>>>>>>>>"+row);
            temp_approv = row;
            console.log(temp_approv);
        });


        query_1.on('end',function(row){
            done();
        });
        setTimeout(function(){
            client.query("UPDATE student_marks SET data=$1 WHERE pin=$2;",[temp_approv.data,parseInt(req.body.pin_num)]);

            return res.json({op:"success"});

            console.log("cleared....");
        },1000);


    });

});



router.post('/getapprovals',function(req,res,next) {
    console.log(req.body.name);
    cookies = parseCookies(req);
    console.log("Function called");
    var connect_string = "postgres://postgres:prem@localhost:5432/tnp";

    var client = new pg.Client(connect_string);
    client.connect();
    approvals = [];
    pg.connect(connect_string, function(err, client, done) {

        // SQL Query > Delete Data
        var query = client.query("SELECT * FROM approvals_marks;");

        // Stream results back one row at a time
        query.on('row', function(row) {
            //console.log(row.company_table_name);
            temp = {};
            console.log("inside query:"+row.pin);
            console.log("inside query-data:"+JSON.stringify(row.data));
            temp['pin'] = row.pin;
            temp['user_marks'] = row;
            approvals.push(temp);
            //console.log("immediately---------->"+results[row.company_table_name]);
            console.log("approved++++",approvals);

        });
        //console.log("+++++++++++++++++++end"+results[temp]+"start+++++++++++++++++++++++++++++++++++++");
        console.log("<------------------------results",results);

        // After all data is returned, close connection and return results
        query.on('end', function() {
            console.log("came to 1st end");
            done();
        });
        setTimeout(function(){
            console.log("loop end");
            console.log("rsul:",approvals);
            return res.json(approvals);
        },1000);
    });
    //final_results = [];
    client.end();
});

router.get('/companies',function(req,res,next) {

    var connect_string = "postgres://postgres:prem@localhost:5432/tnp";

    var client = new pg.Client(connect_string);
    client.connect();

    pg.connect(connect_string, function(err, client, done) {
        var companies_tables = [];
        // SQL Query > Delete Data
        query = client.query("SELECT * FROM placement_drives");

        // Stream results back one row at a time
        query.on('row', function(row) {
            //console.log(row.company_table_name);
            temp = row.company_table_name;
            console.log("Companies names----------"+companies_tables);

            if(companies_tables.indexOf(row.company_table_name)==-1)
                companies_tables.push(row.company_table_name);
        });

        console.log("results",companies_tables);

        query.on('end',function(row){
            done();
            console.log("BEFORE SENDING---------"+companies_tables);
            return res.json({result:companies_tables});
            //final_results = [];
        });

    });
});

router.post('/students',function(req,res,next) {
    /*console.log("....start");
     console.log(JSON.stringify(req.body));
     console.log(req.body.ctc);
     console.log("....stop");*/
    cookies = parseCookies(req);
    console.log(cookies);
    var connect_string = "postgres://postgres:prem@localhost:5432/tnp";
    var students_tables={};
    var all_branches = {};
    var client = new pg.Client(connect_string);
    client.connect();


    pg.connect(connect_string, function(err, client, done) {

        console.log(req.body.drive);
        // SQL Query > Delete Data
        var query = client.query("SELECT * FROM "+req.body.drive+";");

        query.on('row', function(row) {
            //console.log(row.company_table_name);
            temp = row.pin_number;
            console.log("Companies names----------"+temp);
            students_tables[row.pin_number] = row;
            console.log(students_tables);
        });

        setTimeout(function(){

            console.log("came after first one");
            console.log(students_tables);
            console.log("loop start");
            Object.keys(students_tables).forEach(function(student_pin,index){
                console.log("stud pin: "+student_pin);
                var query_branch = client.query("SELECT * FROM mdb WHERE (pin= $1);",[parseInt(student_pin,10)]);
                query_branch.on('row', function (row) {
                    console.log("pushing....."+row);
                    all_branches[row.pin] =row;
                });
                query_branch.on('end',function(row){
                    console.log("res json",all_branches);
                    return res.json({result:all_branches,company_related_info:students_tables});
                });

            });
            console.log("loop end");
        },1000);

        console.log("clearing...");
        results = [];
        console.log("cleared....");
    });


});



router.post('/update_attendance',function(req,res,next) {
    /*console.log("....start");
     console.log(JSON.stringify(req.body));
     console.log(req.body.ctc);
     console.log("....stop");*/
    cookies = parseCookies(req);
    console.log(cookies);
    var connect_string = "postgres://postgres:prem@localhost:5432/tnp";
    var students_tables={};
    var all_branches = {};
    var client = new pg.Client(connect_string);
    client.connect();
    console.log(req.body);
    console.log("YAY");

    pg.connect(connect_string, function(err, client, done) {


        req.body.array_of_students.forEach(function (pin,index) {
            console.log("PIN::"+pin.pin+"INDEX::"+index);
            query = client.query("UPDATE "+req.body.companyName+" SET attendance=$1 WHERE pin_number=$2;",[true,pin.pin]);

        });

        query.on('end', function() {
         done();
         console.log("END");
         return res.json({result:"success"});
         });

    });


});



router.post('/',function(req,res,next) {
    console.log(req.body.name);
   
    response_json = {json_res:["gali","sagar","gali"]};
    res.send(response_json);
});

module.exports = router;
