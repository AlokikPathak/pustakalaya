/**
 * File Name: authorController.js
 * File Path: LocalLibrary/controllers/authorController.js 
 * Purpose: Handles author routes functions
 * @author: Alokik Pathak
 * Created On: 13/06/2019
 */

var Author = require('../models/author');
var Book = require('../models/book');

var async = require('async');
const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');

var debug = require('debug')('author');



// Display list of Authors
exports.author_list = function(req, res){
    
    Author.find()
    .sort([['family_name','ascending']])
    .exec( function(err, list_authors){

        if(err){ return next(err);}

        // successful so render
        res.render('author_list',{ title: 'Author List', author_list: list_authors });
    });
};


// Display detail page of a specific Author
exports.author_detail = function(req, res, next) {
   
    async.parallel({
            author: function(callback) {
                Author.findById(req.params.id)
                .exec(callback)
            },

            authors_book: function(callback) {
                Book.find( {'author':req.params.id}, 'title summary')
                .exec(callback)
            },

        }, function(err, results) {
            if(err) { return next(err);} // Error in API usage.
            
            if( results.author == null ) {
                var err = new Error("No author found");
            }

            // Successful, so render
            res.render('author_detail', { title: 'Author Detail', author: results.author, author_books: results.authors_book } );
        }
    );
};

// Display Author create form on GET.
exports.author_create_get = function(req, res, next) {
    res.render('author_form', { title: 'Create Author'});
}

// Display Author create on POST.
exports.author_create_post = [

    
    // Validate fields
    body('first_name').isLength({min:1}).trim().withMessage('First name must be specified')
        .isAlphanumeric().withMessage('First name has non-aplhanumeric charecters.'),
    body('family_name').isLength( {min:1} ).trim().withMessage('Family name must be specified')
        .isAlphanumeric().withMessage('Family name has non-aplhanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy:true }).isISO8601(),
    body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601(),

    // Sanitize fields
    sanitizeBody('first_name').escape(),
    sanitizeBody('family_name').escape(),
    sanitizeBody('date_of_birth').toDate(),
    sanitizeBody('date_of_death').toDate(),

    // Process request after validation and sanitization
    (req, res, next) =>{

        // Extract the validation errors from a request
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            // There are errors, render form again with sanitization and validation errors
            res.render('author_form', { title: 'Create Author', author: req.body, errors: errors.array() });
            return;
        }else {

            // Data from form is valid


            // Create Author object with escaped and trimmed data
            var author = new Author(
                {
                    first_name: req.body.first_name,
                    family_name: req.body.family_name,
                    date_of_birth: req.body.date_of_birth,
                    date_of_death: req.body.date_of_death,
                }
            );

            // Should check the duplicate author
            Author.findOne({ first_name: req.body.first_name, family_name: req.body.family_name})
                .exec( function(err, found_author){

                    if(err) { return next(err);}

                    // If same author exists
                    if(found_author) {
                        // redirect to author detail page
                        res.redirect(found_author.url);

                    } else {

                        // No duplicate found, so create
                        author.save(function (err) {
                            if(err) {return next(err); }
            
                            // Successful, re-direct to new author record
                            res.redirect(author.url);
            
                        }) ;
                    }

                });


        }
    }
];

// Display Author delete form on GET.
exports.author_delete_get = function(req, res, next) {
    
    async.parallel({

        author: function(callback) {
            Author.findById(req.params.id).exec(callback)
        },

        author_books: function(callback) {
            Book.find({ 'author': req.params.id }).exec(callback)
        }

    }, function(err, results) {

        if(err) { return next(err); }

        if( results.author == null ) {
            // no results
            res.redirect('/catalog/authors');
        
        }

        // Successful, so render
        res.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.author_books});

    });
};

// Handle Author delete on POST
exports.author_delete_post = function(req, res) {
   

    async.parallel({

        author: function(callback) {
            Author.findById(req.body.authorid).exec(callback)
        },

        author_books: function(callback) {
            Book.find({'author': req.body.authorid }).exec(callback)
        },
    }, function(err, results) {

        if(err) {return next(err); }

        // Success
        if( results.author_books.length > 0 ) {
            // Author has books, Render in the same way for Get Route

            res.render('author_delete', {title: 'Delete Author', author: results.author, author_books: results.author_books });

            return;

        }else {

            // Author has no books delete Object and redirect to the list of authors
            Author.findByIdAndRemove(req.body.authorid, function deleteAuthor(err){

                if(err) { return next(err); }

                // Success, go to author list
                res.redirect('/catalog/authors');
            } );
        }
    });
};

// Display Author update form on GET
exports.author_update_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST
exports.author_update_post = function(req, res){
    res.send('NOT IMPLEMENTED: Author update POST');
};







