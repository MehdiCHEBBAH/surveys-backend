const express = require('express');
var config = require("../config.json");

const router = express.Router();


/************** Global Vars ************/

/************* Routes ************* */
    /**
     * Create a Survey
     */
    router.post('/', async (req, res) => {
        try{
    
            res.status(200);
            res.send({
                // Some data here
            })
        }catch(err){
            res.status(500);
            res.send({error: err});
        }
    });

    /**
     * Get a Survey
     * Note: 
     *    There are two cases here: The surey creator, and a survey taker 
     */
     router.get('/', async (req, res) => {
        try{
    
            res.status(200);
            res.send({
                // Some data here
            })
        }catch(err){
            res.status(500);
            res.send({error: err});
        }
    });

    /**
     * Answer a Survey
     */
     router.put('/', async (req, res) => {
        try{
    
            res.status(200);
            res.send({
                // Some data here
            })
        }catch(err){
            res.status(500);
            res.send({error: err});
        }
    });

    
/********************************** */

module.exports = router;
