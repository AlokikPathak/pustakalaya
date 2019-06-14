/**
 * File Name: bookinstanceController.js
 * File Path: LocalLibrary/controllers/bookinstanceController.js 
 * Purpose: Handles bookinstance routes functions
 * @author: Alokik Pathak
 * Created On: 13/06/2019
 */

var Book = require('../models/bookinstance');

// Display list of Books
exports.bookinstance_list = function(req, res) {
   res.send('NOT IMPLEMENTED: Book list');
};

// Display detail page of specific book
exports.bookinstance_detail = function(req, res) {
    res.send("NOT IMPLEMENTED: Book details: "+req.params.id);
};

// Display book create form on GET
exports.bookinstance_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create GET');
};

// Display Book create on POST
exports.bookinstance_create_post = function(req, res) {
    res.send("NOT IMPLEMENTED: Book create POST");
};

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


