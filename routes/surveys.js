const express = require('express');
const { randomUUID } = require('crypto');
var fs = require('fs');

var config = require("../config.json");

const router = express.Router();


/************** Global Vars ************/


/************** Tools *****************/
var getSharedURL = (surveyID)=>{
    return `/api/v0/surveys/${surveyID}`;
}
/************* Routes ************* */
    /**
     * Create a Survey
     */
    router.post('/', async (req, res) => {
        try{
            id = randomUUID();
            let survey = {
                ID: id,
                title: req.body.title || "Not Specified",
                description: req.body.description || "Not Specified",
                questions: {},
                answers: []
            };
            req.body.questions.forEach( (element, index) => {
                req.body.questions[index] = {sectionTitle: element.title, ...element.questions}
            });
            survey.questions = {...req.body.questions}

            fs.writeFile(`Surveys/${id}.json`, JSON.stringify(survey), 'utf8', (err)=>{
                if(err) throw err;
            });

            res.status(200);
            res.send(survey)
        }catch(err){
            res.status(500);
            res.send({error: "Error saving your survey, Please try again!"});
        }
    });

    /**
     * Get a Survey
     */
    router.get('/:id', async (req, res) => {

        let id = req.params.id;
        try{
            var {ID, title, description, questions} = require(`../Surveys/${id}.json`)
        }catch(err){
            res.status(404).send({error: "Survey Not Found"});
        }

        res.status(200);
        res.send({ID, title, description, questions})
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
    
    /**
     * Get the results of a Survey
     */
     router.get('/:id/results', async (req, res) => {
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
