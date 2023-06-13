const express = require("express");
const AcademaiRegister = require("../Model/Academai");
const router = express.Router();

module.exports = () => {


//---------------------------------------------------------------------------------------------------------------
//  getFootballAcademies 
//---------------------------------------------------------------------------------------------------------------
router.get('/getFootballAcademies', async (req, res) => {
    try {
      const academies = await AcademaiRegister.find({
        selectedSports: {
          $elemMatch: {
            $in: [/football/],
          },
        },
      });
      
      
     
      const filteredData = academies.map((AcademaiRegister) => {
        return {
          idNumber: AcademaiRegister.idNumber,
          academiaName: AcademaiRegister.academiaName,
          phoneNumber: AcademaiRegister.phoneNumber,
          photo: AcademaiRegister.photos[0],
        };
      });
      
  
  
      
      
      console.log(filteredData)
      res.json(filteredData);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  
  //---------------------------------------------------------------------------------------------------------------
  //  GuestBasketballList 
  //---------------------------------------------------------------------------------------------------------------
  router.get('/getBasketballAcademies', async (req, res) => {
    try {
      const academies = await AcademaiRegister.find({
        selectedSports: {
          $elemMatch: {
            $in: [/basketball/],
          },
        },
      });
      
      
      const filteredData = academies.map((AcademaiRegister) => {
        return {
          idNumber: AcademaiRegister.idNumber,
          academiaName: AcademaiRegister.academiaName,
          phoneNumber: AcademaiRegister.phoneNumber,
          photo: AcademaiRegister.photos[0],
        };
      });
      
  
  
      
      
      console.log(filteredData)
      res.json(filteredData);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  //---------------------------------------------------------------------------------------------------------------
  //  getTennisAcademies 
  //---------------------------------------------------------------------------------------------------------------
  router.get('/getTennisAcademies', async (req, res) => {
    try {
      const academies = await AcademaiRegister.find({
        selectedSports: {
          $elemMatch: {
            $in: [/tennis/],
          },
        },
      });
      
      
     
      const filteredData = academies.map((AcademaiRegister) => {
        return {
          idNumber: AcademaiRegister.idNumber,
          academiaName: AcademaiRegister.academiaName,
          phoneNumber: AcademaiRegister.phoneNumber,
          photo: AcademaiRegister.photos[0],
        };
      });
      
  
  
  
      
      
      console.log(filteredData)
      res.json(filteredData);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  
  
  //---------------------------------------------------------------------------------------------------------------
  //  getPadelAcademies 
  //---------------------------------------------------------------------------------------------------------------
  router.get('/getPadelAcademies', async (req, res) => {
    try {
      const academies = await AcademaiRegister.find({
        selectedSports: {
          $elemMatch: {
            $in: [/padel/],
          },
        },
      });
      
      
     
      const filteredData = academies.map((AcademaiRegister) => {
        return {
          idNumber: AcademaiRegister.idNumber,
          academiaName: AcademaiRegister.academiaName,
          phoneNumber: AcademaiRegister.phoneNumber,
          photo: AcademaiRegister.photos[0],
        };
      });
      
  
  
  
      
      
      console.log(filteredData)
      res.json(filteredData);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  
  
  //---------------------------------------------------------------------------------------------------------------
  //  getSwimmingAcademies 
  //---------------------------------------------------------------------------------------------------------------
  router.get('/getSwimmingAcademies', async (req, res) => {
    try {
      const academies = await AcademaiRegister.find({
        selectedSports: {
          $elemMatch: {
            $in: [/swimming/],
          },
        },
      });
      
      
    
      const filteredData = academies.map((AcademaiRegister) => {
        return {
          idNumber: AcademaiRegister.idNumber,
          academiaName: AcademaiRegister.academiaName,
          phoneNumber: AcademaiRegister.phoneNumber,
          photo: AcademaiRegister.photos[0],
        };
      });
      
  
  
      
      
      console.log(filteredData)
      res.json(filteredData);
    } catch (error) {
      console.error('Error in /getSwimmingAcademies:', error); // Add this line for error logging
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  
  
  
  //---------------------------------------------------------------------------------------------------------------
  //  getKarateAcademies 
  //---------------------------------------------------------------------------------------------------------------
  router.get('/getKarateAcademies', async (req, res) => {
    try {
      const academies = await AcademaiRegister.find({
        selectedSports: {
          $elemMatch: {
            $in: [/karate/],
          },
        },
      });
      
  
      const filteredData = academies.map((AcademaiRegister) => {
        return {
          idNumber: AcademaiRegister.idNumber,
          academiaName: AcademaiRegister.academiaName,
          phoneNumber: AcademaiRegister.phoneNumber,
          photo: AcademaiRegister.photos[0],
        };
      });
      
  
  
  
      
      
      console.log(filteredData)
      res.json(filteredData);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  
  
  //---------------------------------------------------------------------------------------------------------------
  //  getJudoAcademies 
  //---------------------------------------------------------------------------------------------------------------
  router.get('/getJudoAcademies', async (req, res) => {
    try {
      const academies = await AcademaiRegister.find({
        selectedSports: {
          $elemMatch: {
            $in: [/judo/],
          },
        },
      });
      
      
   
      const filteredData = academies.map((AcademaiRegister) => {
        return {
          idNumber: AcademaiRegister.idNumber,
          academiaName: AcademaiRegister.academiaName,
          phoneNumber: AcademaiRegister.phoneNumber,
          photo: AcademaiRegister.photos[0],
        };
      });
      
  
  
  
  
      
      
      console.log(filteredData)
      res.json(filteredData);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  
  
  //---------------------------------------------------------------------------------------------------------------
  //  getBoxingAcademies 
  //---------------------------------------------------------------------------------------------------------------
  router.get('/getBoxingAcademies', async (req, res) => {
    try {
      const academies = await AcademaiRegister.find({
        selectedSports: {
          $elemMatch: {
            $in: [/boxing/],
          },
        },
      });
      
      
  
      const filteredData = academies.map((AcademaiRegister) => {
        return {
          idNumber: AcademaiRegister.idNumber,
          academiaName: AcademaiRegister.academiaName,
          phoneNumber: AcademaiRegister.phoneNumber,
          photo: AcademaiRegister.photos[0],
        };
      });
      
  
  
  
      
      
      console.log(filteredData)
      res.json(filteredData);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  
  
  //---------------------------------------------------------------------------------------------------------------
  //  getShootingAcademies 
  //---------------------------------------------------------------------------------------------------------------
  router.get('/getShootingAcademies', async (req, res) => {
    try {
      const academies = await AcademaiRegister.find({
        selectedSports: {
          $elemMatch: {
            $in: [/shooting/],
          },
        },
      });
      
      
   
      const filteredData = academies.map((AcademaiRegister) => {
        return {
          idNumber: AcademaiRegister.idNumber,
          academiaName: AcademaiRegister.academiaName,
          phoneNumber: AcademaiRegister.phoneNumber,
          photo: AcademaiRegister.photos[0],
        };
      });
      
  
  
      
      
      console.log(filteredData)
      res.json(filteredData);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  
  
  //---------------------------------------------------------------------------------------------------------------
  //  getGymAcademies 
  //---------------------------------------------------------------------------------------------------------------
  router.get('/getGymAcademies', async (req, res) => {
    try {
      const academies = await AcademaiRegister.find({
        selectedSports: {
          $elemMatch: {
            $in: [/gym/],
          },
        },
      });
      
      
     
      const filteredData = academies.map((AcademaiRegister) => {
        return {
          idNumber: AcademaiRegister.idNumber,
          academiaName: AcademaiRegister.academiaName,
          phoneNumber: AcademaiRegister.phoneNumber,
          photo: AcademaiRegister.photos[0],
        };
      });
      
  
  
  
      
      
      console.log(filteredData)
      res.json(filteredData);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  
  
  //---------------------------------------------------------------------------------------------------------------
  //  getOtherAcademies 
  //---------------------------------------------------------------------------------------------------------------
  router.get('/getOtherAcademies', async (req, res) => {
    try {
      const academies = await AcademaiRegister.find({
        selectedSports: {
          $elemMatch: {
            $in: [/other/],
          },
        },
      });
      
      
   
      const filteredData = academies.map((AcademaiRegister) => {
        return {
          idNumber: AcademaiRegister.idNumber,
          academiaName: AcademaiRegister.academiaName,
          phoneNumber: AcademaiRegister.phoneNumber,
          photo: AcademaiRegister.photos[0],
        };
      });
      
  
  
      
      
      console.log(filteredData)
      res.json(filteredData);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  
  //---------------------------------------------------------------------------------------------------------------
  //  get_Selected_Company 
  //---------------------------------------------------------------------------------------------------------------
  router.get('/getCompany/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const company = await AcademaiRegister.findOne({ idNumber: id });
      res.json(company);
    } catch (err) {
      console.error('Failed to fetch company:', err);
      res.status(500).json({ message: 'Failed to fetch company' });
    }
  });




    
return router;
};    