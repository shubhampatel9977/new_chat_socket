const cors = require('cors');

// const corsOptions = {
//   origin: '*', // Allow only this origin
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Allow specific HTTP methods
//   allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
//   credentials: true, // Allow cookies to be sent with requests
//   optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
// };

const corsOption={
  origin:'http://localhost:3000',
  credentials:true
};

const configureCors = () => {
  return cors(corsOption);
};

module.exports = configureCors;