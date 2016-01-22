/**
 * Created by KH9143 on 20-12-2015.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('signup');
});

router.post('/',function(req,res,next) {
    console.log(req.body.name);
    /**Verify if the user is present in the database and if
     * present then return failure else, create the user and
     * return success.
     * @type {{success: boolean, date: Date, reason: string}}
     */
    response_json = {"success" : true,"date": new Date(),"reason":"User Created"};
    res.send(response_json);
});
module.exports = router;
