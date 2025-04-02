const express = require('express');
const router = express.Router();
const Post = require('../models/post') 
const User = require('../models/User') 
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const adminLayout = '../views/layouts/admin'
const jwtSecret = process.env.JWT_SECRET;

/** 
/*
Admin - Check Page 
*/ 
const authMiddleware = (req,res,next) => { //verify if user has token => yes = logged in automatically, else not
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message: 'Unauthorized'}) //can render an actual page instead to make website nicer!
    }
    
    try{
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId; 
        next();
    }catch(e){
        res.status(401).json({message: 'Unauthorized'}) //can render an actual page instead to make website nicer!
    }
}


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
        const user = await User.findOne({username});

        if(!user){
            res.status(401).json({message: 'Invalid Credentials'})
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            res.status(401).json({message: 'Invalid Credentials'})
        }

        const token = jwt.sign({userId: user._id}, jwtSecret)
        res.cookie('token', token, { httpOnly: true})

        res.redirect('/dashboard')

    } catch(e){
        console.log(e);
    }


});

/** 
POST
Admin - Register
*/ 

router.post('/register', async (req, res) => {
    try{
        const {username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try{
            const user = await User.create({ username, password:hashedPassword})
            res.status(201).json({message: 'User Created', user});
        } catch (e){
            if(e.code === 11000){
                res.status(409).json({message: 'User already in use'})
            }
            res.status(500).json({message: 'Internal server error'})
        }

    } catch(e){
        console.log(e);
    }


});

/** 
GET
Admin Dashboard  
*/ 

router.get('/dashboard', authMiddleware, async (req, res) => {//how does middleware work?

    try{
        const locals = {
            title: "Dashboard",
            description: "Blog using Nodejs, Express and MongoDB"
        }

        const data = await Post.find();
        res.render('admin/dashboard', {
            locals,
            data,
            layout: adminLayout
        })
    }
    catch(e){
        console.log(e)
    }
});


/** 
GET
Admin - Create New Post  
*/ 
router.get('/add-post', authMiddleware, async (req, res) => {//how does middleware work?

    try{
        const locals = {
            title: "Add Post",
            description: "Blog using Nodejs, Express and MongoDB"
        }

        const data = await Post.find();
        res.render('admin/add-post', {
            locals,
            layout: adminLayout
        })
    }
    catch(e){
        console.log(e)
    }
});

/** 
POST
Admin - Create New Post  
*/ 
router.post('/add-post', authMiddleware, async (req, res) => {//how does middleware work?

    try{
        try{
            const newPost = new Post({
                title: req.body.title,
                body: req.body.body
            })

            await Post.create(newPost)
            res.redirect('/dashboard')
        }
        catch(e){
            console.log(e)
        }
    }
    catch(e){
        console.log(e)
    }
});




module.exports = router;