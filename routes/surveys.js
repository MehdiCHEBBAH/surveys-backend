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

var readSurvey = (surveyID)=>{
    return require(`../Surveys/${surveyID}.json`)
}

var writeSurvey = (surveyID, survey)=>{
    fs.writeFile(`Surveys/${surveyID}.json`, JSON.stringify(survey), 'utf8', (err)=>{
        if(err) throw {error: "Error saving your survey, Please try again!"};
    });
}

var verifyAnswers = (questions, answers) => {
    let nbrSections = Object.keys(questions).length
    console.log("out:", nbrSections , Object.keys(answers).length - 1)
    if(nbrSections != Object.keys(answers).length - 1){
        return false;
    }else{
        for(let i=0; i<nbrSections; i++){
            console.log("in:", nbrSections , Object.keys(answers).length - 1)
            if(Object.keys(questions[i]).length -1 != Object.keys(answers[i]).length){ // The -1 is for the title of the section field which doesn't exist in the answers
                return false;
            }
        }
    }
    return true;
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
                createdAt: new Date().toISOString(),
                questions: {},
                answers: {}
            };
            req.body.questions.forEach( (element, index) => {
                req.body.questions[index] = {sectionTitle: element.title, ...element.questions}
            });
            survey.questions = {...req.body.questions}

            writeSurvey(id, survey);

            res.status(200);
            res.send({sharedURL: getSharedURL(id), ...survey})
        }catch(err){
            res.status(500);
            res.send(err);
        }
    });

    /**
     * Get a Survey
     */
    router.get('/:id', async (req, res) => {

        try{
            let id = req.params.id;
            let {ID, title, description, questions, createdAt} = readSurvey(id);
            res.status(200);
            res.send({ID, title, description, questions, createdAt, sharedURL: getSharedURL(id)})
        }catch(err){
            res.status(404).send({error: "Survey Not Found"});
        }

        
    });

    /**
     * Answer a Survey
     */
     router.put('/:id', async (req, res) => {
        try{

            let id = req.params.id;

            let new_answer = req.body;
            new_answer.createdAt = new Date().toISOString();
            let survey = {}
            try{
                survey = readSurvey(id)
            }catch(err){
                res.status(404).send({error: "Survey Not Found."});
            }

            if(!verifyAnswers(survey.questions, new_answer)){
                throw {error: "You didn't answer correctly the questions"};
            }

            index = Object.keys(survey["answers"]).length.toString();
            survey["answers"][index] = new_answer;
    
            writeSurvey(id, survey)
            res.status(200);
            res.send(survey)
        }catch(err){
            res.status(500);
            res.send(err || {error: "something went wrong, Please try again!!"});
        }
    });
    
    /**
     * Get the results of a Survey
     */
     router.get('/:id/results', async (req, res) => {
        try{
            let id = req.params.id;

            let survey = {}
            try{
                survey = readSurvey(id)
            }catch(err){
                res.status(404).send({error: "Survey Not Found."});
            }

            res.status(200);
            res.send(survey)
        }catch(err){
            res.status(500);
            res.send({error: err});
        }
    });

    
/********************************** */

module.exports = router;
