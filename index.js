const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

var config = require("./config.json");

/**************** Inits ****************** */
    const app = express();


/*********** Middelwares ********* */
    app.use(cors());
    app.use(bodyParser.json());


/*********** GLOBAL VARS ********* */
    const surveysRoutes = require('./routes/surveys');

/* *********** routes ************ */
    app.use('/api/v0/surveys', surveysRoutes);

    
    app.get("/", (req, res) => {
        res.status(200).send("/api/v0/");
      });
    

      let port = 8081
// start the app
app.listen( process.env.PORT || port, ()=>{
    console.log(`started on port ${process.env.PORT || port}`);
});

