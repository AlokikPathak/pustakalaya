/**
 * File Name: bookinstanceController.js
 * File Path: LocalLibrary/controllers/bookinstanceController.js 
 * Purpose: Handles bookinstance routes functions
 * @author: Alokik Pathak
 * Created On: 13/06/2019
 */

var BookInstance = require('../models/bookinstance');
var moment = require('moment'); // Library to format to time
var Book = require('../models/book');

const { body,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');


// Display list of Books
exports.bookinstance_list = function(req, res, next) {
   
    BookInstance.find()
    .populate('book')
    .exec(function (err, list_bookinstances) {
        if(err) {  return next(err); }

        // successfull, so render
        res.render('bookinstance_list', { title: 'Book Instance List', bookinstance_list: list_bookinstances });

    });

};

// Display detail page of specific BookInstance.
exports.bookinstance_detail = function(req, res, next) {

    BookInstance.findById(req.params.id)
    .populate('book')
    .exec( function (err, bookinstance) {
        if(err) { return next(err); }
        // No results
        if(bookinstance == null) {
            var err = new Error('Book copy not found');
            err.status = 404;
            return next(err);
        }

        // Successful, so render
        res.render('bookinstance_detail',{title: 'Book', bookinstance: bookinstance} );
    })
    
};

// Display book create form on GET
exports.bookinstance_create_get = function(req, res, next) {
    
    Book.find({}, 'title')
        .exec(function(err, books) {

            if(err) { return next(err);}

            // Successful, so render
            res.render('bookinstance_form', {title: 'Create BookInstance', book_list: books});
        });
};

// Display Book create on POST
exports.bookinstance_create_post = [

    // Validate fields
    body('book', 'Book must be specified').isLength({ min: 1}).trim(),
    body('imprint', 'Imprint must be specified').isLength({ min:1 }).trim(),
    body('due_back', 'Invalid date').optional({ checkFalsy: true}).isISO8601(),

    // Sanitize fields
    sanitizeBody('book').escape(),
    sanitizeBody('imprint').escape(),
    sanitizeBody('status').trim().escape(),
    sanitizeBody('due_back').toDate(),

    // Process request after validation and sanitization
    (req, res, next) => {

        // Extract the validation errors from a request
        const errors = validationResult(req);

        // Create BookInstance object with escaped and trimmed data
        var bookinstance = new BookInstance(
            {
                book: req.body.book,
                imprint: req.body.imprint,
                status: req.body.status,
                due_back: req.body.due_back,

            });

        if(!errors.isEmpty()){
            
            // There are errors, render form again with sanitized values and error messages
            Book.find({}, 'title')
                .exec(function (err, books){
                    if(err) { return next(err);}

                    // successful, so render
                    res.render('bookinstance_form', {title: 'Create BookInstance',
                      book_list: books, selected_book: bookinstance.book._id,
                      errors: errors.array(),
                    bookinstance: bookinstance });
            });

            return;

        }else {

            // Data from Form is valid
            bookinstance.save(function(err){

                if(err) { return next(err); }

                // Successful, re-direct to new record
                res.redirect(bookinstance.url);

            });
        }
    }

];

// Display Book delete on GET
exports.bookinstance_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Display Book delete on POST
exports.bookinstance_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display Book update form on GET
exports.bookinstance_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Display Book update on POST
exports.bookinstance_update_post = function(req, res) {
   res.send('NOT IMPLEMENTED: Book update POST');
};


