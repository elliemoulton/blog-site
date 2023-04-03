//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');

const homeStartingContent =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Urna porttitor rhoncus dolor purus non enim praesent elementum. Dapibus ultrices in iaculis nunc sed. Ornare quam viverra orci sagittis eu volutpat odio.';
const aboutContent =
    'Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.';
const contactContent =
    'Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices.';

const app = express();
app.set('view engine', 'ejs');

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(express.static('public'));

//title case function
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

main().catch((err) => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/blogDB');
}

//create SCHEMA
const { Schema } = mongoose;
const postSchema = new Schema({
    title: String,
    content: String,
});

//create a MODEL
const Post = new mongoose.model('Post', postSchema);


app.get('/', function (req, res) {
    Post.find({}, function (err, posts) {
        res.render('home', {
            homeStartingContent: homeStartingContent,
            posts: posts,
        });
    });
});

app.get('/about', function (req, res) {
    res.render('about', {
        aboutContent: aboutContent,
    });
});

app.get('/contact', function (req, res) {
    res.render('contact', {
        contactContent: contactContent,
    });
});

app.get('/compose', function (req, res) {
    res.render('compose');
});

app.post('/compose', function (req, res) {
    const post = new Post({
        title: toTitleCase(req.body.newPostTitle),
        content: req.body.newPostBody,
    });

    post.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

app.get('/posts/:blogId', (req, res) => {
    const requestedId = req.params.blogId;

    //new mongoDB stuff
    Post.findById(requestedId, function (err, post) {
        if (err) {
            console.log(err);
        } else {
            res.render('posts', {
                title: post.title,
                content: post.content,
            });
        }
    });

});

app.listen(3000, function () {
    console.log('Server started on port 3000');
});
