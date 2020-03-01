import express, { Router, Request, Response } from "express"
import User from "../models/User"

// * All routes under /classes/*
const router = express.Router()


router.get("/userlist", (req: Request, res: Response) => {
    // TODO: Write route that returns list of users watched classes
    res.status(501).send("TODO")
})

router.post("/add", async (req: Request, res: Response) => {
    // TODO: Write route that adds class to users list of watched classes

    //* get user's email before making post request
    const userEmail = req.body.email;
    const classes = req.body.classes;

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
    // TODO: Write route that removes class from users list of watched classes

    const userEmail = req.body.email
    const classToRemove = req.body.class;
    console.log(classToRemove);


    try {
        await User.find({email: userEmail }).lean().then(
            data => {
                const parsedDoc = JSON.stringify(data)
                console.log("data: " + parsedDoc );
                res.status(200).json(data)
            }
        ).catch(
            error => res.json({ error: error.message })
        );
    } catch (error) {
        console.log(error)
    }

    //------------------------------------------------------
    // { thoughts }
    //get authinticated user 
    //get the nested the class under user's collection    
    //delete that class
    //------------------------------------------------------

    //res.status(200).send("TODO")
})

router.get("/subjects", (req: Request, res: Response) => {
    // TODO: Write route that grabs class subjects list from Banner DB and returns them
    
    //use some .find method to get data dummy data from mongo
    console.log("testing")

    res.status(200).send("TODO")
})

router.get("/list/:subject", (req: Request, res: Response) => {
    // TODO: Write route that grabs class list for provided subject from Banner DB and returns them

    //use some .find method to get data dummy data from mongo

    res.status(501).send("TODO")
})

module.exports = router
