'use strict';
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Home' });
});
/* GET ads page. */
router.get('/ads', function (req, res) {
    try {
        //Create a new article using the Articles Model Schema
        const article = new articlesModel({ title: "New article", description: "New description", price: "123.23" });
        //Insert article into DB
        article.save();
        //Retrieve all articles if there is any 
        articlesModel.find({}, function (err, foundArticles) {
            console.log(err);
            console.log(foundArticles);
            //Pass found articles from server to pug file
            res.render('ads', { articles: foundArticles });
        });
    } catch (err) {
        console.log(err);
        res.render('ads', { title: 'Express' });
    }
});

module.exports = router;
