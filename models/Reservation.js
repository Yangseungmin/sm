var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var schema = new Schema({
  check_in: {type: Date, required: true},
  check_out:{type: Date, required: true},
  people:{type: Number, required: true},
  status:{type: Number, default: 0},
  post_id: {type: ObjectId, required: true},
  user_id: {type: ObjectId, required: true},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

var Reservation = mongoose.model('Reservation', schema);

module.exports = Reservation;