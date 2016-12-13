
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;



var schema = new Schema({
  title: {type: String, trim: true},
  address : {type : String},
  human : {type : String},
  charge : {type : String},
  convenience : {type : String},
  rule : {type : String},
 
  body: {type: String},

  owner: {
    username: {type: String},
    _id: {type: ObjectId}
  },
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

schema.index({address: "text"});

var Post = mongoose.model('Post', schema);

module.exports = Post;

