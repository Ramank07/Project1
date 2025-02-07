
import * as dotenv from 'dotenv';
dotenv.config();

import mongoose from "mongoose";
// import { Db_NAME } from "./constant";
import connectDB from "./db/db.js";








connectDB();

/*
import express from 'express'
const app= express();


;(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${Db_NAME}`)
        app.on(error,(error)=>{
            console.log(error);
            throw error
        })

        app.listen(()=>{
            console.log(`App is listening in ${process.env.PORT}`);
            
        })
    } catch (error) {
        console.log("ERROR",error);
        throw error
    }
})()
    */