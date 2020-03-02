import express, { Router, Request, Response } from "express"
import User from "../models/User"
import Classes from "../models/Classes"

// * All routes under /classes/*
const router = express.Router()

router.get("/userlist", async (req: Request, res: Response) => {
    // TODO: Write route that returns list of users watched classes

    const userEmail = req.query.email;
    let jsonClassList = null;
    
    try {
        // * querying user data from mongoDB
        const document = await User.find({email: userEmail }).lean();
        const studentsClasses = document[0].listOfClasses;
        jsonClassList = JSON.stringify(studentsClasses);
    } catch (error) {
        console.log(error)
    }

    res.status(200).send("test: listing users's watched classes: " + jsonClassList);
})

router.post("/add", async (req: Request, res: Response) => {
    // TODO: Write route that adds class to users list of watched classes
    
    //* get user's email before making post request
    const userEmail = req.body.email;
    const classes = req.body.classes;

    //FIXME: fix this by sending classes in an array or JSON object with request 
    //* classes are sent in seperated by commas --> need to separate them by commas into an array
    const classesSplit = classes.split(',');

    //------------------------------------------------------
    try {
    
        const newEntry = new User({
            email: userEmail,
            password: "test1234",
            listOfClasses: classesSplit
        });

        await newEntry.save();

    } catch (error) {
        console.log("error adding entry: " +  error);
    }
    //------------------------------------------------------

    res.status(200).send("Testing add functionality")

        // { thoughts }

        //validate subject and course 
        //should we check if course is actually offered?

        //check if user authinticated or not

        //get authinticated user 
        //nest the class under user's collection
        //check if user has a collection --> else make a new collection 
    //------------------------------------------------------
})

router.post("/remove", async (req: Request, res: Response) => {
    //TODO: Write route that removes class from users list of watched classes
    //TODO: fix bug --> doen't work when listOfClasses array has leading/tailing spaces in string
    //TODO: possible bug solution --> remove leading/tailing spaces when adding classes after delimiting by commas

    const userEmail = req.body.email
    const classToRemove = req.body.class;
    console.log(classToRemove);

    try {

        const document = await User.find({email: userEmail }).lean();
        const studentsClasses = document[0].listOfClasses;

        for (let index = 0; index < studentsClasses.length; index++) {
            const element = studentsClasses[index];
            if(element == classToRemove){
                studentsClasses.splice(index);
            }
        }

        await User.updateOne({ email: userEmail }, {
            listOfClasses: studentsClasses
        })

    } catch (error) {
        console.log(error)
    }

    res.status(200).send("TODO")

    //------------------------------------------------------
    // { thoughts }
    //get authinticated user 
    //get the nested the class under user's collection    
    //delete that class
    //------------------------------------------------------

    //res.status(200).send("TODO")
})

router.get("/subjects", async (req: Request, res: Response) => {
    // TODO: Write route that grabs class subjects list from Banner DB and returns them
    //using dummy data from mongoDB --> will be retriving the data from microservice
    //make a separate Data Model

    const allDocs = {};
    const allData = await Classes.find(allDocs);
    const subjectsArray = [];
    
    for (let index = 0; index < allData.length; index++) {
        const element = allData[index];
        // console.log("element: " + element.subjectName );
        subjectsArray.push(element.subjectName)
    }

    res.status(200).send("TODO: " + subjectsArray)
})

//* example get request --> http://localhost:8080/classes/list/CS
router.get("/list/:subjectCodeName", async (req: Request, res: Response) => {
    // TODO: Write route that grabs class list for provided subject from Banner DB and returns them
    //using dummy data from mongoDB --> will be retriving the data from microservice

    const subjectParam = req.params.subjectCodeName;
    console.log(subjectParam)

    const allDocs = {};
    const allData = await Classes.find(allDocs);
    let classesArray = [];
    
    for (let index = 0; index < allData.length; index++) {
        const element = allData[index];
        if(subjectParam == element.codeName){
            classesArray = element.subjectClasses;
        }
    }

    res.status(200).send("TODO: " + classesArray)
})

module.exports = router
