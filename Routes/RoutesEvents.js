const express = require('express');
const sharp = require('sharp');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const Event = require('../Model/Event');
// const { isAuthenticated, isAdmin } = require('../middleware/auth/authMiddleware');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

module.exports = (firebaseApp) => {
  const bucket = firebaseApp.storage().bucket();

  router.get('/getEvent', async (req, res) => {
    try {
      const { page = 1, limit = 10, category } = req.query;
  
      const query = {};
      if(category) query.category = { $regex: category, $options: 'i' };
  
      const events = await Event.find(query)
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));
  
      const totalEvents = await Event.countDocuments(query);
      res.status(200).json({ events, totalPages: Math.ceil(totalEvents / Number(limit)) });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching events' });
    }
  });
  router.get('/getEvent/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).select('-password');
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json({ event });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching event' });
    }
});


  

router.post('/PostEvent', upload.single('image'), async (req, res) => {
  try {
    console.log(req.body); // Log the request body to check if it's as expected

    const { name, date, location, description, category, password,price } = req.body;

    if (!name || !date || !location || !description || !category || !price) {
      throw { statusCode: 400, message: 'Name, date, location, description, category, and price are required' };
    }
    

    // If password is not provided, throw an error
    if (!password) {
      throw { statusCode: 400, message: 'Password is required' };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let image;

    if (req.file) {
      const resizedImageBuffer = await sharp(req.file.buffer)
        .resize({ width: 400, height: 400 })
        .jpeg({ quality: 40 })
        .toBuffer();

      const fileName = `${Date.now()}-${req.file.originalname}`;

      const blob = bucket.file(fileName);
      const blobStream = blob.createWriteStream({
        metadata: { contentType: req.file.mimetype },
      });

      blobStream.end(resizedImageBuffer);

      await new Promise((resolve, reject) => {
        blobStream.on("finish", resolve);
        blobStream.on("error", reject);
      });

      image = `https://firebasestorage.googleapis.com/v0/b/sport-123-123.appspot.com/o/${encodeURIComponent(fileName)}?alt=media`;
    }

    const newEvent = new Event({ name, date, location, description, category, image, password: hashedPassword, price });
    await newEvent.save();

    res.status(201).json(newEvent);
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).json({ error: error.message || 'Error creating event' });
  }
});






router.put('/PutEvent/:id',  upload.single('image'), async (req, res) => {
  try {
    const { name, date, location, description, category, password, price } = req.body;

    if (!name || !date || !location || !password || !price) {
      throw { statusCode: 400, message: 'Name, date, location, password, and price are required' };
    }

    const updatedData = { name, date, location, description, category, price };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    updatedData.password = hashedPassword;

    if (req.file) {
      const resizedImageBuffer = await sharp(req.file.buffer)
        .resize({ width: 400, height: 400 })
        .jpeg({ quality: 40 })
        .toBuffer();

      const fileName = `${Date.now()}-${req.file.originalname}`;

      const blob = bucket.file(fileName);
      const blobStream = blob.createWriteStream({
        metadata: { contentType: req.file.mimetype },
      });

      blobStream.end(resizedImageBuffer);

      await new Promise((resolve, reject) => {
        blobStream.on("finish", resolve);
        blobStream.on("error", reject);
      });

      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/sport-123-123.appspot.com/o/${encodeURIComponent(fileName)}?alt=media`;
      updatedData.image = imageUrl;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true },
    );
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message || 'Error updating event' });
  }
});

router.post('/VerifyPassword/:id', async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      throw { statusCode: 400, message: 'Password is required' };
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const isPasswordMatch = await bcrypt.compare(password, event.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    res.status(200).json({ message: 'Password verified successfully' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message || 'Error verifying password' });
  }
});

  
      router.delete('/DeleteEvent/:id', async (req, res) => {
        try {
      await Event.findByIdAndRemove(req.params.id);
      res.status(200).json({ message: 'Event deleted successfully' });
      } catch (error) {
      res.status(500).json({ error: 'Error deleting event' });
      }
      });







    
      
      return router;
      };
