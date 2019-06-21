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
exports.author_create_get = function(req, res) {
    res.send("NOT IMPLEMENTED: Author create GET");
};

// Display Author create on POST.
exports.author_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create POST');
};

// Display Author delete form on GET.
exports.author_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete GET');
};

// Handle Author delete on POST
exports.author_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display Author update form on GET
exports.author_update_get = function(req, res) {
    res.send("NOT IMPLEMENTED: Author update GET");
};

// Handle Author update on POST
exports.author_update_post = function(req, res) {
    res.send("NOT IMPLEMENTED: Author update POST");
};






