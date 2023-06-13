
const jwtSecret = process.env.JWT_SECRET;

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



const AcademaiRegisterSchema = new mongoose.Schema({
  idNumber: { type: String, required: true, unique: true },
  ownerName: { type: String, required: true },
  academiaName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  photos: [String],
  location: {
    city: { type: String, required: true },
    block: { type: String, required: true },
    building: { type: String, required: true },
    street: { type: String, required: true },
  },
  subscriptionType: { type: String, required: true },
  costMonth: { type: Number, required: true },
  costMonth3: { type: Number, required: true },
  costMonth6: { type: Number, required: true },
  costYearly: { type: Number, required: true },
  gender: { type: String, required: true },
  aboveAge: { type: Number, required: true },
  belowAge: { type: Number, required: true },
  selectedSports: [],
  payments: [
    {
      invoice: {
        type: Number,
      
      },
      fullName: {
        type: String,
      
      },
      age: {
        type: Number,
      },
      number: {
        type: String,
      
      },
      playerId: {
        type: String,
      
      },
      email: {
        type: String,
      
      },
      amount: {
        type: Number,
      
      },
      period: {
        type: String,
      
      },
      createdDate: {
        type: Date,
        default: Date.now,
      },
      
      expireDate: {
        type: Date,
      },

      academiaName: {
        type: String,
      
      },
      academiaPhoneNumber: {
        type: String,
      
      },
      selectedSport: {
        type: String,
      
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AcademaiRegister',
      },
    },
  ],
  paymentsForEvents:[
    ({
      invoice:{type:Number,},
      academia:{type: String,},
      teamCount: { type: Number,},
      finalprice: { type: String,},
      location: { type: String,},
      date: { type: Date, default: Date.now }
    })
  ]
  

});



AcademaiRegisterSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Add generateAuthToken method to the schema
AcademaiRegisterSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id }, jwtSecret, { expiresIn: "1h" });
  console.log("Generated token:", token); // Add this line
  return token;
};

const saltRounds = 10;

// Pre-save hook to hash the password before saving the user
// Hash the password before saving
AcademaiRegisterSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
      return next(err);
    }
  }
  next();
});



// Post-save hook to copy data to InvoiceAdmin
AcademaiRegisterSchema.post('save', async function(doc, next) {
  const InvoiceAdmin = require('./InvoiceAdmin');

  try {
    const invoiceAdmin = await InvoiceAdmin.findOne({ academiaName: doc.academiaName });
    
    if (!invoiceAdmin) {
      // If no document found, create a new one
      await InvoiceAdmin.create({
        academiaName: doc.academiaName,
        payments: doc.payments,
        paymentsForEvents: doc.paymentsForEvents
      });
    } else {
      // If document found, add new payments and paymentsForEvents
      doc.payments.forEach(payment => {
        if (!invoiceAdmin.payments.find(p => p.invoice === payment.invoice)) {
          invoiceAdmin.payments.push(payment);
        }
      });

      doc.paymentsForEvents.forEach(paymentForEvent => {
        if (!invoiceAdmin.paymentsForEvents.find(p => p.invoice === paymentForEvent.invoice)) {
          invoiceAdmin.paymentsForEvents.push(paymentForEvent);
        }
      });

      await invoiceAdmin.save();
    }

    console.log('InvoiceAdmin has been updated');
    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
});


const AcademaiRegister = mongoose.model("AcademaiRegister", AcademaiRegisterSchema);

module.exports = AcademaiRegister;