/**
 * File Name: bookController.js
 * File Path: LocalLibrary/controllers/bookController.js 
 * Purpose: Handles book routes functions
 * @author: Alokik Pathak
 * Created On: 13/06/2019
 */

 // Requiring mongoose Models build to interact with DB 
 var Book = require('../models/book');
 var Author = require('../models/author');
 var BookInstance = require('../models/bookinstance');
 var Genre = require('../models/genre');


 var async = require('async');

 exports.index = function(req, res) {
    
    /**
     * Executes all callbacks in parallel(same time) and when all operation gets completed,
     * stores the final result in second arg callback function's result parameter
     * If error occured in any of callback(s), second arg(callback function) is executed immediately which send the error
     **/
    async.parallel({

        book_count: function(callback) {
            // Pass an empty object as match condition to find all documents of this condition
            Book.countDocuments({}, callback);
        },
        book_instance_count: function(callback) {
            BookInstance.countDocuments({}, callback);
        },
        book_instance_available_count: function(callback) {
            BookInstance.countDocuments({status:'Available'}, callback);
        },
        author_count: function(callback) {
            Author.countDocuments({}, callback);
        },
        genre_count: function(callback) {
            Genre.countDocuments({}, callback);
        }
        // Secound arg stores the errors or final result of all operation
    }, function(err, result) {

        /**
         * Note: The callback function from async.parallel() above is a little unusual
         * in that we render the page whether or not there was an error 
         * (normally you might use a separate execution path for handling the display of errors).
         */
        res.render('index', { title: 'Pustakalaya Home', error: err, data: result});
    });


 };

 // Display list of all Books
 exports.book_list = function(req, res) {
    
    /**
     * Finds all records and returns only title and author
     * populate() on Book, specifying the author field will replace the store
     * book's author id with full author details
     */
    Book.find({}, 'title author')
    .populate('author')
    .exec(function (err, list_books) {
        if(err) { return next(err);}
        // successful so render
        res.render('book_list', {title: 'Book List', book_list: list_books });
    })
 };

 // Display detail page of specific book
 exports.book_detail = function(req, res) {
     res.send("NOT IMPLEMENTED: Book details: "+req.params.id);
 };

 // Display book create form on GET
 exports.book_create_get = function(req, res) {
     res.send('NOT IMPLEMENTED: Book create GET');
 };

 // Display Book create on POST
 exports.book_create_post = function(req, res) {
     res.send("NOT IMPLEMENTED: Book create POST");
 };

 // Display Book delete on GET
 exports.book_delete_get = function(req, res) {
     res.send('NOT IMPLEMENTED: Book delete GET');
 };

 // Display Book delete on POST
 exports.book_delete_post = function(req, res) {
     res.send('NOT IMPLEMENTED: Book delete POST');
 };

 // Display Book update form on GET
 exports.book_update_get = function(req, res) {
     res.send('NOT IMPLEMENTED: Book update GET');
 };

// Display Book update on POST
exports.book_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update POST');
};


