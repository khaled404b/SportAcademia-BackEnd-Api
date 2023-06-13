const express = require('express');
const router = express.Router();
const Event = require('../Model/Event');
const AcademaiRegister = require("../Model/Academai");

// Generate a random invoice number
const generateInvoiceNumber = async () => {
    let invoiceNumber;
    let invoiceExists = true;
  
    while (invoiceExists) {
      invoiceNumber = Math.floor(Math.random() * 9000000000) + 1000000000; // This will generate a number between 1000000000 and 9999999999
      invoiceExists = await Event.findOne({'payments.invoice': invoiceNumber});
    }
  
    return invoiceNumber;
  }
  
  router.post('/processPaymentACA', async (req, res) => {
    const { event, academia,price,date,location,teamCount } = req.body;
  const{cardNumber,cvc,expireDate}=req.body;


  if (cardNumber.length !== 16) {
    return res.status(400).json({ success: false, message: 'Invalid card number.' });
  }
if(cvc.length !==3 ){
  if(cvc.length !==4){

return res.status(400).json({success: false,message:'invalid cvc '})
}
}
    // Here is where you would normally interact with a payment processing service.
    const transactionSuccess = true; // replace this with actual payment processing
  



    if (transactionSuccess) {
      try {
        // Find event and update it with new payment
        const finalprice= price*teamCount;
  
        const invoice = await generateInvoiceNumber();
        
        const updatedEvent = await Event.findByIdAndUpdate(
          event._id,
          { $push: { payments: { invoice, academia, teamCount, finalprice, location, date } } },
          { new: true, useFindAndModify: false }
        ); 
        const company = await AcademaiRegister.findOne({ academiaName: academia });
        company.paymentsForEvents.push({
          location: updatedEvent.location,
          date: updatedEvent.date,
          academia: academia,
          invoice: invoice,
          teamCount: teamCount,
          finalprice: finalprice
        })
        await company.save();
        

        if (!updatedEvent) {
          throw new Error('Failed to update event with new payment.');
        }
        if (!company) {
            throw new Error('Failed to update ACA with new payment.');
          }
  
        return res.json({
          success: true,
          message: 'Payment processed and saved successfully.',
          invoice: updatedEvent.payments[updatedEvent.payments.length - 1],

        });
      } catch (err) {
        console.error('Failed to save payment:', err);
        return res.json({
          success: false,
          message: 'Payment processed, but failed to save it.'
        });
      }
    } else {
      return res.json({
        success: false,
        message: 'There was an error processing the payment.'
      });
    }
  });






  
  
  module.exports = () => {
    return router;
  };
  