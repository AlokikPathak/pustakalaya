/**
 * File Name: genreController.js
 * File Path: LocalLibrary/controllers/genreController.js 
 * Purpose: Handles genre routes functions
 * @author: Alokik Pathak
 * Created On: 13/06/2019
 */

var Genre = require('../models/genre');

// Display list of Books
exports.genre_list = function(req, res) {
   Genre.find()
   .exec( function(err, list_genre){
       if(err) { return next(err);}

       // Successful render view
       res.render('genre_list', { title:'Genre List', genre_list: list_genre});
   });
};

// Display detail page of specific book
exports.genre_detail = function(req, res) {
    res.send("NOT IMPLEMENTED: Book details: "+req.params.id);
};

// Display book create form on GET
exports.genre_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create GET');
};

// Display Book create on POST
exports.genre_create_post = function(req, res) {
    res.send("NOT IMPLEMENTED: Book create POST");
};

// Display Book delete on GET
exports.genre_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Display Book delete on POST
exports.genre_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display Book update form on GET
exports.genre_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Display Book update on POST
exports.genre_update_post = function(req, res) {
   res.send('NOT IMPLEMENTED: Book update POST');
};


