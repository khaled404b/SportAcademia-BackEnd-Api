require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const firebaseAdmin = require("firebase-admin");
const cors = require('cors');



const routesAcademia = require("./Routes/RoutesAcademia");
const routesPlayer = require('./Routes/RoutesPlayer');
const routesAcademiaCompany = require('./Routes/RoutesAcademiaCompany');
const RoutesPaymentPlayer = require('./Routes/RoutesPaymentPlayer');
const RoutesPaymentACA = require('./Routes/RoutesPaymentACA');
const RoutesEvents = require('./Routes/RoutesEvents');
const RoutesAdmin = require('./Routes/RoutesAdmin');

const errorHandler = require('./middleware/errorHandling');

// MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true, 
})
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Error connecting to MongoDB:", err.message));
mongoose.Promise = global.Promise;


 
// Firebase 
const serviceAccount = require(process.env.FIREBASE_URL);
const firebaseApp = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  storageBucket: "sport-123-123.appspot.com",
});  



// Set up the Express application, including JSON body parsing and CORS support
const app = express();
app.use(bodyParser.json());
app.use(cors());



 
// App
app.use("/", routesAcademia(firebaseApp));
app.use("/", routesPlayer());
app.use("/", routesAcademiaCompany())
app.use('/', RoutesPaymentPlayer());
app.use('/', RoutesPaymentACA());
app.use('/', RoutesAdmin());
app.use("/", RoutesEvents(firebaseApp))

app.use(errorHandler);



// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
