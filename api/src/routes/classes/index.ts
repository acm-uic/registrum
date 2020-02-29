import express, { Router, Request, Response } from "express"
import User from "../models/User"

const router = express.Router()
// * All routes under /classes/*

router.get("/userlist", (req: Request, res: Response) => {
    // TODO: Write route that returns list of users watched classes
    res.status(501).send("TODO")
})

router.post("/add", async (req: Request, res: Response) => {
    // TODO: Write route that adds class to users list of watched classes


    try {
    
        const newEntry = new User({
            email: "jigar.moyo@gmail.com",
            password: "test1234",
            listOfClasses: ["CS 494", "CS 401", "CS 341"]
        });

        await newEntry.save();

    } catch (error) {
        console.log("error adding entry");
    }

    res.status(200).send("Testing")

    // { thoughts }

    //validate subject and course 
    //should we check if course is actually offered?

    //get authinticated user 
    //nest the class under user's collection
    //check if user has a collection --> else make a new collection    
})

router.post("/remove", (req: Request, res: Response) => {
    // TODO: Write route that removes class from users list of watched classes

    // { thoughts }

    //get authinticated user 
    //get the nested the class under user's collection    
    //delete that class

    res.status(501).send("TODO")
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
