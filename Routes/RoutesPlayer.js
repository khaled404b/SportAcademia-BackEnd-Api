const express = require("express");
const nodemailer = require('nodemailer');
const crypto = require('crypto')
const Client = require('../Model/Client');
const router = express.Router();


module.exports = () => {

//---------------------------------------------------------------------------------------------------------------
// Register route for Client
//---------------------------------------------------------------------------------------------------------------
router.post('/registerClient', async (req, res) => {
    try {
      console.log(req.body); // Add this line to log the request body
  
      const existingClient = await Client.findOne({ playerId: req.body.playerId });
      const existingnumber = await Client.findOne({ number: req.body.number });
      if (existingClient) {
        return res.status(409).send('Player ID already exists.');
      }
      if(existingnumber){
        return res.status(409).send("number is exits")
      }
      const client = new Client(req.body);
      await client.save();
      res.status(201).send(client);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  
  
  

  //---------------------------------------------------------------------------------------------------------------
  // Login route for Client
  //---------------------------------------------------------------------------------------------------------------
  router.post('/LoginClient', async (req, res) => {
    const { playerId, password } = req.body;
  
    try {
      const user = await Client.findOne({ playerId });
  
      if (!user) {
        res.status(401).json({ message: 'Invalid id or username or password.' });
        return;
      }
      
  
      // Use bcrypt to compare passwords
      const isMatch = await user.comparePassword(password);
  
      if (!isMatch) {
        res.status(401).json({ message: 'Invalid2 id or username or password.' });
      } else {
        const { password, ...dataWithoutPassword } = user.toObject();
        res.status(200).json(dataWithoutPassword);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.' });
    }
  });
  
  //------------------------------------------------------------------------------------------------


  const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
      user: 'FreeLanceWork-123@outlook.com',
      pass: '123qwe123qwe',
    },
  });

  const code = crypto.randomBytes(3).toString('hex').toUpperCase();
  
  router.post('/requestResetPassword', async (req, res) => {
    const { number } = req.body;
  
    try {
      const user = await Client.findOne({ number });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
  
      user.resetPasswordCode = code;
      await user.save();
  
  
  
      const mailOptions = {
        from: 'FreeLanceWork-123@outlook.com',
        to: user.email,
        subject: 'Reset Password',
        text: `Here is your password reset code: ${code}\n\nPlease enter this code in the app to reset your password.`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res.status(500).json({ message: 'Error sending email.' });
        } else {
          res.status(200).json({ message: 'Password reset email sent.' });
        }
      });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.' });
    } 
  });
  
  //-----------------------------------------------------------------------------------------------------
  router.post('/resetPassword', async (req, res) => {
    const { code, newPassword } = req.body;
  
    try {
      console.log('Reset code received:', code); // Log the received reset code
  
      const user = await Client.findOne({ resetPasswordCode: code });
  
      if (!user) {
        console.log('User not found for reset code:', code); // Log if no user is found
        return res.status(404).json({ message: 'Invalid reset code.' });
      }
  
      user.password = newPassword;
      user.resetPasswordCode = undefined; // Clear the reset code
      await user.save();
      res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.' });
    }
  });
  


  return router;
};    