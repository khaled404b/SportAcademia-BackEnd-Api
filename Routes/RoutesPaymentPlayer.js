const express = require('express');
const router = express.Router();
const axios = require('axios');
const Client = require('../Model/Client');
const AcademaiRegister = require("../Model/Academai");

const getAxiosService = () => axios.create({
  baseURL: 'https://api.tap.company/v2',
  headers: { Authorization: 'Bearer sk_test_XKokBfNWv6FIYuTMg5sLPjhJ' } // Replace 'your_tap_secret_api_key' with your actual Tap API key
});


module.exports = () => {

  async function generateUniqueInvoiceNumber(Client, AcademaiRegister) {
    while (true) {
      const invoiceNumber = Math.floor(Math.random() * 90000000000000) + 10000000000000;
      const clientInvoiceExists = await Client.findOne({ "payments.invoice": invoiceNumber });
      const academaiInvoiceExists = await AcademaiRegister.findOne({ "payments.invoice": invoiceNumber });
  
      if (!clientInvoiceExists && !academaiInvoiceExists) {
        return invoiceNumber;
      }
    }
  }

  router.post('/processPaymentForPlayer', async (req, res) => {
    try {
      const { fullName, companyName, amount, period,email, selectedSport, cardNumber, cvc, expiredate } = req.body;

      // Verify card number using Luhn algorithm
      if (cardNumber.length !==16) {
        return res.status(400).json({ success: false, message: 'Invalid card number.' });
      }

      if (cvc.length !== 3 && cvc.length !== 4) {
        return res.status(400).json({ success: false, message: 'Invalid CVC.' });
      }

      const axiosService = getAxiosService();

      const charge = await axiosService.post('/charges', {
        amount:amount,
        currency: 'KWD', // Set the currency to whatever you're using
        customer: {first_name: fullName, email: email},
        source: {
          id: cardNumber,
          exp_month: expiredate.split('/')[0],
          exp_year: expiredate.split('/')[1],
          cvc: cvc,
          object: 'card',
        },
         redirect: {url: 'https://1f3b186efe31e8696c144578816c5443.m.pipedream.net/'}

      });
   

      // If the charge is successful, save the payment details to your database
      if (charge.data.status === 'CAPTURED') {
        const user = await Client.findOne({ fullName });
        const company = await AcademaiRegister.findOne({ academiaName: companyName });

        const invoiceNumber = await generateUniqueInvoiceNumber(Client, AcademaiRegister);

        user.payments.push({
          invoice: invoiceNumber,
          fullName: user.fullName,
          number: user.number,
          playerId: user.playerId,
          age: user.age,
          email: user.email, 
          amount: amount,
          period: period,
          createdDate: Date.now(),
          expireDate: updateExpireDate(Date.now(), period),
          academiaName: company.academiaName,
          academiaPhoneNumber: company.phoneNumber,
          companyId: company._id,
          selectedSport: selectedSport || 'Not provided',
        });
        
        company.payments.push({
          invoice: invoiceNumber,
          fullName: user.fullName,
          number: user.number,
          playerId: user.playerId,
          age:user.age,
          email: user.email,
          amount: amount,
          period: period,
          createdDate: Date.now(),
          expireDate: updateExpireDate(Date.now(), period),
          academiaName: company.academiaName,
          academiaPhoneNumber: company.phoneNumber,
          userId: user._id,
          selectedSport: selectedSport || 'Not provided',
        });
        
        await user.save();
        await company.save();

        res.status(200).json({ success: true });
      } else {
        res.status(400).json({ success: false, message: 'Payment failed.' });
      }
      
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error.' });
    }
  });

  async function fetchPaymentsDataFromDatabase(playerId) {
    const client = await Client.findOne({ playerId: playerId });

    if (!client) {
      throw new Error('Player not found');
    }

    return client.payments;
  }

  router.get('/payments/:playerId', async (req, res) => {
    try {
      const playerId = req.params.playerId;
      const paymentsData = await fetchPaymentsDataFromDatabase(playerId);
      res.json({ payments: paymentsData });
    } catch (error) {
      console.error('Error fetching payment data:', error);
      res.status(500).json({ error: 'An error occurred while fetching payment data' });
    }
  });

  const updateExpireDate = (createdDate, period) => {
    const date = new Date(createdDate);

    switch (period) {
      case 'month':
        date.setMonth(date.getMonth() + 1);
        break;
      case '3-month':
        date.setMonth(date.getMonth() + 3);
        break;
      case '6-month':
        date.setMonth(date.getMonth() + 6);
        break;
      case 'year':
        date.setFullYear(date.getFullYear() + 1);
        break;
      default:
        throw new Error(`Unsupported period type: ${period}`);
    }

    return date;
  };

  router.get('/academia/:id/payments', async (req, res) => {
    try {
      const academia = await AcademaiRegister.findById(req.params.id);

      if (!academia) {
        res.status(404).json({ message: 'Academia not found', errorType: 'academia' });
        return;
      }

      const payments = academia.payments;

      payments.forEach(payment => {
        payment.expireDate = updateExpireDate(payment.createdDate, payment.period);
      });

      if (!payments) {
        res.status(404).json({ message: 'Payments not found', errorType: 'payments' });
        return;
      }

      res.json({ payments });
    } catch (error) {
      console.error('Error in /academia/:id/payments:', error.stack);
      res.status(500).json({ message: error.message });
    }
  });
  
  return router;
};