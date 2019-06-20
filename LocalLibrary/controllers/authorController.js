/**
 * File Name: authorController.js
 * File Path: LocalLibrary/controllers/authorController.js 
 * Purpose: Handles author routes functions
 * @author: Alokik Pathak
 * Created On: 13/06/2019
 */

var Author = require('../models/author');

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
exports.author_detail = function(req, res) {
    res.send("NOT IMPLEMENTED: Author detail: "+res.params.id);
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






