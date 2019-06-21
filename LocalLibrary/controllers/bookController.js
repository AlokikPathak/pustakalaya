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
 const { body, validationResult } = require('express-validator');
 const { sanitizeBody } = require('express-validator');

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
 exports.book_detail = function(req, res, next) {
    
    async.parallel({
            book: function(callback) {
                Book.findById(req.params.id)
                .populate('author')
                .populate('genre')
                .exec(callback);
            },

            book_instance: function(callback) {
                BookInstance.find({ 'book': req.params.id })
                .exec(callback)
            }

        }, function(err, results) {

            if(err) { return next(err);}
            if(results.book == null ) {
                var err = new Error('Book not found');
                err.status = 404;
                return next(err);
            }

            //Sucessful, so render
            res.render('book_detail', {title: 'Book Details', book: results.book, book_instances: results.book_instance} );
        }
    )
 };

 // Display book create form on GET
 exports.book_create_get = function(req, res, next) {
     
    // Get all authors and Genres which we can used for adding to our Book
    async.parallel(
        {
        authors: function(callback) {
            Author.find(callback);
        },
        genres: function(callback) {
            Genre.find(callback);
        }
    }, function(err, result) {
        if(err) {return next(err);}

        res.render('book_form', {title: 'Create Book', authors: result.authors, genres: result.genres });
    });
 };

 // Display Book create on POST
 exports.book_create_post = [

    // Convert the Genre to an array
    (req, res, next)=> {
        if(!req.body.genre instanceof Array) {
            if(typeof req.body.genre == undefined) {
                req.body.genre = [];
            }else {
                req.body.genre = new Array(req.body.genre);
            }
        }

        next();
    },

    // Validate fields.
    body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
    body('author', 'Author must not be empty.').isLength({ min: 1 }).trim(),
    body('summary', 'Summary must not be empty.').isLength({ min: 1 }).trim(),
    body('isbn', 'ISBN must not be empty').isLength({ min: 1 }).trim(),
  
    // Sanitize fields (using wildcard).
    sanitizeBody('*').escape(),

    // Process request after validation and sanitization
    (req, res, next)=> {

        // Extract the validation errors from a request
        const errors = validationResult(req);

        // Create a Book object with escaped and trimed data
        var Book = new Book(
            {
                title: req.body.title,
                author: req.body.author,
                summary: req.body.summary,
                isbn: req.body.isbn,
                genre: req.body.genre,
            }
        );

        if(!errors.isEmpty()) {

            // There are errors, render form again with sanitize value/error messages

            // Get all authors and genre for form
            async.parallel({
                authors: function(callback) {
                    Author.find(callback);
                },
                genres: function(callback) {
                    Genre.find(callback);
                },

            }, function(err, results) {

                if(err) { return next(err);}

                // Mark our selected Genre as checked
                for (let i=0; i<results.genres.length; i++) {

                    if( book.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked='true';
                    }
                }

                res.render('book_form', {title: 'Create Book',  authors: results.authors, genres: results.genres, book: book, errors: errors.array() });
                    
            });

            return;
        }else {
            // Data from form is valid save Book
            book.save(function (err) {

                if(err) { return next(err); }

                // Successful, render the new
            });
        }
    }
    

 ];

 // Display Book delete on GET
 exports.book_delete_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Book delete GET');
 };

 // Display Book delete on POST
 exports.book_delete_post = function(req, res) {
     res.send('NOT IMPLEMENTED: Book delete POST');
 };

 // Display Book update form on GET
 exports.book_update_get = function(req, res, next) {
    // Get book, author, genre for form

    async.parallel({
       
        book: function(callback) {
            Book.findById(req.params.id).populate('author').populate('genre').exec(callback);
        },

        authors: function(callback) {
            Author.find(callback);
        },

        genres: function(callback) {
            Genre.find(callback);
        },

    }, function(err, results) {
        if(err) { return next(err); }
        if(results.book == null){
            // no results
            var err= new Error('Book not found');
            err.status = 404;
            return next(err);
        }

        // Success
        // Mark all selected Genre as checked
        for( var all_g_iter = 0; all_g_iter < results.genres.length; all_g_iter++){

            for( var book_g_iter = 0; book_g_iter < results.book.genre.length; book_g_iter++) {

                if(results.genres[all_g_iter]._id.toString()==results.book.genre[book_g_iter]._id.toString()) {

                    results.genres[all_g_iter].checked = true;
                }
            }
        }

        res.render('book_form', { title: 'Update Book', authors: results.authors, genres: results.genres, book: results.book });
    });

 };

// Display Book update on POST
exports.book_update_post = [


    // Convert the genre to an array
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre==='undefined')
            req.body.genre=[];
            else
            req.body.genre=new Array(req.body.genre);
        }
        next();
    },
   
    // Validate fields.
    body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
    body('author', 'Author must not be empty.').isLength({ min: 1 }).trim(),
    body('summary', 'Summary must not be empty.').isLength({ min: 1 }).trim(),
    body('isbn', 'ISBN must not be empty').isLength({ min: 1 }).trim(),

    // Sanitize fields.
    sanitizeBody('title').escape(),
    sanitizeBody('author').escape(),
    sanitizeBody('summary').escape(),
    sanitizeBody('isbn').escape(),
    sanitizeBody('genre.*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        console.log(2);
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped/trimmed data and old id.
        var book = new Book(
          { title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: (typeof req.body.genre==='undefined') ? [] : req.body.genre,
            _id: req.params.id //This is required, or a new ID will be assigned!
           });

        if (!errors.isEmpty()) {

            console.log(4);
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({
                authors: function(callback) {
                    Author.find(callback);
                },
                genres: function(callback) {
                    Genre.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }
                console.log(8);
                // Mark our selected genres as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (book.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked='true';
                    }
                }
                res.render('book_form', { title: 'Update Book',authors: results.authors, genres: results.genres, book: book, errors: errors.array() });
            });
            return;
        }
        else {

            console.log(5);
            // Data from form is valid. Update the record.
            Book.findByIdAndUpdate(req.params.id, book, {}, function (err,thebook) {
                if (err) { return next(err); }
                   // Successful - redirect to book detail page.
                   res.redirect(thebook.url);
                });
        }
    }
];   



