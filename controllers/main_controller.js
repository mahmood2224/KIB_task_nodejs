const express = require('express');
const router = express.Router() ;
const bodyParser = require('body-parser');
const fs = require("fs")
const fileHelper = require("../helpers/file_helper")
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


router.post('/make' , multipartMiddleware ,function (req , res) {

    let validation = fileHelper.validateFile(req.files.file_input.path);
    if(validation.length >0)
        return  res.json({"status" : 0 , "errors" : validation});

    let result = fileHelper.separateData(req.files.file_input);
    result = result.map( e => "http://"+req.headers.host+"/"+e);
    return res.json({ 'status':1 ,'result' : result});
})


module.exports = router;