const mongoose = require("mongoose");

const InvoiceAdminSchema = new mongoose.Schema({
  academiaName: { type: String },

  payments: [
    {
      invoice: { type: Number },
      fullName: { type: String },
      age: { type: Number },
      number: { type: String },
      playerId: { type: String },
      email: { type: String },
      amount: { type: Number },
      period: { type: String },
      createdDate: {
        type: Date,
        default: Date.now,
      },
      expireDate: { type: Date },
      academiaName: { type: String },
      academiaPhoneNumber: { type: String },
      selectedSport: { type: String },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AcademaiRegister',
      },
    },
  ],
  paymentsForEvents:[
    {
      invoice: { type: Number },
      academia: { type: String },
      teamCount: { type: Number },
      finalprice: { type: String },
      location: { type: String },
      date: { type: Date, default: Date.now }
    }
  ]
});

const InvoiceAdmin = mongoose.model("InvoiceAdmin", InvoiceAdminSchema);

module.exports = InvoiceAdmin;
