const express = require('express');
const router = express.Router();


//routes
router.get('', (req, res) => {
    const locals = {
        title: "Nodejs Blog",
        description: "Blog using Nodejs, Express and MongoDB"
    }


    res.render('index', { locals });
});

router.get('/about', (req, res) => {
    res.render('about');
});

module.exports = router;