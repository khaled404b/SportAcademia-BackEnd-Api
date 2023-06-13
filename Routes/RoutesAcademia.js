const express = require("express");
const multer = require("multer");
const sharp = require('sharp');
const bcrypt = require('bcrypt');
const saltRounds = 10; 
const AcademaiRegister = require("../Model/Academai");
const { authMiddleware } = require("../middleware/auth/authMiddleware");
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

module.exports = (firebaseApp) => {
  const bucket = firebaseApp.storage().bucket();



  //---------------------------------------------------------------------------------------------------------------
  // Register route ACA
  //---------------------------------------------------------------------------------------------------------------
  
  router.get('/', (req, res) => {
    res.send('Welcome to the Sport Academia API!');
  });
  
  router.post("/registerACA", upload.array("photos"), async (req, res) => {
    const data = req.body;
    console.log("data : " ,data)
    try {
      
      const existingAcademia = await AcademaiRegister.findOne({ idNumber: req.body.idNumber });
  
      if (existingAcademia) {
        return res.status(409).send("ID number already exists.");
      }
  
      const existingAcademia2 = await AcademaiRegister.findOne({ phoneNumber: req.body.phoneNumber });
  
      if (existingAcademia2) {
        return res.status(409).send(" number already exists.");
      }
      const existingAcademia3 = await AcademaiRegister.findOne({ academiaName: req.body.academiaName });
  
      if (existingAcademia3) {
        return res.status(409).send(" name already exists.");
      }
      const photos = req.files;
      const photoUrls = [];
  
      for (const photo of photos) {
        const resizedImageBuffer = await sharp(photo.buffer)
          .resize({ width: 400 , height: 400 })
          .jpeg({ quality: 40 })
          .toBuffer();
  
        const blob = bucket.file(photo.originalname);
        const blobStream = blob.createWriteStream({
          metadata: { contentType: photo.mimetype },
        });
  
        blobStream.end(resizedImageBuffer);
  
        await new Promise((resolve, reject) => {
          blobStream.on("finish", resolve);
          blobStream.on("error", reject);
        });
  
        const photoUrl = `https://firebasestorage.googleapis.com/v0/b/sport-123-123.appspot.com/o/${encodeURIComponent(photo.originalname)}?alt=media`;
        photoUrls.push(photoUrl);
      }
  
      // Parse the selectedSports input as an array
      const selectedSports = JSON.parse(req.body.selectedSports);
  
      const academia = new AcademaiRegister({
        ...req.body,
        location: {
 city: req.body.city,
  block: req.body.block,
  building: req.body.building,
  street: req.body.street,
        },
        photos: photoUrls,
        gender: req.body.gender,
        selectedSports: selectedSports,
        aboveAge: req.body.aboveAge, // Add this line
        belowAge: req.body.belowAge, // Add this line
      });
      
      await academia.save();
      res.status(201).send(academia);
    } catch (err) {
      console.error("There was an error!", err);

      res.status(500).send(err.message);
    }
  });




  //---------------------------------------------------------------------------------------------------------------
  // Login route ACA
  //---------------------------------------------------------------------------------------------------------------
  router.post("/loginACA", async (req, res, next) => {
    const { idNumber, academiaName, password } = req.body;

    try {
      const user = await AcademaiRegister.findOne({ idNumber, academiaName });

      if (!user) {
        return res.status(401).send("Invalid username or password1");
      }

      console.log("Stored password:", user.password); // Add this line
      console.log("Provided password:", password); // Add this line

      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return res.status(401).send("Invalid username or password2");
      }

      const token = await user.generateAuthToken();
      res.status(200).json({ token });
    } catch (err) {
      res.status(500).send(err.message);
    }
  });




//---------------------------------------------------------------------------------------------------------------
// Add this route to get the authenticated user's data
//---------------------------------------------------------------------------------------------------------------
router.get('/academia/me', authMiddleware, async (req, res) => {
  console.log("Authenticated user data:", req.user); // Add this line
  res.send(req.user);
});





//---------------------------------------------------------------------------------------------------------------
// Update user information
//---------------------------------------------------------------------------------------------------------------
router.put('/academia/update', authMiddleware, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    'phoneNumber',
    'password',
    'photos',
    'subscriptionType',
    'costMonth',
    'costMonth3',
    'costMonth6',
    'costYearly',
    'gender',
    'aboveAge',
    'belowAge',
    'selectedSports',
    'location' // Instead of 'location.city', 'location.block', etc.

  ];
  
  const isValidOperation = updates.every((update) =>
  allowedUpdates.includes(update) || update.startsWith('location.')
);


  if (!isValidOperation) {
    console.log("data    4: ",req.body)

    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const filter = { _id: req.user._id };
    const update = { $set: { ...req.body } };

    if (updates.includes('password')) {
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      update.$set.password = hashedPassword;
    }

    const updatedUser = await AcademaiRegister.findOneAndUpdate(filter, update, {
      new: true, 
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).send({ error: 'User not found' });
    }

    const token = await updatedUser.generateAuthToken(); 
    res.send({ user: updatedUser, token }); 
  } catch (error) {
    console.log('Server-side error:', error);
    res.status(400).send(error);
  }
});


 //---------------------------------------------------------------------------------------------------------------
// Get all payments for events
//---------------------------------------------------------------------------------------------------------------
router.get("/paymentsForEvents", async (req, res) => {
  try {
    const userId = req.query.userId; // Fetch the userId from the URL query string

    // Fetch the user with the specified userId and the paymentsForEvents field
    const academiaUser = await AcademaiRegister.findById(userId).select("paymentsForEvents");

    if (!academiaUser) {
      return res.status(404).send("User not found");
    }

    // Send back the paymentsForEvents data
    res.send(academiaUser.paymentsForEvents);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});





return router;

};    
