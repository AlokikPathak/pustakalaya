
var mongoose = require('mongoose');
var moment = require('moment');// For formatting lifespan of author

var Schema = mongoose.Schema;

// Author Schema
var AuthorSchema = new Schema(
    {
        first_name: {type: String, require: true, max: 100},
        family_name: {type: String, required: true, max: 100},
        date_of_birth: {type: Date},
        date_of_death: {type: Date}
    }
);

// Virtual for author's full name
AuthorSchema
.virtual('name')
.get(function() {
    return this.family_name + ', '+ this.first_name;
});

// Virtual for author's lifespan
AuthorSchema
.virtual('lifespan')
.get(function() {
    return this.date_of_death.getYear() - this.date_of_birth.getYear();
});

// Virtual for author's URL
AuthorSchema
.virtual('url')
.get(function() {
    return '/catalog/author/' + this._id;
});


// Virtual formated Author's date
AuthorSchema
.virtual('DOB')
.get(function() {

  //  var lifespan = this.date_of_death.getYear() - this.date_of_birth.getYear();
    return this.date_of_birth ? moment(this.date_of_birth).format('YYYY-MM-DD') : '';

});

// Export model
module.exports = mongoose.model('Author', AuthorSchema);

