/**
 * Created by EXTIGLGCORREAG on 07/05/2014.
 */
// app/models/bear.js
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var BearSchema   = new Schema({
    name: String
});

module.exports = mongoose.model('Bear', BearSchema);
