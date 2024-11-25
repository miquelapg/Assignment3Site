const mongoose = require('mongoose');

//creating movie model
let movieModel = mongoose.Schema({
    Name: String,
    Genre: String,
    Year: Number,
    Review: String
},
{
    collection: "movies"
}
);
module.exports = mongoose.model('Movie', movieModel);