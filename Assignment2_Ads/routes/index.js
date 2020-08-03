'use strict';
var express = require('express');
var router = express.Router();
var articlesModel = require('../models/articles');
var passport = require('passport');
var userModel = require('../models/user');
var bcrypt = require('bcryptjs');
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

    /*POST for login*/
    //Try to login with passport
    router.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureMessage: 'Invalid Login'
    }));

    /*Logout*/
    router.get('/logout', function (req, res) {
        req.session.destroy(function (err) {
            res.redirect('/');
        });
    });

    /*POST for register*/
    router.post('/register', function (req, res) {
        //Insert user
        bcrypt.hash(req.body.password, 10, function (err, hash) {
            var registerUser = {
                username: req.body.username,
                password: hash
            };
            //Check if user already exists
            userModel.find({ username: registerUser.username }, function (err, user) {
                if (err) console.log(err);
                if (user.length) return res.redirect('/login');
                const newUser = new userModel(registerUser);
                newUser.save(function (err) {
                    console.log('Inserting');
                    if (err) console.log(err);
                    req.login(newUser, function (err) {
                        console.log('Trying to login');
                        if (err) console.log(err);
                        return res.redirect('/');
                    });
                });
            });
        });
    });

    /*GET for register*/
    router.get('/register', function (req, res) {
        res.render('register');
    });

    /*GET for login*/
    router.get('/login', function (req, res) {
        res.render('login');
    });

});

module.exports = router;
