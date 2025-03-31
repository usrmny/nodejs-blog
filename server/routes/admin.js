const express = require('express');
const router = express.Router();
const Post = require('../models/post') 
const User = require('../models/User') 

const adminLayout = '../views/layouts/admin'


/** 
GET
Admin - Login Page 
*/ 
router.get('/admin', async (req, res) => {
    try{
        const locals = {
            title: "Admin",
            description: "Blog using Nodejs, Express and MongoDB"
        }

        res.render('admin/index', {locals, layout: adminLayout})

    } catch(e){
        console.log(e);
    }


});

/** 
POST
Admin - Check Login  
*/ 

router.post('/admin', async (req, res) => {
    try{

        const {username, password} = req.body;
        console.log(req.body)

        res.redirect('admin')

    } catch(e){
        console.log(e);
    }


});


module.exports = router;