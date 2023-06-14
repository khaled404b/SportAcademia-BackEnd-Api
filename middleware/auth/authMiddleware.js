const jwt = require("jsonwebtoken");
const AcademaiRegister = require("../../Model/Academai");

const jwtSecret = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).send('Authorization header is required');
  }

  const idToken = authHeader.replace("Bearer ", "");

  try {
    const decodedToken = jwt.verify(idToken, jwtSecret);
    console.log('Decoded token:', decodedToken); // Add this line

    const user = await AcademaiRegister.findOne({ _id: decodedToken._id });

    console.log('User found:', user); // Add this line

    if (!user) {
      throw new Error();
    }

    req.token = idToken;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send("Unauthorized");
  }
};

module.exports = {
  authMiddleware,
};
