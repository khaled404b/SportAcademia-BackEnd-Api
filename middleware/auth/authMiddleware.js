const jwt = require("jsonwebtoken");
const AcademaiRegister = require("../../Model/Academai");

const jwtSecret = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
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


// const isAuthenticated = (req, res, next) => {
//   const authHeader = req.header('Authorization');
//   if (!authHeader) {
//     return res.status(401).json({ message: 'No token provided' });
//   }

//   const token = authHeader.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ message: 'No token provided' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };


// const isAdmin = (req, res, next) => {
//   if (req.user.role === 'admin') {
//     next();
//   } else {
//     res.status(403).json({ message:'Forbidden: You do not have permission to perform this action' });
//   }
//   };



module.exports = {
  // isAuthenticated,
  // isAdmin,
  authMiddleware,


};
