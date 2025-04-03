const express = require('express');
const router = express.Router();
const Post = require('../models/post') 


/** 
GET
HOME 
*/ 
router.get('', async (req, res) => {
    try{
        const locals = {
            title: "Nodejs Blog",
            description: "Blog using Nodejs, Express and MongoDB"
        }

        let perPage = 10;
        let page = req.query.page || 1; //1 => get the first 10 posts

        const data = await Post.aggregate([ { $sort: { createdAt: -1} } ])//-1 = oldest on top (biggest number?)
        .skip(perPage * page - perPage) //calculates how many pages to skip, then skips them (works cuz ordered from most to least recent)
        .limit(perPage)
        .exec(); //executes the query and returns the data / .aggregate, .skip and .limit don't occur until .exec() or .then() occurs

        const count = await Post.countDocuments(); //used to determine if more pages are needed for all the posts (whether to display <view older posts)
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        

        //const data = await Post.find();//finds all the posts
        res.render('index', { 
            locals, //can't be removed, since header is using it
            data, //data to send all the pages to the html file => loops over all data in ejs!!!
            current: page,
            currentRoute: '/',
            nextPage: hasNextPage ? nextPage : null //nextPage is used in index as <a href="/?page=<%= nextPage %>"...<view older posts...
         });

    } catch(e){
        console.log(e);
    }


});




router.get('/about', (req, res) => {
    res.render('about', {
        currentRoute: '/about' //can put in all routes to change button to grey when in that page.
    });
});


/** 
GET
POST :id 
*/ 
router.get('/post/:id', async (req, res) => {
    try{
        let slug = req.params.id;

        const data = await Post.findById({_id: slug})


        const locals = {
            title: data.title,
            description: "Blog using Nodejs, Express and MongoDB"
        }


        res.render('post', { 
            locals, 
            data,
            currentRoute: `/post${slug}`
        })



    } catch(e){
        console.log(e);
    }


});

/** 
POST
Post
*/ 
router.post('/search', async (req, res) => { 
    //does post causes url to change with
    //app.use(express.urlencoded({ extended: true})) and
    //app.use(express.json())???
    try{
        const locals = {
            title: "Search",
            description: "Blog using Nodejs, Express and MongoDB"
        }

        let searchTerm = req.body.searchTerm; //reading form we called searchTerm in ejs file
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")//removes special characters (if char not in [], replace with "")

        const data = await Post.find({
            $or: [ //or is mongoDB oporator (match with either) //i => case insensitive
              { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }}, 
              { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
            ]

            //new RegExp(a,"i") => creates a new case unsensitive expression (a##b => ab)
            //"$reg ex" allows you (the key? ("title" and "body")) to read the expression to know what to compare with
          });
            
        res.render("search", {
            data,
            locals,
            currentRoute:'/'
        })

    } catch(e){
        console.log(e);
    }
});





module.exports = router;























//Only need to run this once to get info on database
//
// function insertPostData () {
//   Post.insertMany([
//     {
//       title: "Building APIs with Node.js",
//       body: "Learn how to use Node.js to build RESTful APIs using frameworks like Express.js"
//     },
//     {
//       title: "Deployment of Node.js applications",
//       body: "Understand the different ways to deploy your Node.js applications, including on-premises, cloud, and container environments..."
//     },
//     {
//       title: "Authentication and Authorization in Node.js",
//       body: "Learn how to add authentication and authorization to your Node.js web applications using Passport.js or other authentication libraries."
//     },
//     {
//       title: "Understand how to work with MongoDB and Mongoose",
//       body: "Understand how to work with MongoDB and Mongoose, an Object Data Modeling (ODM) library, in Node.js applications."
//     },
//     {
//       title: "build real-time, event-driven applications in Node.js",
//       body: "Socket.io: Learn how to use Socket.io to build real-time, event-driven applications in Node.js."
//     },
//     {
//       title: "Discover how to use Express.js",
//       body: "Discover how to use Express.js, a popular Node.js web framework, to build web applications."
//     },
//     {
//       title: "Asynchronous Programming with Node.js",
//       body: "Asynchronous Programming with Node.js: Explore the asynchronous nature of Node.js and how it allows for non-blocking I/O operations."
//     },
//     {
//       title: "Learn the basics of Node.js and its architecture",
//       body: "Learn the basics of Node.js and its architecture, how it works, and why it is popular among developers."
//     },
//     {
//       title: "NodeJs Limiting Network Traffic",
//       body: "Learn how to limit netowrk traffic."
//     },
//     {
//       title: "Learn Morgan - HTTP Request logger for NodeJs",
//       body: "Learn Morgan."
//     },
//   ])
// }
// insertPostData();