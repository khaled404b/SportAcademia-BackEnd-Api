const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  invoice:{type:Number,require:true},
  academia:{type: String,require:true},
  teamCount: { type: Number, required: true },
  finalprice: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  description: String,
  image: String,
  category: { 
    type: String, 
    required: true,
  },
  password: { type: String, required: true },
  payments: [paymentSchema] // new payments array
});

module.exports = mongoose.model('Event', eventSchema);
