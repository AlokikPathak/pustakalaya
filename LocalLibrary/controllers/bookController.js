/**
 * File Name: bookController.js
 * File Path: LocalLibrary/controllers/bookController.js 
 * Purpose: Handles book routes functions
 * @author: Alokik Pathak
 * Created On: 13/06/2019
 */

 var Book = require('../models/book');

 exports.index = function(req, res) {
     res.send("NOT IMPLEMENTED: Site Home page" );
 };

 // Display list of Books
 exports.book_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Book list');
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


