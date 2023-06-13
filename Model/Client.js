const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const ClientSchema = new mongoose.Schema({
    playerId: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
    
  },
  gender: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },

  number: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  
  resetPasswordCode: {
    type: String,
  },

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
      academiaName: {
        type: String,
    
      },
      academiaPhoneNumber: {
        type: String,
     
      },
      selectedSport: {
        type: String,
      },
      companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AcademaiRegister',
      
      },
    },
  ],
  

});
ClientSchema.methods.comparePassword = async function (candidatePassword) {
  return  await bcrypt.compare(candidatePassword, this.password);
  
};





const saltRounds = 10;

ClientSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('Client', ClientSchema);
